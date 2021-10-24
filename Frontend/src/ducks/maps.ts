import { createActionCreator, createReducer } from 'deox';
import { IPositions, MarkerType, TCircle, TPolygon } from '../models/IPositions';
import * as MapService from '../services/MapService';

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

const fetchPositionsStart = createActionCreator('maps/fetchPositionsStart [..]');
const fetchPositionsSuccess = createActionCreator(
    'maps/fetchPositionsSuccess [success]',
    (resolve) => (payload: IPositions) => resolve(payload),
);
const fetchPositionsError = createActionCreator(
    'maps/fetchPositionsError [error]',
    (resolve) => (err: Error) => resolve(err.message),
);

const fetchPosition = (params) => async (dispatch) => {
    dispatch(fetchPositionsStart());
    try {
        const response = await MapService.fetchPositions(params);

        dispatch(fetchPositionsSuccess(response));
    } catch (err) {
        dispatch(fetchPositionsError(err));
    }
};

export const mapsSelectors = {
    hasMarkers: (state) => state.maps.hasMarkers,
    hasCircles: (state) => state.maps.hasCircles,
    hasPolygons: (state) => state.maps.hasPolygons,
    isFetching: (state) => state.maps.isFetching,
    markers: (state) => state.maps.markers,
    circles: (state) => state.maps.circles,
    polygons: (state) => state.maps.polygons,
};
export const mapsActions = {
    switchMarkers,
    switchCircles,
    switchPolygons,
    fetchPosition,
};

const initialState = {
    hasMarkers: true,
    hasPolygons: false,
    hasCircles: false,
    isFetching: false,
    markers: [] as MarkerType[],
    circles: [] as TCircle[],
    polygons: [] as TPolygon[],
};

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
    handleAction(fetchPositionsStart, (state) => {
        return {
            ...state,
            isFetching: true,
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
]);
