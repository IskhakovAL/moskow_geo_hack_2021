from ..redis_helper import RedisHelper
from ..local_config import MAIN_DATASET


def generate_catalog():
    rs = RedisHelper()
    merged_objects = rs.get(MAIN_DATASET)
    catalog = {
        'sportsFacility': merged_objects[['object_id', 'object_name']].drop_duplicates(). \
            rename(columns={'object_id': 'id', 'object_name': 'name'}).to_dict('records'),
        'departmentalAffiliation': merged_objects[['organization_id', 'organization_name']].drop_duplicates(). \
            rename(columns={'organization_id': 'id', 'organization_name': 'name'}).to_dict('records'),
        'sportsZonesList': merged_objects[['zones_name_id', 'zones_name']].drop_duplicates(). \
            rename(columns={'zones_name_id': 'id', 'zones_name': 'name'}).to_dict('records'),
        'sportsZonesTypes': merged_objects[['zones_type_id', 'zones_type']].drop_duplicates(). \
            rename(columns={'zones_type_id': 'id', 'zones_type': 'name'}).to_dict('records'),
        'sportsServices': merged_objects[['sport_type_id', 'sport_type']].drop_duplicates(). \
            rename(columns={'sport_type_id': 'id', 'sport_type': 'name'}).to_dict('records'),
        'availability': merged_objects[['availability_id', 'availability_name']].drop_duplicates(). \
            rename(columns={'availability_id': 'id', 'availability_name': 'name'}).to_dict('records')
    }
    rs.insert(catalog, 'catalog', False)
