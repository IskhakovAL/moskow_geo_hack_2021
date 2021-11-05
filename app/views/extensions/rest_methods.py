from .redis_helper import RedisHelper
from .rest_logic import filtering_main_objects, generate_polygons_intersections, filtering_gpd_objects
from .local_config import CATALOG_DICT, MOSCOW_POLYGONS_DICT, USER_MAIN_DATASET

from os import path, listdir
from zipfile import ZipFile
from tempfile import TemporaryDirectory
from io import BytesIO


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
    }
    resp.update(rh.get(MOSCOW_POLYGONS_DICT, False))

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
    archive = BytesIO()

    with TemporaryDirectory() as tmp_dir:
        shape_file = path.join(tmp_dir, 'result.shp')
        intersection_new.to_file(shape_file, driver='ESRI Shapefile')

        with ZipFile(archive, 'w') as zip_archive:

            for file_name in listdir(tmp_dir):
                if 'result' in file_name:
                    with zip_archive.open(file_name, 'w') as zip_file:
                        with open(path.join(tmp_dir, file_name), 'rb') as file:
                            zip_file.write(file.read())

    archive.seek(0)

    return archive
