import { Circle } from 'react-leaflet';
import React from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';

const CircleList = () => {
    const hasCircles = useSelector(mapsSelectors.hasCircles);
    const circles = useSelector(mapsSelectors.circles);

    if (!hasCircles) {
        return null;
    }

    return (
        <>
            {circles.map((circle, idx) => {
                const hasArea = circle.area !== 0;

                return (
                    <Circle
                        center={circle.position as any}
                        radius={circle.radius}
                        key={idx}
                        pathOptions={{
                            weight: 0,
                            fillOpacity: hasArea ? circle.fillOpacity : 0.07,
                            fillColor: hasArea ? '#EC0E43' : '#110932',
                        }}
                    />
                );
            })}
        </>
    );
};

export default CircleList;
