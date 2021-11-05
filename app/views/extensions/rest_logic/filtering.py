from ..redis_helper import RedisHelper

from ..local_config import MAIN_DATASET, GPD_DATASET, \
    USER_MAIN_DATASET, USER_GPD_DATASET, USER_LAST_FILTERS_DICT


def filtering_main_objects(form, uid):
    rh = RedisHelper()
    if rh.get(USER_LAST_FILTERS_DICT.format(uid), False) != form or not form:
        rh.insert(rh.get(MAIN_DATASET), USER_MAIN_DATASET.format(uid))
        rh.rewrite(form, USER_LAST_FILTERS_DICT.format(uid), False)

    merged_objects = rh.get(USER_MAIN_DATASET.format(uid))

    name_to_id = {
        'sportsFacility': 'object_id',
        'departmentalAffiliation': 'organization_id',
        'sportsZonesList': 'zones_name_id',
        'sportsZonesTypes': 'zones_type_id',
        'sportsServices': 'sport_type_id',
        'availability': 'availability_id'
    }

    if form:
        for name in name_to_id.keys():
            if form.get(name):
                filters_ids = [int(val) for val in form.get(name)]
                merged_objects = merged_objects[merged_objects[name_to_id.get(name)].isin(filters_ids)]

    rh.rewrite(merged_objects, USER_MAIN_DATASET.format(uid))


def filtering_gpd_objects(form, uid):
    rh = RedisHelper()
    if rh.get(USER_LAST_FILTERS_DICT.format(uid), False) != form or not form:
        rh.insert(rh.get(GPD_DATASET), USER_GPD_DATASET.format(uid))
        rh.rewrite(form, USER_LAST_FILTERS_DICT.format(uid), False)

    merged_objects_gdf = rh.get(USER_GPD_DATASET.format(uid))
    if merged_objects_gdf is None:
        rh.insert(rh.get(GPD_DATASET), USER_GPD_DATASET.format(uid))
        merged_objects_gdf = rh.get(USER_GPD_DATASET.format(uid))

    name_to_id = {
        'sportsFacility': 'object_id',
        'departmentalAffiliation': 'organization_id',
        'sportsZonesList': 'zones_name_id',
        'sportsZonesTypes': 'zones_type_id',
        'sportsServices': 'sport_type_id',
        'availability': 'availability_id'
    }

    if form:
        for name in name_to_id.keys():
            if form.get(name):
                filters_ids = [int(val) for val in form.get(name)]
                merged_objects_gdf = merged_objects_gdf[merged_objects_gdf[name_to_id.get(name)].isin(filters_ids)]

    rh.rewrite(merged_objects_gdf, USER_GPD_DATASET.format(uid))
