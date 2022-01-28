import os
from sqlalchemy import create_engine

# Конфиг с информацией об IP адресе сервера, на котором работает проект с созданием подключения к PSQL базе данных
SERVER_ADDRESS = '23.105.226.217'

if os.name == 'posix':
    SQL_ENGINE = create_engine("postgresql://dbuser:qwerty12345@db:5432/db", pool_recycle=3600)
else:
    SQL_ENGINE = create_engine("postgresql://dbuser:qwerty12345@{}:5432/db".format(SERVER_ADDRESS)
                               , pool_recycle=3600)
