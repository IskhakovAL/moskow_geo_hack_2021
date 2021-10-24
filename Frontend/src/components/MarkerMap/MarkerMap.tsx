import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerList from './MarkerList';
import CircleList from './CircleList';
import { MarkerType, TCircle } from '../../models/IPositions';
import { IFilterParams } from '../../models/IFilterParams';

interface IProps {
    markers: MarkerType[];
    circles: TCircle[];
    fetchPositions: (params?: IFilterParams) => Promise<void>;
}

function MarkerMap({ markers, circles, fetchPositions }: IProps) {
    return (
        <MapContainer
            style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}
            center={[55.7522, 37.6156]}
            zoom={9}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerList markers={markers} />
            <CircleList circles={circles} fetchPositions={fetchPositions} />
        </MapContainer>
    );
}

export default MarkerMap;
