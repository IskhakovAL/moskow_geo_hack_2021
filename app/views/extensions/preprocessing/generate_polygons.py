import pandas as pd
from os import getcwd, path
import numpy as np
import geopandas as gpd
from shapely import wkt
from shapely.geometry import mapping

from ..redis_helper import RedisHelper

from ..local_config import CRS_4326


def generate_polygons():
    moscow_population_path = path.join(getcwd(), 'datasets', 'moscow_population.csv')
    moscow_population = pd.read_csv(moscow_population_path, sep=';', encoding='cp1251')

    moscow_polygon_path = path.join(getcwd(), 'datasets', 'moscow_polygon.csv')
    moscow_polygon = pd.read_csv(moscow_polygon_path, sep=',', encoding='cp1251')

    moscow_polygon = moscow_polygon.merge(moscow_population,
                                          left_on='NAME',
                                          right_on='municipality')

    geometry = moscow_polygon['geometry'].map(wkt.loads)
    moscow_polygon = gpd.GeoDataFrame(moscow_polygon, crs=CRS_4326, geometry=geometry)
    moscow_polygon['geometry'] = moscow_polygon['geometry'].apply(
        lambda row: mapping(row))

    rs = RedisHelper()
    rs.insert(moscow_polygon, 'moscow_polygon')
