import pandas as pd
from os import getcwd, path
import numpy as np
import geopandas as gpd
from shapely import wkt

from ..redis_helper import RedisHelper


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

    rs = RedisHelper()
    rs.insert(resp, 'moscow_polygon', False)
