import pandas as pd
from os import getcwd, path
import numpy as np
from flask import g
from sklearn.preprocessing import OrdinalEncoder

import geopandas as gpd
from shapely import wkt

from .create_app import create_app
from .local_config import Config


app_context = create_app(Config).app_context()


# Шаблон ответа сервера на запрос
def generate_resp(status, message, data):
    return {
        'status': status,
        'message': message,
        'data': data
    }


# Ответы сервера
def resp_ok(data=None):
    if data is None:
        data = []
    return generate_resp('ok', 'SUCCESS', data), 200


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

    with app_context:
        if 'merged_objects' not in g:
            g.merged_objects = merged_objects


def generate_catalog():
    with app_context:
        if 'merged_objects' in g:
            merged_objects = g.merged_objects
        catalog = {
            'sportsFacility': merged_objects[['object_id', 'object_name']].drop_duplicates().\
                rename(columns={'object_id': 'id', 'object_name': 'name'}).to_dict('records'),
            'departmentalAffiliation': merged_objects[['organization_id', 'organization_name']].drop_duplicates().\
                rename(columns={'organization_id': 'id', 'organization_name': 'name'}).to_dict('records'),
            'sportsZonesList': merged_objects[['zones_name_id', 'zones_name']].drop_duplicates().\
                rename(columns={'zones_name_id': 'id', 'zones_name': 'name'}).to_dict('records'),
            'sportsZonesTypes': merged_objects[['zones_type_id', 'zones_type']].drop_duplicates().\
                rename(columns={'zones_type_id': 'id', 'zones_type': 'name'}).to_dict('records'),
            'sportsServices': merged_objects[['sport_type_id', 'sport_type']].drop_duplicates().\
                rename(columns={'sport_type_id': 'id','sport_type': 'name'}).to_dict('records'),
            'availability': merged_objects[['availability_id', 'availability_name']].drop_duplicates().\
                rename(columns={'availability_id': 'id','availability_name': 'name'}).to_dict('records')
        }
        g.catalog = catalog


def generate_polygons():
    moscow_population_path = path.join(getcwd(), 'datasets', 'moscow_population.csv')
    moscow_population = pd.read_csv(moscow_population_path, sep=';', encoding='cp1251')

    moscow_polygon_path = path.join(getcwd(), 'datasets', 'moscow_polygon.csv')
    moscow_polygon = pd.read_csv(moscow_polygon_path, sep=',', encoding='cp1251')

    moscow_polygon = moscow_polygon.merge(moscow_population,
                                          left_on='NAME',
                                          right_on='municipality')

    geometry = moscow_polygon['geometry'].map(wkt.loads)
    moscow_polygon = gpd.GeoDataFrame(moscow_polygon, crs="EPSG:4326", geometry=geometry)

    resp = {
        'polygonList': []
    }

    for index, row in moscow_polygon.iterrows():
        geometry = row['geometry']
        opacity = row['opacity']

        if geometry.geom_type == 'Polygon':
            polygon_coords = list(geometry.exterior.coords)
            polygon_coords = [[x[1], x[0]] for x in polygon_coords]

            resp['polygonList'].append({
                'polygon': polygon_coords,
                'fillOpacity': opacity
            })

        if geometry.geom_type == 'MultiPolygon':
            polygon_coords = []
            for b in geometry.boundary:
                coords = np.dstack(b.coords.xy).tolist()
                polygon_coords.append(*coords)

            for polygon in polygon_coords:
                for point in polygon:
                    point[0], point[1] = point[1], point[0]

            resp['polygonList'].append({
                'polygon': polygon_coords,
                'fillOpacity': opacity
            })

    with app_context:
        if 'moscow_polygon' not in g:
            g.moscow_polygon = resp


def filtering_merged_objects(form):
    with app_context:
        if 'merged_objects' not in g:
            return []
        merged_objects = g.merged_objects

        name_to_id = {
            'sportsFacility': 'object_id',
            'departmentalAffiliation': 'organization_id',
            'sportsZonesList': 'zones_name_id',
            'sportsZonesTypes': 'zones_type_id',
            'sportsServices': 'sport_type_id',
            'availability': 'availability_id'
        }

        filtered_merged_objects = merged_objects

        if form:
            for name in name_to_id.keys():
                if form.get(name):
                    filters_ids = [int(val) for val in form.get(name)]
                    filtered_merged_objects = filtered_merged_objects[filtered_merged_objects[name_to_id.get(name)].isin(filters_ids)]

        filtered_merged_objects = filtered_merged_objects[filtered_merged_objects.columns[:9]].drop_duplicates()
        filtered_merged_objects = filtered_merged_objects[~filtered_merged_objects['latitude'].isnull()]
        locations = list(zip(filtered_merged_objects['latitude'], filtered_merged_objects['longitude']))
        popup_pattern = 'Наименование: {}<br>Ведомственная принадлежность: {}<br>Доступность: {}'
        popups = [
            popup_pattern.format(row['object_name'], row['organization_name'], row['availability_name'])
            for i, row in filtered_merged_objects.iterrows()]
        areas = [ar for ar in filtered_merged_objects['area']]
        radius = [rad for rad in filtered_merged_objects['radius']]
        circle_opacity = [ci_op for ci_op in filtered_merged_objects['circle_opacity']]
        return locations, popups, areas, radius, circle_opacity


def generate_locations(form):
    locations, popups, areas, radius, circle_opacity = filtering_merged_objects(form)
    resp = {
        'markers': [],
        'circles': []
    }
    with app_context:
        if 'moscow_polygon' not in g:
            resp.update({'polygonList': []})
        resp.update(g.moscow_polygon)

    for i in range(len(locations)):
        resp['markers'].append({
            'position': list(locations[i]),
            'popup': popups[i]
        })
    for i in range(len(locations)):
        resp['circles'].append({
            'position': list(locations[i]),
            'area': areas[i],
            'radius': radius[i],
            'fillOpacity': circle_opacity[i]
        })
    return resp


def get_catalog():
    with app_context:
        if 'catalog' not in g:
            return {}
        return g.catalog
