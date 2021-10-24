import { createActionCreator, createReducer } from 'deox';

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

export const mapsSelectors = {
    hasMarkers: (state) => state.maps.hasMarkers,
    hasCircles: (state) => state.maps.hasCircles,
    hasPolygons: (state) => state.maps.hasPolygons,
};
export const mapsActions = {
    switchMarkers,
    switchCircles,
    switchPolygons,
};

const initialState = {
    hasMarkers: true,
    hasPolygons: false,
    hasCircles: false,
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
]);
