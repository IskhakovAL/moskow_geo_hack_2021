from .rest_logic import zip_shape, generate_point_information, generate_empty_zones, \
    generate_rectangle_information, filtering_objects, generate_plots

from .sql_helper import SQLHelper

from shapely import wkb

import numpy as np

sh = SQLHelper()


def get_catalog():
    """
    Метод формирования json с каталогом, то есть с id фильтров
    Подрробнее о фильтрах в ../rest_logic/filtering.py
    :return: json с фильтрами
    """
    resp = {
        'sportsFacility': [],
        'departmentalAffiliation': [],
        'sportsZonesList': [],
        'sportsZonesTypes': [],
        'sportsServices': [],
        'availability': []
    }

    for key in resp.keys():
        sql_text = """
        select
        id, name
        from {}
        """.format(key)
        sql_result = sh.execute(sql_text)
        for row in sql_result:
            resp[key].append({
                'id': row['id'],
                'name': row['name']
            })

    return resp


def get_locations(form):
    """
    Функция для формирования json с точками и информацией о них
    :param form: форма из POST запроса с 6 основными фильтрами
    :return: json с точками и информацией о них
    """
    filters = filtering_objects(form)

    sql_text = '''
        select
        object_name, 
        organization_name,
        MAX(area) as area,
        MAX(radius) as radius,
        MAX(circle_opacity) as circle_opacity,
        string_agg(distinct zones_name, ', ') as zones_name_agg,
        string_agg(distinct zones_type,  ', ') as zones_type_agg,
        string_agg(distinct sport_type,   ', ') as sport_type_agg,
        availability_name, 
        latitude, 
        longitude
        from "Objects" o
        {filter}
        group by object_name, organization_name, availability_name, latitude, longitude
    '''.format(filter='' if not filters else 'where {}'.format(filters))

    sql_result = sh.execute(sql_text)

    popups = []
    locations = []
    areas = []
    radius = []
    opacities = []
    for row in sql_result:

        popups.append({
            'objectName': row['object_name'],
            'organizationName': row['organization_name'],
            'availabilityName': row['availability_name'],
            'zonesName': row['zones_name_agg'],
            'zonesType': row['zones_type_agg'],
            'sportType': row['sport_type_agg']
        })

        locations.append([row['latitude'], row['longitude']])

        areas.append(row['area'])
        radius.append(row['radius'])
        opacities.append(row['circle_opacity'])

    resp = {
        'markers': []
    }
    for i in range(len(locations)):
        resp['markers'].append({
            'position': list(locations[i]),
            'popup': popups[i],
            'area': areas[i],
            'radius': radius[i],
            'fillOpacity': opacities[i]
        })

    return resp


def get_municipality_info():
    """
    Функция для формирования json с полигонами и информацией о них для отрисовки слоя
    плотности населения Москвы
    :return: son с полигонами и необходимой информацией
    """
    sql_text = """
    select municipality, people, opacity, geometry 
    from "Moscow" m
    """
    sql_result = sh.execute(sql_text)
    resp = {
        'polygonList': []
    }
    geometry = []
    popups = []
    opacities = []

    for row in sql_result:
        geometry.append(wkb.loads(row['geometry'], hex=True))
        popups.append({
            'municipality': row['municipality'],
            'people': row['people']
        })
        opacities.append(row['opacity'])

    for i in range(len(geometry)):
        geom_i = geometry[i]
        if geom_i.geom_type == 'Polygon':
            polygon_coords = list(geom_i.exterior.coords)
            polygon_coords = [[x[1], x[0]] for x in polygon_coords]

            resp['polygonList'].append({
                'polygon': polygon_coords,
                'fillOpacity': opacities[i],
                'popup': popups[i]
            })

        if geom_i.geom_type == 'MultiPolygon':
            polygon_coords = []
            for b in geom_i.boundary:
                coords = np.dstack(b.coords.xy).tolist()
                polygon_coords.append(*coords)

            for polygon in polygon_coords:
                for point in polygon:
                    point[0], point[1] = point[1], point[0]

            resp['polygonList'].append({
                'polygon': polygon_coords,
                'fillOpacity': opacities[i],
                'popup': popups[i]
            })

    return resp


def get_point_information(form):
    """
    Функция для формирования json с полигоном для отрисовки аналитики по точке
    :param form: форма из POST запроса с координатами точки и 6 основными фильтрами
    :return: json с полигоном с необходимой информацией
    """
    point_info = generate_point_information(form)
    geometry = point_info['geometry']

    polygon_coords = []
    if not geometry.is_empty:
        polygon_coords = list(geometry.exterior.coords)
        polygon_coords = [[x[1], x[0]] for x in polygon_coords]

    zones_type = point_info['typeZones']
    services_type = point_info['typeServs']

    if not zones_type:
        zones_type = []
    else:
        zones_type = zones_type.split(', ')

    if not services_type:
        services_type = []
    else:
        services_type = services_type.split(', ')

    resp = {
        'totalAreaOfSportsZones': point_info['totalArea'],
        'typesOfSportsZones': zones_type,
        'typesOfSportsServices': services_type,
        'polygonList': polygon_coords
    }
    return resp


