import redis
import os
from pyproj import CRS

if os.name == 'posix':
    REDIS_CONNECTION = redis.Redis(host='redis', port=6379, db=0)
else:
    REDIS_CONNECTION = redis.Redis(host='localhost', port=6379, db=0)

CRS_4326 = CRS('EPSG:4326')
CRS_3857 = CRS('EPSG:3857')

MAIN_DATASET = 'main0'
GPD_DATASET = 'main1'
CATALOG_DICT = 'catalog'
MOSCOW_POLYGONS_DICT = 'moscow_polygon'

USER_MAIN_DATASET = '{}:0'
USER_GPD_DATASET = '{}:1'
USER_LAST_FILTERS_DICT = '{}:f'
