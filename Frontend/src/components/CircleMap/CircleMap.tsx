import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import React from 'react';
import { TCircle } from '../../services/MapService';

interface IProps {
    circles: TCircle[];
}

function CircleMap({ circles }: IProps) {
    return (
        <MapContainer
            style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}
            center={[55.7522, 37.6156]}
            zoom={12}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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
        </MapContainer>
    );
}

export default CircleMap;
