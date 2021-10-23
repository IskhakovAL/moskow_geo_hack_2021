import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { MarkerType } from '../../services/MapService';

interface IProps {
    markers: MarkerType[];
}

function MarkerMap({ markers }: IProps) {
    return (
        <MapContainer
            style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}
            center={[55.7522, 37.6156]}
            zoom={12}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
                {markers.map((marker) => {
                    return (
                        <Marker
                            position={[marker.position[0], marker.position[1]]}
                            key={marker.popup}
                        >
                            <Popup>{marker.popup}</Popup>
                        </Marker>
                    );
                })}
            </MarkerClusterGroup>
        </MapContainer>
    );
}

export default MarkerMap;
