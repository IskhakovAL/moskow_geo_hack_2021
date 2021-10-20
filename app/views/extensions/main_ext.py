import random

import pandas as pd
from os import getcwd, path
from folium import Map, plugins
from flask import g
from sklearn.preprocessing import OrdinalEncoder

from time import time

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

    ord_enc = OrdinalEncoder()

    merged_objects['object_id'] = ord_enc.fit_transform(merged_objects[['object_name']]).astype(int)

    merged_objects['organization_name'] = merged_objects['organization_name'].fillna('Неизвестно')
    merged_objects['organization_id'] = ord_enc.fit_transform(merged_objects[['organization_name']]).astype(int)

    merged_objects['availability_name'] = merged_objects['availability_name'].fillna('Неизвестно')
    merged_objects['availability_id'] = ord_enc.fit_transform(merged_objects[['availability_name']]).astype(int)

    merged_objects['zones_name'] = merged_objects['zones_name'].fillna('Неизвестно')
    merged_objects['zones_name_id'] = ord_enc.fit_transform(merged_objects[['zones_name']]).astype(int)

    merged_objects['zones_type'] = merged_objects['zones_type'].fillna('Неизвестно')
    merged_objects['zones_type_id'] = ord_enc.fit_transform(merged_objects[['zones_type']]).astype(int)

    merged_objects['sport_type'] = merged_objects['sport_type'].fillna('Неизвестно')
    merged_objects['sport_type_id'] = ord_enc.fit_transform(merged_objects[['sport_type']]).astype(int)

    # merged_objects = merged_objects[:1000]

    with app_context:
        if 'merged_objects' not in g:
            g.merged_objects = merged_objects


def generate_catalog():
    with app_context:
        if 'merged_objects' in g:
            merged_objects = g.merged_objects
        catalog = {
            'sportsFacility': merged_objects[['object_id', 'object_name']].drop_duplicates().\
                rename(columns={'object_id': 'id', 'object_name': 'name'}).to_dict('records'),
            'departmentalAffiliation': merged_objects[['organization_id', 'organization_name']].drop_duplicates().\
                rename(columns={'organization_id': 'id', 'organization_name': 'name'}).to_dict('records'),
            'sportsZonesList': merged_objects[['zones_name_id', 'zones_name']].drop_duplicates().\
                rename(columns={'zones_name_id': 'id', 'zones_name': 'name'}).to_dict('records'),
            'sportsZonesTypes': merged_objects[['zones_type_id', 'zones_type']].drop_duplicates().\
                rename(columns={'zones_type_id': 'id', 'zones_type': 'name'}).to_dict('records'),
            'sportsServices': merged_objects[['sport_type_id', 'sport_type']].drop_duplicates().\
                rename(columns={'sport_type_id': 'id','sport_type': 'name'}).to_dict('records'),
            'availability': merged_objects[['availability_id', 'availability_name']].drop_duplicates().\
                rename(columns={'availability_id': 'id','availability_name': 'name'}).to_dict('records')
        }
        g.catalog = catalog


def filtering_merged_objects(form):
    with app_context:
        if 'merged_objects' not in g:
            return []
        merged_objects = g.merged_objects

        name_to_id = {
            'sportsFacility': 'object_id',
            'departmentalAffiliation': 'organization_id',
            'sportsZonesList': 'zones_name_id',
            'sportsZonesTypes': 'zones_type_id',
            'sportsServices': 'sport_type_id',
            'availability': 'availability_id'
        }

        filtered_merged_objects = merged_objects

        if form:
            for name in name_to_id.keys():
                if form.getlist(name):
                    filters_ids = [int(val) for val in form.getlist(name)]
                    filtered_merged_objects = filtered_merged_objects[filtered_merged_objects[name_to_id.get(name)].isin(filters_ids)]

        filtered_merged_objects = filtered_merged_objects[filtered_merged_objects.columns[:6]].drop_duplicates()
        filtered_merged_objects = filtered_merged_objects[~filtered_merged_objects['latitude'].isnull()]
        locations = list(zip(filtered_merged_objects['latitude'], filtered_merged_objects['longitude']))
        popups = ["Наименование: {}".format(name) for name in filtered_merged_objects['object_name']]
        return locations, popups


def generate_main_map(form):
    with app_context:
        if 'map_obj' not in g:
            map_obj = Map(location=[55.7522, 37.6156], zoom_start=12, tiles='cartodbpositron')
            locations, popups = filtering_merged_objects(form)
            if not locations:
                return map_obj
            plugins.MarkerCluster(locations=locations, popups=popups).add_to(map_obj)
            g.map_obj = map_obj
        return g.map_obj


def get_catalog():
    with app_context:
        if 'catalog' not in g:
            return {}
        return g.catalog
