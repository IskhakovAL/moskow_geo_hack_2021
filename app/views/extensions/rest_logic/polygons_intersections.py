import geopandas as gpd
from shapely import wkt
from shapely.geometry import Point, shape
from ..redis_helper import RedisHelper
from shapely.ops import cascaded_union
from itertools import combinations
from .filtering import filtering_objects

from ..local_config import USER_GPD_DATASET


def generate_polygons_intersections(form, uid):
    rh = RedisHelper()
    point_coord = form.pop('pointCoord')
    filtering_objects(form, uid)
    point = [Point(point_coord[0], point_coord[1])]
    s = gpd.GeoDataFrame({'geometry': point})
    s.crs = {'init': 'epsg:4326', 'no_defs': True}
    s = s.to_crs({'init': 'epsg:3857'})

    merged_objects_gdf = rh.get(USER_GPD_DATASET.format(uid))
    merged_objects_gdf['geometry'] = merged_objects_gdf['geometry'].apply(lambda row: shape(row))
    merged_objects_gdf['flag'] = merged_objects_gdf.apply(lambda row: s.within(row['geometry']), axis=1)
    merged_objects_intersect = merged_objects_gdf[merged_objects_gdf['flag']].copy()
    total_area_of_sports_zones = merged_objects_intersect['area'].sum()
    types_of_sports_zones = list(merged_objects_intersect['zones_type'].unique())
    types_of_sports_services = list(merged_objects_intersect['sport_type'].unique())
    intersection = cascaded_union(
        [a.intersection(b) for a, b in combinations(merged_objects_intersect['geometry'], 2)]
    )
    resp = {
        'totalAreaOfSportsZones': total_area_of_sports_zones,
        'typesOfSportsZones': types_of_sports_zones,
        'typesOfSportsServices': types_of_sports_services,
        'polygonList': []
    }
    polygon_coords = list(intersection.exterior.coords)
    polygon_coords = [[x[1], x[0]] for x in polygon_coords]
    resp['polygonList'] = polygon_coords
    return resp
