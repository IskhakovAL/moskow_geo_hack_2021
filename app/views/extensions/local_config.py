import os
# from pyproj import CRS
from sqlalchemy import create_engine

# CRS_4326 = CRS('EPSG:4326')
# CRS_3857 = CRS('EPSG:3857')

SERVER_ADDRESS = '62.84.123.182'

if os.name == 'posix':
    SQL_ENGINE = create_engine("postgresql://dbuser:qwerty12345@db:5432/db", pool_recycle=3600)
else:
    SQL_ENGINE = create_engine("postgresql://dbuser:qwerty12345@{}:5432/db".format(SERVER_ADDRESS)
                               , pool_recycle=3600)
