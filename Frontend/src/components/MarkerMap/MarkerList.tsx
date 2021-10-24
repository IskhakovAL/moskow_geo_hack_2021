import { Marker, Popup } from 'react-leaflet';
import React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';

const MarkerList = () => {
    const hasMarkers = useSelector(mapsSelectors.hasMarkers);
    const markers = useSelector(mapsSelectors.markers);

    if (!hasMarkers) {
        return null;
    }
    return (
        <MarkerClusterGroup>
            {markers.map((marker, idx) => {
                return (
                    <Marker position={[marker.position[0], marker.position[1]]} key={idx}>
                        <Popup>{marker.popup}</Popup>
                    </Marker>
                );
            })}
        </MarkerClusterGroup>
    );
};

export default MarkerList;
