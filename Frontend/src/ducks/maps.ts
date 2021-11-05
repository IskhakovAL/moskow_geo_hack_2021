import { createActionCreator, createReducer } from 'deox';
import { Coordinate, IPositions, MarkerType, TCircle, TPolygon } from '../models/IPositions';
import * as MapService from '../services/MapService';
import { IPointInfo, PointParams } from '../models/IPointInfo';
import IStore from '../models/IStore';
import { IFilterParams } from '../models/IFilterParams';

const switchMarkers = createActionCreator(
    'maps/switchMarkers [success]',
    (resolve) => (payload: boolean) => resolve(payload),
);

const switchCircles = createActionCreator(
    'maps/switchCircles [success]',
    (resolve) => (payload: boolean) => resolve(payload),
);

const switchPolygons = createActionCreator(
    'maps/switchPolygon [success]',
    (resolve) => (payload: boolean) => resolve(payload),
);

const saveFilters = createActionCreator(
    'maps/saveFilters [success]',
    (resolve) => (payload: IFilterParams) => resolve(payload),
);

const changeAnalytics = createActionCreator(
    'maps/changeAnalytics [success]',
    (resolve) => (payload: string) => resolve(payload),
);

const fetchPositionsStart = createActionCreator('maps/fetchPositionsStart [..]');
const fetchPositionsSuccess = createActionCreator(
    'maps/fetchPositionsSuccess [success]',
    (resolve) => (payload: IPositions) => resolve(payload),
);
const fetchPositionsError = createActionCreator(
    'maps/fetchPositionsError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchPosition = (params: IFilterParams) => async (dispatch) => {
    dispatch(fetchPositionsStart());
    try {
        const response = await MapService.fetchPositions(params);

        dispatch(fetchPositionsSuccess(response));
    } catch (err) {
        dispatch(fetchPositionsError(err));
    }
};

const fetchPointInfoStart = createActionCreator(
    'maps/fetchPointInfoStart [..]',
    (resolve) => (payload: Coordinate) => resolve(payload)
);

const fetchPointInfoSuccess = createActionCreator(
    'maps/fetchPointInfoSuccess [success]',
    (resolve) => (payload: IPointInfo) => resolve(payload),
);

const fetchPointInfoError = createActionCreator(
    'maps/fetchPointInfoError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchPointInfo = (data: PointParams) => async (dispatch) => {
    dispatch(fetchPointInfoStart(data.pointCoord));
    try {
        const response = await MapService.fetchPointInfo(data);

        dispatch(fetchPointInfoSuccess(response));
    } catch (err) {
        dispatch(fetchPointInfoError(err));
    }
};

const fetchEmptyZonesStart = createActionCreator('maps/fetchEmptyZonesStart [..]');
const fetchEmptyZonesSuccess = createActionCreator(
    'maps/fetchEmptyZonesSuccess [success]',
    (resolve) => (payload) => resolve(payload),
);
const fetchEmptyZonesError = createActionCreator(
    'maps/fetchEmptyZonesError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchEmptyZones = (params: IFilterParams) => async (dispatch) => {
    dispatch(fetchEmptyZonesStart());
    try {
        const response = await MapService.fetchEmptyZones(params);

        dispatch(fetchEmptyZonesSuccess(response));
    } catch (err) {
        dispatch(fetchEmptyZonesError(err));
    }
};

export const mapsSelectors = {
    hasMarkers: (state: IStore) => state.maps.hasMarkers,
    hasCircles: (state: IStore) => state.maps.hasCircles,
    hasPolygons: (state: IStore) => state.maps.hasPolygons,
    analytics: (state: IStore) => state.maps.analytics,
    filters: (state: IStore) => state.maps.filters,
    isFetching: (state: IStore) => state.maps.isFetching,
    markers: (state: IStore) => state.maps.markers,
    circles: (state: IStore) => state.maps.circles,
    polygons: (state: IStore) => state.maps.polygons,
    pointInfo: (state: IStore) => state.maps.pointInfo,
    pointCoord: (state: IStore) => state.maps.pointCoord,
    emptyZones: (state: IStore) => state.maps.emptyZones,
};
export const mapsActions = {
    switchMarkers,
    switchCircles,
    switchPolygons,
    saveFilters,
    changeAnalytics,
    fetchPosition,
    fetchPointInfo,
    fetchEmptyZones,
};

const initialState = {
    hasMarkers: true,
    hasPolygons: false,
    hasCircles: false,
    isFetching: false,
    analytics: '',
    pointCoord: {} as Coordinate,
    filters: {} as IFilterParams,
    pointInfo: {} as IPointInfo,
    markers: [] as MarkerType[],
    circles: [] as TCircle[],
    polygons: [] as TPolygon[],
    emptyZones: {} as TPolygon,
};

export type IMapsState = typeof initialState;

export default createReducer(initialState, (handleAction) => [
    handleAction(switchMarkers, (state, { payload }) => {
        return {
            ...state,
            hasMarkers: payload,
        };
    }),
    handleAction(switchCircles, (state, { payload }) => {
        return {
            ...state,
            hasCircles: payload,
        };
    }),
    handleAction(switchPolygons, (state, { payload }) => {
        return {
            ...state,
            hasPolygons: payload,
        };
    }),
    handleAction(saveFilters, (state, { payload }) => {
        return {
            ...state,
            filters: payload,
        };
    }),
    handleAction(changeAnalytics, (state, { payload }) => {
        return {
            ...state,
            analytics: payload,
        };
    }),
    handleAction(fetchPositionsStart, (state) => {
        return {
            ...state,
            isFetching: true,
        };
    }),
    handleAction(fetchPointInfoStart, (state, { payload }) => {
        return {
            ...state,
            pointCoord: payload,
        };
    }),
    handleAction(fetchPositionsSuccess, (state, { payload }) => {
        return {
            ...state,
            markers: payload.markers,
            circles: payload.circles,
            polygons: payload.polygonList,
            isFetching: false,
        };
    }),
    handleAction(fetchPositionsError, (state) => {
        return {
            ...state,
            isFetching: false,
        };
    }),
    handleAction(fetchPointInfoSuccess, (state, { payload }) => {
        return {
            ...state,
            pointInfo: payload,
        };
    }),
    handleAction(fetchEmptyZonesSuccess, (state, { payload }) => {
        return {
            ...state,
            emptyZones: payload.polygonList[0],
        };
    }),
]);
