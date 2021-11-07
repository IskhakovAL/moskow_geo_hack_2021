import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-area-select';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import MarkerList from './MarkerList';
import CircleList from './CircleList';
import PolygonMap from './PolygonMap';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import PointPolygon from './PointPolygon';
import EmptyZones from './EmptyZones';
import RectanglePolygon from '../RectanglePolygon/RectanglePolygon';
import RecommendsPolygon from './RecommendsPolygon';

function MapClickHandler() {
    const analytics = useSelector(mapsSelectors.analytics);
    const filters = useSelector(mapsSelectors.filters);
    const dispatch = useDispatch();

    useMapEvents({
        click: (e) => {
            if (analytics === 'dot') {
                dispatch(
                    mapsActions.fetchPointInfo({
                        pointCoord: [e.latlng.lng, e.latlng.lat],
                        ...filters,
                    }),
                );
            }
        },
    });

    return null;
}

function AreaSelect() {
    const dispatch = useDispatch();
    const filters = useSelector(mapsSelectors.filters);
    const analytics = useSelector(mapsSelectors.analytics);
    const map = useMap();

    useEffect(() => {
        // @ts-ignore
        if (!map.selectArea) {
            return;
        }

        if (analytics === 'area') {
            // @ts-ignore
            map.selectArea.enable();

            map.on('areaselected', (e) => {
                // @ts-ignore
                L.rectangle(e.bounds, { color: 'blue', weight: 1 }).addTo(map);

                dispatch(
                    mapsActions.fetchRectangleInfo({
                        // @ts-ignore
                        rectangleCoord: e.bounds
                            .toBBoxString()
                            .split(',')
                            .map(Number),
                        ...filters,
                    }),
                );
            });

            // You can restrict selection area like this:
            const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
            // check restricted area on start and move
            // @ts-ignore

            map.selectArea.setValidate((layerPoint) => {
                return bounds.contains(this._map.layerPointToLatLng(layerPoint));
            });

            // now switch it off
            // @ts-ignore
            map.selectArea.setValidate();
        }
    }, [analytics]);

    return null;
}

function MarkerMap() {
    return (
        <>
            <MapContainer
                id="MAP_CONTAINER"
                style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}
                center={[55.7522, 37.6156]}
                zoom={9}
            >
                <TileLayer
                    url="https://api.mapbox.com/styles/v1/prokudin/ckv52trrj1wyn15nz1u8mzi84/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJva3VkaW4iLCJhIjoiY2t2NTJ3OGM3MDNhcDJvcGoyenRlbWR3eSJ9.EYDdmolFRoe4n1tuJ75vGw"
                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                />
                <MarkerList />
                <CircleList />
                <PolygonMap />
                <PointPolygon />
                <RectanglePolygon />
                <RecommendsPolygon />
                <EmptyZones />
                <MapClickHandler />
                <AreaSelect />
            </MapContainer>
        </>
    );
}

export default MarkerMap;
