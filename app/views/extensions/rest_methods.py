from .redis_helper import RedisHelper
from .rest_logic import filtering_objects, generate_polygons_intersections
from .local_config import CATALOG_DICT, MOSCOW_POLYGONS_DICT, USER_MAIN_DATASET


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
    filtering_objects(form, uid)

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
        'polygonList': rh.get(MOSCOW_POLYGONS_DICT, False)
    }

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
    return generate_polygons_intersections(form, uid)
