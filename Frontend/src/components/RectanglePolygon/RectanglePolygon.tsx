import { useSelector } from 'react-redux';
import { Polygon, Popup } from 'react-leaflet';
import React from 'react';
import { mapsSelectors } from '../../ducks/maps';

const RectanglePolygon = () => {
    const rectangleInfo = useSelector(mapsSelectors.rectangleInfo);
    const analytics = useSelector(mapsSelectors.analytics);

    if (!Object.keys(rectangleInfo).length || analytics !== 'area') {
        return null;
    }

    return (
        <>
            <Polygon pathOptions={{ color: 'blue' }} positions={rectangleInfo.polygonList as any}>
                <Popup>
                    <>
                        <p>Площадь спортивных зон: {rectangleInfo.areaOfSportZones}</p>
                        <p>Виды спортивных услуг: {rectangleInfo.typesOfSportServices}</p>
                        <p>Количество спортивных зон: {rectangleInfo.numberOfSportZones}</p>
                    </>
                </Popup>
            </Polygon>
        </>
    );
};

export default RectanglePolygon;
