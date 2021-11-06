import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import PolygonList from '../PolygonList/PolygonList';

const PolygonMap = () => {
    const dispatch = useDispatch();
    const hasPolygons = useSelector(mapsSelectors.hasPolygons);
    const polygons = useSelector(mapsSelectors.polygons);

    useEffect(() => {
        if (hasPolygons && !polygons.length) {
            dispatch(mapsActions.fetchMunicipalityInfo());
        }
    }, [hasPolygons, polygons]);

    if (!hasPolygons) {
        return null;
    }

    return <PolygonList polygons={polygons} />;
};

export default PolygonMap;
