from ..sql_helper import SQLHelper
from shapely import wkb


def generate_empty_zones(form):
    sh = SQLHelper()

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
            limit 1
          ) as y
          on x.id = y.id
        ) as z
        """

    sql_result = sh.execute(sql_text)

    area = None
    difference = None

    for row in sql_result:
        area = row['area']
        difference = row['diff']

    difference = wkb.loads(difference, hex=True)

    result = {
        'geometry': difference,
        'area': area,
        'population': round(area / 2720 * 12655050)
    }

    return result
