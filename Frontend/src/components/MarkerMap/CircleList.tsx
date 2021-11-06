import { Circle } from 'react-leaflet';
import React from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';

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
                            fillColor: hasArea ? '#EC0E43' : '#110932',
                        }}
                    />
                );
            })}
        </>
    );
};

export default CircleList;
