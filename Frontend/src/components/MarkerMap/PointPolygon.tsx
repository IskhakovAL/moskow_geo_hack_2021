import { Polygon, Popup } from 'react-leaflet';
import React from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';

const PointPolygon = () => {
    const pointInfo = useSelector(mapsSelectors.pointInfo);
    const analytics = useSelector(mapsSelectors.analytics);

    if (!Object.keys(pointInfo).length || analytics !== 'dot') {
        return null;
    }

    return (
        <>
            <Polygon pathOptions={{ color: 'blue' }} positions={pointInfo.polygonList as any}>
                <Popup>
                    <>
                        <p>Спортивные зоны: {pointInfo.typesOfSportsZones.join(', ')}</p>
                        <p>Спортивные объекты: {pointInfo.typesOfSportsServices.join(', ')}</p>
                        <p>Площадь объектов: {pointInfo.totalAreaOfSportsZones}</p>
                    </>
                </Popup>
            </Polygon>
        </>
    );
};

export default PointPolygon;
