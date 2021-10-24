import { Marker, Popup } from 'react-leaflet';
import React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useSelector } from 'react-redux';
import { MarkerType } from '../../models/IPositions';
import { mapsSelectors } from '../../ducks/maps';

interface IProps {
    markers: MarkerType[];
}

const MarkerList = ({ markers }: IProps) => {
    const hasMarkers = useSelector(mapsSelectors.hasMarkers);

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
