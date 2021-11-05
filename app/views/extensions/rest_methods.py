from .redis_helper import RedisHelper
from .rest_logic import filtering_main_objects, generate_polygons_intersections, filtering_gpd_objects,\
    generate_empty_zones, zip_shape
from .local_config import CATALOG_DICT, MOSCOW_POLYGONS_DATASET, USER_MAIN_DATASET, USER_GPD_DATASET,\
    CRS_4326, CRS_3857

from shapely.ops import cascaded_union
from shapely.geometry import shape
import geopandas as gpd

import numpy as np


rh = RedisHelper()


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


def get_catalog():
    catalog = rh.get(CATALOG_DICT, False)
    return catalog


def get_locations(form, uid):
    filtering_main_objects(form, uid)

    filtered_merged_objects = rh.get(USER_MAIN_DATASET.format(uid))
    filtered_merged_objects = filtered_merged_objects[filtered_merged_objects.columns[:9]].drop_duplicates()
    filtered_merged_objects = filtered_merged_objects[~filtered_merged_objects['latitude'].isnull()]
    locations = list(zip(filtered_merged_objects['latitude'], filtered_merged_objects['longitude']))
    popup_pattern = 'Наименование: {}\nВедомственная принадлежность: {}\nДоступность: {}'
    popups = [
        popup_pattern.format(row['object_name'], row['organization_name'], row['availability_name'])
        for i, row in filtered_merged_objects.iterrows()]
    areas = [ar for ar in filtered_merged_objects['area']]
    radius = [rad for rad in filtered_merged_objects['radius']]
    circle_opacity = [ci_op for ci_op in filtered_merged_objects['circle_opacity']]

    resp = {
        'markers': [],
        'circles': [],
        'polygonList': []
    }
    moscow_polygon = rh.get(MOSCOW_POLYGONS_DATASET)
    moscow_polygon['geometry'] = moscow_polygon['geometry'].apply(
        lambda row: shape(row))
    # TODO CHECK
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


def get_point_information(form, uid):
    intersection_new = generate_polygons_intersections(form, uid)

    resp = intersection_new[intersection_new.columns[:3]].to_dict('records')[0]

    geometry = intersection_new['geometry'].iloc[0]
    polygon_coords = []
    if not geometry.is_empty:
        polygon_coords = list(geometry.exterior.coords)
        polygon_coords = [[x[1], x[0]] for x in polygon_coords]

    resp.update({'polygonList': polygon_coords})
    return resp


def get_point_shape_archive(form, uid):
    intersection_new = generate_polygons_intersections(form, uid)
    intersection_new[intersection_new.columns[:3]] = intersection_new[intersection_new.columns[:3]].astype(str)

    return zip_shape(intersection_new)


def get_empty_zones(form, uid):
    difference_df = generate_empty_zones(form, uid)
    difference = cascaded_union(
        difference_df['geometry']
    )

    resp = {
        'polygonList': []
    }
    polygon_coords = []
    for b in difference.boundary:
        coords = np.dstack(b.coords.xy).tolist()
        polygon_coords.append(*coords)

    for polygon in polygon_coords:
        for point in polygon:
            point[0], point[1] = point[1], point[0]

    resp['polygonList'].append({
        'polygon': polygon_coords,
        'fillOpacity': 1
    })

    return resp


def get_empty_zones_archive(form, uid):
    difference_df = generate_empty_zones(form, uid)

    return zip_shape(difference_df)
