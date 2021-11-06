from ..sql_helper import SQLHelper
from shapely import wkb


def generate_point_information(form):
    sh = SQLHelper()
    point_coord = form.pop('pointCoord')
    sql_text = """
                select 
                  grouped,
                  sum(area) as area_sum,
                  string_agg(distinct zones_type, ', ') as zones_type_agg,
                  string_agg(distinct sport_type, ', ') as sport_type_agg,
                  ST_Union(geometry) as geometry
                from (
                  select 
                    'grouped' as grouped,
                    object_id,
                    area,
                    zones_type,
                    sport_type,
                    st_contains(geometry, ST_GeomFromText('POINT({} {})', 4326)) as flag,
                    geometry
                  from "Objects" o
                ) as t
                where flag is true
                group by grouped
            """.format(point_coord[0], point_coord[1])
    sql_result = sh.execute(sql_text)

    total_area_of_sports_zones = None
    types_of_sports_zones = None
    types_of_sports_services = None
    geometry = None

    for row in sql_result:
        total_area_of_sports_zones = row['area_sum']
        types_of_sports_zones = row['zones_type_agg']
        types_of_sports_services = row['sport_type_agg']
        geometry = row['geometry']
    geometry = wkb.loads(geometry, hex=True)

    result = {
        'totalArea': total_area_of_sports_zones,
        'typeZones': types_of_sports_zones,
        'typeServs': types_of_sports_services,
        'geometry': geometry
    }

    return result
