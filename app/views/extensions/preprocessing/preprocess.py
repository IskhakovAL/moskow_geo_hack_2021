import pandas as pd
from os import getcwd, path
from sklearn.preprocessing import OrdinalEncoder
import geopandas as gpd
from shapely.geometry import mapping

from ..redis_helper import RedisHelper

from .generate_polygons import generate_polygons
from .generate_catalog import generate_catalog
from .generate_plots import generate_plots

from ..local_config import MAIN_DATASET, GPD_DATASET, CRS_3857, CRS_4326


def preprocessing():
    all_object_names = ['object_id', 'object_name', 'address',
                        'organization_id', 'organization_name',
                        'availability_id', 'availability_name',
                        'latitude', 'longitude']

    main_data_path = path.join(getcwd(), 'datasets', 'main_data.xlsx')

    all_object = pd.read_excel(main_data_path,
                               names=all_object_names,
                               sheet_name=0)

    object_type = pd.read_excel(main_data_path,
                                sheet_name=1)

    object_type = object_type.drop(columns=['Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15'], axis=1)
    object_type.columns = ['object_id', 'object_name', 'address',
                           'organization_id', 'organization_name',
                           'zones_id', 'zones_name', 'zones_type',
                           'availability_id', 'availability_name',
                           'sport_type', 'latitude', 'longitude', 'zones_square']

    generate_plots(all_object, object_type)

    area = [0] * all_object.shape[0]
    for i, row in object_type.iterrows():
        ind = all_object.loc[all_object['object_id'] == row['object_id']].index[0]
        if area[ind] is None:
            continue
        elif row['zones_square'] is None:
            area[ind] = None
        else:
            area[ind] += row['zones_square']
    all_object['area'] = area
    all_object['area'] = all_object['area'].fillna(0)

    radius = []
    for i, row in all_object.iterrows():
        if row['availability_name'] == "Шаговая доступность":
            radius.append(500)
        elif row['availability_name'] == "Районное":
            radius.append(1000)
        elif row['availability_name'] == "Окружное":
            radius.append(3000)
        elif row['availability_name'] == "Городское":
            radius.append(5000)
        # если доступность неизвестна, выбираем наименьший радиус
        else:
            radius.append(500)
    all_object['radius'] = radius

    max_area = max(all_object['area'])
    all_object['circle_opacity'] = all_object['area'].apply(lambda x: min(0.9, (x + 100000) / max_area))

    all_object = all_object.sort_values('area')

    merged_objects = all_object[['object_id', 'object_name', 'organization_name', 'availability_name', 'latitude', 'longitude', 'area', 'radius', 'circle_opacity']] \
        .merge(object_type[['object_id', 'zones_name', 'zones_type', 'sport_type']], on=['object_id'], how='left')

    availability_name_dict = {
        'Районное': 'С районной доступностью',
        'Окружное': 'С окружной доступностью',
        'Шаговая доступность': 'С шаговой доступностью',
        'Городское': 'Городского значения'
    }

    merged_objects['availability_name'] = merged_objects['availability_name'].replace(availability_name_dict)

    ord_enc = OrdinalEncoder()

    merged_objects['object_id'] = ord_enc.fit_transform(merged_objects[['object_name']]).astype(int)

    merged_objects['organization_name'] = merged_objects['organization_name'].fillna('Неизвестно')
    merged_objects['organization_id'] = ord_enc.fit_transform(merged_objects[['organization_name']]).astype(int)

    merged_objects['availability_name'] = merged_objects['availability_name'].fillna('Неизвестно')
    merged_objects['availability_id'] = ord_enc.fit_transform(merged_objects[['availability_name']]).astype(int)

    merged_objects['zones_name'] = merged_objects['zones_name'].fillna('Неизвестно')
    merged_objects['zones_name_id'] = ord_enc.fit_transform(merged_objects[['zones_name']]).astype(int)

    merged_objects['zones_type'] = merged_objects['zones_type'].fillna('Неизвестно')
    merged_objects['zones_type_id'] = ord_enc.fit_transform(merged_objects[['zones_type']]).astype(int)

    merged_objects['sport_type'] = merged_objects['sport_type'].fillna('Неизвестно')
    merged_objects['sport_type_id'] = ord_enc.fit_transform(merged_objects[['sport_type']]).astype(int)

    merged_objects_gdf = gpd.GeoDataFrame(
        merged_objects.copy(),
        geometry=gpd.points_from_xy(
            merged_objects.longitude,
            merged_objects.latitude),
        crs=CRS_4326
    )
    merged_objects_gdf = merged_objects_gdf.to_crs(CRS_3857)
    merged_objects_gdf = merged_objects_gdf[~merged_objects_gdf['latitude'].isnull()]

    merged_objects_gdf['geometry'] = merged_objects_gdf.apply(
        lambda row: row['geometry'].buffer(row['radius']), axis=1)

    merged_objects_gdf['geometry'] = merged_objects_gdf['geometry'].apply(
        lambda row: mapping(row))

    rh = RedisHelper()
    rh.rewrite(merged_objects, MAIN_DATASET)
    rh.rewrite(merged_objects_gdf, GPD_DATASET)

    generate_catalog()
    generate_polygons()
