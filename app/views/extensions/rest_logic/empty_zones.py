import geopandas as gpd
from shapely.geometry import shape
from ..redis_helper import RedisHelper
from shapely.ops import cascaded_union
from .filtering import filtering_gpd_objects

from ..local_config import USER_GPD_DATASET, CRS_3857, CRS_4326, MOSCOW_POLYGONS_DATASET


def generate_empty_zones(form, uid):
    rh = RedisHelper()
    moscow_polygon = rh.get(MOSCOW_POLYGONS_DATASET)
    moscow_polygon['geometry'] = moscow_polygon['geometry'].apply(
        lambda row: shape(row))
    moscow_polygon = gpd.GeoDataFrame(moscow_polygon, crs=CRS_4326)

    filtering_gpd_objects(form, uid)
    merged_objects_gdf = rh.get(USER_GPD_DATASET.format(uid))
    merged_objects_gdf['geometry'] = merged_objects_gdf['geometry'].apply(lambda row: shape(row))
    merged_objects_gdf = gpd.GeoDataFrame(merged_objects_gdf, crs=CRS_3857)
    merged_objects_gdf = merged_objects_gdf.to_crs(CRS_4326)
    difference_df = gpd.overlay(moscow_polygon, merged_objects_gdf, how='difference')

    return difference_df
