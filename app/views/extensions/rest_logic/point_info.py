from ..sql_helper import SQLHelper
from shapely import wkb
from shapely.geometry import Polygon
from .filtering import filtering_objects


def generate_point_information(form):
    """
    Функция для генерации информации по точке
    :param form: форма из POST запроса с координатами точки и 6 основными фильтрами
    :return: dict с преобразованной информацией
    """
    sh = SQLHelper()
    point_coord = form.pop('pointCoord')
    filters = filtering_objects(form)
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
                    st_contains(geometry, ST_GeomFromText('POINT({x1} {y1})', 4326)) as flag,
                    geometry
                  from "Objects" o
                  {filter}
                ) as t
                where flag is true
                group by grouped
            """.format(x1=point_coord[0], y1=point_coord[1],
                       filter='' if not filters else 'where {}'.format(filters)
                       )
    sql_result = sh.execute(sql_text)

    total_area_of_sports_zones = 0
    types_of_sports_zones = ''
    types_of_sports_services = ''
    geometry = None

    for row in sql_result:
        total_area_of_sports_zones = row['area_sum']
        types_of_sports_zones = row['zones_type_agg']
        types_of_sports_services = row['sport_type_agg']
        geometry = row['geometry']
    if not geometry:
        geometry = Polygon()
    else:
        geometry = wkb.loads(geometry, hex=True)

    result = {
        'totalArea': total_area_of_sports_zones,
        'typeZones': types_of_sports_zones,
        'typeServs': types_of_sports_services,
        'geometry': geometry
    }

    return result
