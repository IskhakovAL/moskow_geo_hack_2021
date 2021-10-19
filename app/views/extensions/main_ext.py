import pandas as pd
from os import getcwd, path
from folium import Map, plugins
from flask import g

from .create_app import create_app
from .local_config import Config


app_context = create_app(Config).app_context()


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


def preprocessing():
    all_object_names = ['object_id', 'object_name', 'address',
                        'organization_id', 'organization_name',
                        'availability_id', 'availability_name',
                        'latitude', 'longitude']

    main_data_path = path.join(getcwd(), 'datasets', 'main_data.xlsx')

    all_object = pd.read_excel(main_data_path,
                               names=all_object_names,
                               sheet_name=0)

    object_type = pd.read_excel(main_data_path,
                                sheet_name=1)

    object_type = object_type.drop(columns=['Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15'], axis=1)
    object_type.columns = ['object_id', 'object_name', 'address',
                           'organization_id', 'organization_name',
                           'zones_id', 'zones_name', 'zones_type',
                           'availability_id', 'availability_name',
                           'sport_type', 'latitude', 'longitude', 'zones_square']

    merged_objects = all_object[['object_id', 'object_name', 'organization_name', 'availability_name', 'latitude', 'longitude']] \
        .merge(object_type[['object_id', 'zones_name', 'zones_type', 'sport_type']], on=['object_id'], how='left')

    availability_name_dict = {
        'Районное': 'С районной доступностью',
        'Окружное': 'С окружной доступностью',
        'Шаговая доступность': 'С шаговой доступностью',
        'Городское': 'Городского значения'
    }

    merged_objects['availability_name'] = merged_objects['availability_name'].replace(availability_name_dict)

    with app_context:
        if 'merged_objects' not in g:
            g.merged_objects = merged_objects


def filtering_merged_objects():
    with app_context:
        if 'merged_objects' not in g:
            return []
        merged_objects = g.merged_objects
        filtered_merged_objects = merged_objects[merged_objects.columns[:6]].drop_duplicates()
        filtered_merged_objects = filtered_merged_objects[~filtered_merged_objects['latitude'].isnull()]
        locations = list(zip(filtered_merged_objects['latitude'], filtered_merged_objects['longitude']))
        popups = ["Наименование: {}".format(name) for name in filtered_merged_objects['object_name']]
        return locations, popups


def generate_main_map():
    map_obj = Map(location=[55.7522, 37.6156], zoom_start=12, tiles='cartodbpositron')
    locations, popups = filtering_merged_objects()
    plugins.MarkerCluster(locations=locations, popups=popups).add_to(map_obj)
    return map_obj

