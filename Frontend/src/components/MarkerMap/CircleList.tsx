import { Circle } from 'react-leaflet';
import React from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';
import Legend from '../Legend/Legend';

const getColor = (d) => {
    return d > 7000
        ? '#133072'
        : d > 2700
        ? '#748BB5'
        : d > 1100
        ? '#A5B9D6'
        : d > 420
        ? '#BDD0E7'
        : d > 140
        ? '#D5E6F7'
        : d > 20
        ? '#FEB24C'
        : d > 10
        ? '#FED976'
        : '#FFEDA0';
};

const grades = [140, 420, 1100, 2700, 7000];

const CircleList = () => {
    const hasCircles = useSelector(mapsSelectors.hasCircles);
    const markers = useSelector(mapsSelectors.markers);

    if (!hasCircles) {
        return null;
    }

    return (
        <>
            {markers.map((marker, idx) => {
                const hasArea = marker.area !== 0;

                return (
                    <Circle
                        center={marker.position as any}
                        radius={marker.radius}
                        key={idx}
                        pathOptions={{
                            weight: 0,
                            fillOpacity: hasArea ? marker.fillOpacity : 0.07,
                            fillColor: hasArea ? '#133072' : '#d5e6f7',
                        }}
                    />
                );
            })}
            <Legend getColor={getColor} grades={grades} classname="circles-legend" />
        </>
    );
};

export default CircleList;
