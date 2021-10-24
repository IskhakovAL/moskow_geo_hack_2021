import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerList from './MarkerList';
import CircleList from './CircleList';
import { MarkerType, TCircle, TPolygon } from '../../models/IPositions';
import { IFilterParams } from '../../models/IFilterParams';
import PolygonList from './PolygonList';

interface IProps {
    markers: MarkerType[];
    circles: TCircle[];
    polygons: TPolygon[];
    fetchPositions: (params?: IFilterParams) => Promise<void>;
}

function MarkerMap({ markers, circles, polygons, fetchPositions }: IProps) {
    return (
        <MapContainer
            style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}
            center={[55.7522, 37.6156]}
            zoom={9}
        >
            <TileLayer
                url="https://api.mapbox.com/styles/v1/prokudin/ckv52trrj1wyn15nz1u8mzi84/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJva3VkaW4iLCJhIjoiY2t2NTJ3OGM3MDNhcDJvcGoyenRlbWR3eSJ9.EYDdmolFRoe4n1tuJ75vGw"
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            />
            <MarkerList markers={markers} />
            <CircleList circles={circles} fetchPositions={fetchPositions} />
            <PolygonList polygons={polygons} />
        </MapContainer>
    );
}

export default MarkerMap;
