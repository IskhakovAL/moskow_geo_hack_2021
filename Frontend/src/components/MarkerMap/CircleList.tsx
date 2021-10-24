import { Circle } from 'react-leaflet';
import React from 'react';
import { TCircle } from '../../services/MapService';

interface IProps {
    circles: TCircle[];
}

const CircleList = ({ circles }: IProps) => {
    if (!circles.length) {
        return null;
    }
    return (
        <>
            {circles.map((circle, idx) => {
                const hasArea = circle.area !== 0;

                return (
                    <Circle
                        center={circle.position}
                        radius={circle.radius}
                        key={idx}
                        pathOptions={{
                            weight: 0,
                            fillOpacity: hasArea ? circle.circle_opacity : 0.2,
                            fillColor: hasArea ? 'blue' : 'silver',
                        }}
                    />
                );
            })}
        </>
    );
};

export default CircleList;
