import geopandas as gpd
from shapely.geometry import shape, Polygon
from ..redis_helper import RedisHelper
from .filtering import filtering_gpd_objects

from ..local_config import USER_GPD_DATASET, CRS_3857, CRS_4326, MOSCOW_POLYGONS_DATASET


def generate_objects_intersections(form, uid):
    rh = RedisHelper()
    rectangle_coord = form.pop('rectangleCoord')
    pol_gdf = Polygon([
        [rectangle_coord[0], rectangle_coord[1]],
        [rectangle_coord[0], rectangle_coord[3]],
        [rectangle_coord[2], rectangle_coord[3]],
        [rectangle_coord[2], rectangle_coord[1]]
    ])
    pol_gdf = gpd.GeoDataFrame({
        'geometry': [pol_gdf]},
        crs=CRS_4326
    )

    moscow_polygon = rh.get(MOSCOW_POLYGONS_DATASET)
    moscow_polygon['geometry'] = moscow_polygon['geometry'].apply(
        lambda row: shape(row))
    moscow_polygon = gpd.GeoDataFrame(moscow_polygon, crs=CRS_4326)

    filtering_gpd_objects(form, uid)
    merged_objects_gdf = rh.get(USER_GPD_DATASET.format(uid))
    merged_objects_gdf['geometry'] = merged_objects_gdf['geometry'].apply(lambda row: shape(row))
    merged_objects_gdf = gpd.GeoDataFrame(merged_objects_gdf, crs=CRS_3857)
    merged_objects_gdf = merged_objects_gdf.to_crs(CRS_4326)

    object_intersection = gpd.overlay(merged_objects_gdf, pol_gdf, how='intersection')
    moscow_polygon_intersection = gpd.overlay(moscow_polygon, pol_gdf, how='intersection')

    part = moscow_polygon_intersection['geometry'].area.sum() \
           / moscow_polygon[moscow_polygon['index'].isin(moscow_polygon_intersection['index'])]['geometry'].area.sum()
    people_sum = part * moscow_polygon_intersection['people'].sum()
    people_sum = round(people_sum / 100_000, 2)
    number_of_sport_zones = round(object_intersection['zones_name'].drop_duplicates().count() / people_sum, 2)
    area_of_sport_zones = round(
        object_intersection[['object_name', 'area']].drop_duplicates()['area'].sum() / people_sum, 2)
    types_of_sport_services = round(object_intersection['sport_type'].drop_duplicates().count() / people_sum, 2)
    geometry_rectangle = pol_gdf['geometry'].iloc[0]

    result_rectangle = gpd.GeoDataFrame({
        'numberOfSportZones': [number_of_sport_zones],
        'areaOfSportZones': [area_of_sport_zones],
        'typesOfSportServices': [types_of_sport_services],
        'geometry': [geometry_rectangle]
    }, crs=CRS_4326)

    return result_rectangle
