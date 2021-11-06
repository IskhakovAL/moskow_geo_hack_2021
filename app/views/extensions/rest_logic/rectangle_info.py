from ..sql_helper import SQLHelper
from shapely import wkb
from shapely.geometry import Polygon
from .filtering import filtering_objects


def generate_rectangle_information(form):
    """
    Функция для генерации информации по области
    :param form: форма из POST запроса с координатами области (прямоугольника) и 6 основными фильтрами
    :return: dict с преобразованной информацией
    """
    sh = SQLHelper()
    rectangle_coord = form.pop('rectangleCoord')
    filters = filtering_objects(form)
    x1 = rectangle_coord[0]
    y1 = rectangle_coord[1]
    x2 = rectangle_coord[2]
    y2 = rectangle_coord[3]
    sql_text = """
    select
      sum(people) as sum,
      ST_Area(ST_MakeEnvelope({x1}, {y1}, {x2}, {y2}, 4326)),
      ST_Area(ST_Union(geometry)) as all_area
    from (
      select 
        geometry, 
        people,
        ST_IsEmpty(ST_Intersection(ST_MakeEnvelope({x1}, {y1}, {x2}, {y2}, 4326), geometry)) as flag
      from "Moscow" m
    ) as a
    where flag is False;
    """.format(
        x1=x1, y1=y1, x2=x2, y2=y2
    )

    sql_result = sh.execute(sql_text)
    people_sum = None
    st_area = None
    all_area = None

    for row in sql_result:
        people_sum = float(row['sum'])
        st_area = float(row['st_area'])
        all_area = float(row['all_area'])

    people_st_area = people_sum * st_area / all_area

    sql_text = """
    select 
      grouped,
      count(latitude) as cnt,
      sum(area) / 1000000 as area_sum,
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
        st_contains(ST_MakeEnvelope({x1}, {y1}, {x2}, {y2}, 4326), geometry) as flag,
        latitude,
        ST_MakeEnvelope({x1}, {y1}, {x2}, {y2}, 4326) as geometry
      from "Objects" o
      {filter}
    ) as t
    where flag is true
    group by grouped
    """.format(
        x1=x1, y1=y1, x2=x2, y2=y2,
        filter='' if not filters else 'where {}'.format(filters)
    )
    sql_result = sh.execute(sql_text)

    cnt = 0
    total_area_of_sports_zones = 0
    types_of_sports_zones = ''
    types_of_sports_services = ''
    geometry = None

    for row in sql_result:
        cnt = float(row['cnt'])
        total_area_of_sports_zones = float(row['area_sum'])
        types_of_sports_zones = row['zones_type_agg']
        types_of_sports_services = row['sport_type_agg']
        geometry = row['geometry']
    if not geometry:
        geometry = Polygon()
    else:
        geometry = wkb.loads(geometry, hex=True)

    cnt = round(cnt * 100000 / people_st_area, 2)
    total_area_of_sports_zones = round(total_area_of_sports_zones * 100000 / people_st_area, 2)

    result = {
        'count': cnt,
        'avrgArea': total_area_of_sports_zones,
        'typeZones': types_of_sports_zones,
        'typeServs': types_of_sports_services,
        'geometry': geometry
    }

    return result
