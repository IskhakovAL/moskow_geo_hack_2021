from ..sql_helper import SQLHelper
from shapely import wkb
from shapely.geometry import MultiPolygon
from .filtering import filtering_objects


def generate_empty_zones(form):
    sh = SQLHelper()
    filters = filtering_objects(form)

    sql_text = """
        select 
          ROUND(ST_Area(ST_Transform(diff, 26986)) / 1000000) as area, 
          diff
        from (
          select ST_Difference(geometry_x, geometry_y) as diff
          from (
            select 
              ST_Union(geometry) as geometry_x,
              'id' as id
            from "Moscow" m
          ) as x
          inner join (
            select 
              ST_Union(geometry) as geometry_y,
              'id' as id
            from "Objects" o2
            {filter}
          ) as y
          on x.id = y.id
        ) as z
        """.format(
        filter='' if not filters else 'where {}'.format(filters)
    )

    sql_result = sh.execute(sql_text)

    area = 0
    difference = None

    for row in sql_result:
        area = row['area']
        difference = row['diff']

    if not difference:
        difference = MultiPolygon()
    else:
        difference = wkb.loads(difference, hex=True)

    result = {
        'geometry': difference,
        'area': area,
        'population': round(area / 2720 * 12655050)
    }

    return result
