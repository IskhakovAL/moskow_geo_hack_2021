import React from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';
import PolygonList from '../PolygonList/PolygonList';

const PolygonMap = () => {
    const hasPolygons = useSelector(mapsSelectors.hasPolygons);
    const polygons = useSelector(mapsSelectors.polygons);

    if (!hasPolygons) {
        return null;
    }

    return <PolygonList polygons={polygons} />;
};

export default PolygonMap;
