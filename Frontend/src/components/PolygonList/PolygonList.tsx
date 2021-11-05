import { Polygon } from 'react-leaflet';
import React from 'react';
import { TPolygon } from '../../models/IPositions';

interface IProps {
    polygons: TPolygon[];
}

const PolygonList = ({ polygons }: IProps) => {
    return (
        <>
            {polygons.map((polygon, idx) => (
                <Polygon
                    key={idx}
                    pathOptions={{ fillOpacity: polygon.fillOpacity, color: '#EC0E43' }}
                    positions={polygon.polygon}
                />
            ))}
        </>
    );
};

export default PolygonList;
