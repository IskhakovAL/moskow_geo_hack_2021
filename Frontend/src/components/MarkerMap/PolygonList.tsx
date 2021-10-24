import { Polygon } from 'react-leaflet';
import React from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';
import { TPolygon } from '../../models/IPositions';

interface IProps {
    polygons: TPolygon[];
}

const PolygonList = ({ polygons }: IProps) => {
    const hasPolygons = useSelector(mapsSelectors.hasPolygons);

    if (!hasPolygons) {
        return null;
    }

    return (
        <>
            {polygons.map((polygon, idx) => (
                <Polygon
                    key={idx}
                    pathOptions={{ fillOpacity: polygon.fillOpacity, color: '#EC0E43' }}
                    positions={polygon.polygon as any}
                />
            ))}
        </>
    );
};

export default PolygonList;
