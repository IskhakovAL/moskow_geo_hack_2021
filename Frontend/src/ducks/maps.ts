import { createActionCreator, createReducer } from 'deox';
import {
    Coordinate,
    IPolygonList,
    IPositions,
    MarkerType,
    TCircle,
    TPolygon,
} from '../models/IPositions';
import * as MapService from '../services/MapService';
import { IPointInfo, PointParams } from '../models/IPointInfo';
import IStore from '../models/IStore';
import { IFilterParams } from '../models/IFilterParams';
import { IPlots, Plot } from '../models/IPlots';
import { IRectangleInfo } from '../models/IReactangleInfo';
import { TEmptyZones } from '../models/IEmptyZones';

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

const fetchMunicipalityInfoStart = createActionCreator('maps/fetchMunicipalityInfoStart [..]');
const fetchMunicipalityInfoSuccess = createActionCreator(
    'maps/fetchMunicipalityInfoSuccess [success]',
    (resolve) => (payload: IPolygonList) => resolve(payload),
);
const fetchMunicipalityInfoError = createActionCreator(
    'maps/fetchMunicipalityInfoError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchMunicipalityInfo = () => async (dispatch) => {
    dispatch(fetchMunicipalityInfoStart());
    try {
        const response = await MapService.fetchMunicipalityInfo();

        dispatch(fetchMunicipalityInfoSuccess(response));
    } catch (err) {
        dispatch(fetchMunicipalityInfoError(err));
    }
};

const fetchPointInfoStart = createActionCreator(
    'maps/fetchPointInfoStart [..]',
    (resolve) => (payload: Coordinate) => resolve(payload),
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

const fetchRectangleStart = createActionCreator(
    'maps/fetchRectangleStart [..]',
    (resolve) => (payload: number[]) => resolve(payload),
);

const fetchRectangleSuccess = createActionCreator(
    'maps/fetchRectangleSuccess [success]',
    (resolve) => (payload: IRectangleInfo) => resolve(payload),
);

const fetchRectangleError = createActionCreator(
    'maps/fetchRectangleError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchRectangleInfo = (data) => async (dispatch) => {
    dispatch(fetchRectangleStart(data.rectangleCoord));
    try {
        const response = await MapService.fetchRectangleInfo(data);

        dispatch(fetchRectangleSuccess(response));
    } catch (err) {
        dispatch(fetchRectangleError(err));
    }
};

const fetchEmptyZonesStart = createActionCreator('maps/fetchEmptyZonesStart [..]');
const fetchEmptyZonesSuccess = createActionCreator(
    'maps/fetchEmptyZonesSuccess [success]',
    (resolve) => (payload: TEmptyZones) => resolve(payload),
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

const fetchPlotsStart = createActionCreator('maps/fetchPlotsStart [..]');
const fetchPlotsSuccess = createActionCreator(
    'maps/fetchPlotsSuccess [success]',
    (resolve) => (payload: IPlots) => resolve(payload),
);
const fetchPlotsError = createActionCreator(
    'maps/fetchPlotsError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchPlots = () => async (dispatch) => {
    dispatch(fetchPlotsStart());
    try {
        const response = await MapService.fetchPlots();

        dispatch(fetchPlotsSuccess(response));
    } catch (err) {
        dispatch(fetchPlotsError(err));
    }
};

export const mapsSelectors = {
    hasMarkers: (state: IStore) => state.maps.hasMarkers,
    hasCircles: (state: IStore) => state.maps.hasCircles,
    hasPolygons: (state: IStore) => state.maps.hasPolygons,
    analytics: (state: IStore) => state.maps.analytics,
    filters: (state: IStore) => state.maps.filters,
    isFetching: (state: IStore) => state.maps.isFetching,
    isFetchingPointInfo: (state: IStore) => state.maps.isFetchingPointInfo,
    markers: (state: IStore) => state.maps.markers,
    circles: (state: IStore) => state.maps.circles,
    polygons: (state: IStore) => state.maps.polygons,
    pointInfo: (state: IStore) => state.maps.pointInfo,
    rectangleInfo: (state: IStore) => state.maps.rectangleInfo,
    plots: (state: IStore) => state.maps.plots,
    pointCoord: (state: IStore) => state.maps.pointCoord,
    rectangleCoord: (state: IStore) => state.maps.rectangleCoord,
    emptyZones: (state: IStore) => state.maps.emptyZones,
};
export const mapsActions = {
    switchMarkers,
    switchCircles,
    switchPolygons,
    saveFilters,
    changeAnalytics,
    fetchMunicipalityInfo,
    fetchPosition,
    fetchPointInfo,
    fetchRectangleInfo,
    fetchEmptyZones,
    fetchPlots,
};

const initialState = {
    hasMarkers: true,
    hasPolygons: false,
    hasCircles: false,
    isFetching: false,
    analytics: '',
    pointCoord: {} as Coordinate,
    rectangleCoord: [] as number[],
    filters: {} as IFilterParams,
    plots: [] as Plot[],
    pointInfo: {} as IPointInfo,
    isFetchingPointInfo: false,
    rectangleInfo: {} as IRectangleInfo,
    markers: [] as MarkerType[],
    circles: [] as TCircle[],
    polygons: [] as TPolygon[],
    emptyZones: { polygon: {} as TPolygon, area: null, population: null, isFetching: false } as {
        polygon: TPolygon;
        area: number;
        population: number;
        isFetching: boolean;
    },
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
            isFetchingPointInfo: true,
        };
    }),
    handleAction(fetchPointInfoSuccess, (state, { payload }) => {
        return {
            ...state,
            pointInfo: payload,
            isFetchingPointInfo: false,
        };
    }),
    handleAction(fetchPointInfoError, (state) => {
        return {
            ...state,
            isFetchingPointInfo: false,
        };
    }),
    handleAction(fetchPositionsSuccess, (state, { payload }) => {
        return {
            ...state,
            markers: payload.markers,
            isFetching: false,
        };
    }),
    handleAction(fetchPositionsError, (state) => {
        return {
            ...state,
            isFetching: false,
        };
    }),
    handleAction(fetchMunicipalityInfoSuccess, (state, { payload }) => {
        return {
            ...state,
            polygons: payload.polygonList,
        };
    }),

    handleAction(fetchRectangleStart, (state, { payload }) => {
        return {
            ...state,
            rectangleCoord: payload,
        };
    }),
    handleAction(fetchRectangleSuccess, (state, { payload }) => {
        return {
            ...state,
            rectangleInfo: payload,
        };
    }),
    handleAction(fetchEmptyZonesStart, (state) => {
        return {
            ...state,
            emptyZones: {
                ...state.emptyZones,
                isFetching: true,
            },
        };
    }),
    handleAction(fetchEmptyZonesSuccess, (state, { payload }) => {
        return {
            ...state,
            emptyZones: {
                ...payload,
                polygon: payload.polygonList[0],
                isFetching: false,
            },
        };
    }),
    handleAction(fetchEmptyZonesError, (state) => {
        return {
            ...state,
            emptyZones: {
                ...state.emptyZones,
                isFetching: false,
            },
        };
    }),
    handleAction(fetchPlotsSuccess, (state, { payload }) => {
        return {
            ...state,
            plots: payload.plots,
        };
    }),
]);