def get_point_shape_archive(form):
    """
    Функция для формирования архива на основании полигоа для отрисовки аналитики по точке
    :param form: форма из POST запроса с координатами точки и 6 основными фильтрами
    :return: BytesIO объект с архивом
    """
    point_info = generate_point_information(form)

    schema = {
        'geometry': 'Polygon',
        'properties': {
            'totalArea': 'float',
            'typeZones': 'str',
            'typeServs': 'str'
        }
    }

    return zip_shape(schema, point_info)


def get_rectangle_information(form):
    """
    Функция для формирования json с полигоном для отрисовки аналитики по области
    :param form: форма из POST запроса с координатами области (прямоугольника) и 6 основными фильтрами
    :return: json с полигоном и необходимой информацией
    """
    rectangle_information = generate_rectangle_information(form)
    geometry = rectangle_information['geometry']

    polygon_coords = []
    if not geometry.is_empty:
        polygon_coords = list(geometry.exterior.coords)
        polygon_coords = [[x[1], x[0]] for x in polygon_coords]

    zones_type = rectangle_information['typeZones']
    services_type = rectangle_information['typeServs']

    if not zones_type:
        zones_type = []
    else:
        zones_type = zones_type.split(', ')

    if not services_type:
        services_type = []
    else:
        services_type = services_type.split(', ')

    resp = {
        'averageAreaOfSportsZones': rectangle_information['avrgArea'],
        'typesOfSportsZones': zones_type,
        'typesOfSportsServices': services_type,
        'count': rectangle_information['count'],
        'polygonList': polygon_coords
    }

    return resp


def get_rectangle_shape_archive(form):
    """
    Функция для формирования архива на основании полигона для отрисовки аналитики по области
    :param form: форма из POST запроса с координатами области (прямоугольника) и 6 основными фильтрами
    :return: BytesIO объект с архивом
    """
    rectangle_information = generate_rectangle_information(form)

    schema = {
        'geometry': 'Polygon',
        'properties': {
            'count': 'float',
            'avrgArea': 'float',
            'typeZones': 'str',
            'typeServs': 'str'
        }
    }

    return zip_shape(schema, rectangle_information)


def get_empty_zones(form):
    """
    Функция для формирования json с мультиполигоном с аналитикой по пустым зонам
    :param form: форма из POST запроса с 6 основными фильтрами
    :return: json с мультиполигоном с необходимой информацией
    """
    empty_zones = generate_empty_zones(form)

    resp = {
        'polygonList': [],
        'area': empty_zones['area'],
        'population': round(empty_zones['area'] / 2720 * 12655050)
    }

    difference = empty_zones['geometry']
    polygon_coords = []
    for b in difference.boundary:
        coords = np.dstack(b.coords.xy).tolist()
        polygon_coords.append(*coords)

    for polygon in polygon_coords:
        for point in polygon:
            point[0], point[1] = point[1], point[0]

    resp['polygonList'].append({
        'polygon': polygon_coords,
        'fillOpacity': 0.5
    })

    return resp


def get_empty_zones_archive(form):
    """
    Функция для формирования архива на основании полигона с инфомрацией о пустых зонах
    :param form: форма из POST запроса с 6 основными фильтрами
    :return: BytesIO объект с архивом
    """
    empty_zones = generate_empty_zones(form)

    schema = {
        'geometry': 'MultiPolygon',
        'properties': {
            'area': 'float',
            'population': 'float'
        }
    }

    return zip_shape(schema, empty_zones)


def get_plots():
    """
    Функция для формирования json с plotly графиками с аналитикой
    :return: json с plotly графиками
    """
    plots = generate_plots()
    resp = {
        'plots': plots
    }
    return resp


def get_recommendations_ml():
    """
    Функция для формирования json с полигоном, полученным из обученной модели.
    Модель выделяет область для потенциального построения в ней спортивных объектов.

    Более подробно о процессе получения данного полигона и использовании алгоритма
    машинного обучения можно почитать в app/machine_learning/model.html
    :return: json с полигоном
    """
    polygon_coors = [[37.77584367360977, 55.82419119278246],
                     [37.771153696940615, 55.75866678332274],
                     [37.77167853487262, 55.747304123203],
                     [37.781524, 55.70071],
                     [37.819657, 55.678397],
                     [37.923649500204725, 55.68550829104208],
                     [37.92945073149109, 55.70393151351982],
                     [37.86654062425652, 55.81964092471844],
                     [37.776788587438, 55.824349404759]]
    resp = {
        'polygonList': polygon_coors
    }

    return resp
