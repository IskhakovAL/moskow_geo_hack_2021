from .rest_logic import zip_shape, generate_point_information, generate_empty_zones, \
    generate_rectangle_information

from .sql_helper import SQLHelper

from shapely import wkb

import numpy as np


sh = SQLHelper()


def get_catalog():
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
        group by object_name, organization_name, availability_name, latitude, longitude
    '''
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
    point_info = generate_point_information(form)
    geometry = point_info['geometry']

    polygon_coords = []
    if not geometry.is_empty:
        polygon_coords = list(geometry.exterior.coords)
        polygon_coords = [[x[1], x[0]] for x in polygon_coords]

    resp = {
        'totalAreaOfSportsZones': point_info['totalArea'],
        'typesOfSportsZones': point_info['typeZones'].split(', '),
        'typesOfSportsServices': point_info['typeServs'].split(', '),
        'polygonList': polygon_coords
    }
    return resp


def get_point_shape_archive(form):
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
    rectangle_information = generate_rectangle_information(form)
    geometry = rectangle_information['geometry']

    polygon_coords = []
    if not geometry.is_empty:
        polygon_coords = list(geometry.exterior.coords)
        polygon_coords = [[x[1], x[0]] for x in polygon_coords]

    resp = {
        'averageAreaOfSportsZones': rectangle_information['avrgArea'],
        'typesOfSportsZones': rectangle_information['typeZones'].split(', '),
        'typesOfSportsServices': rectangle_information['typeServs'].split(', '),
        'count': rectangle_information['count'],
        'polygonList': polygon_coords
    }

    return resp


def get_rectangle_shape_archive(form):
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
    empty_zones = generate_empty_zones(form)

    schema = {
        'geometry': 'MultiPolygon',
        'properties': {
            'area': 'float',
            'population': 'float'
        }
    }

    return zip_shape(schema, empty_zones)


# def get_plots():
#     plots = rh.get(PLOTS_ARRAY, False)
#     resp = {
#         'plots': plots
#     }
#     return resp
