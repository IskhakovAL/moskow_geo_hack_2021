import geopandas as gpd
from shapely import wkt
from shapely.geometry import Point, shape
from ..redis_helper import RedisHelper
from shapely.ops import cascaded_union
from itertools import combinations
from .filtering import filtering_gpd_objects

from ..local_config import USER_GPD_DATASET, CRS_3857, CRS_4326


def generate_polygons_intersections(form, uid):
    rh = RedisHelper()
    point_coord = form.pop('pointCoord')
    filtering_gpd_objects(form, uid)

    point = [Point(point_coord[0], point_coord[1])]
    s = gpd.GeoDataFrame({'geometry': point}, crs=CRS_4326)
    s = s.to_crs(CRS_3857)

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
    intersection_new = gpd.GeoDataFrame({
        'totalAreaOfSportsZones': [total_area_of_sports_zones],
        'typesOfSportsZones': [types_of_sports_zones],
        'typesOfSportsServices': [types_of_sports_services],
        'geometry': [intersection]
    }, crs=CRS_3857)
    intersection_new = intersection_new.to_crs(CRS_4326)

    return intersection_new
