import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import PolygonList from '../PolygonList/PolygonList';
import Legend from '../Legend/Legend';

const getColor = (d) => {
    return d > 170740
        ? '#F90052'
        : d > 127694
        ? '#F4749F'
        : d > 95236
        ? '#F2AEC5'
        : d > 77360
        ? '#F1CBD8'
        : d > 38872
        ? '#EFE8EB'
        : d > 20
        ? '#FEB24C'
        : d > 10
        ? '#FED976'
        : '#FFEDA0';
};

const grades = [38872, 77360, 95236, 127694, 170740];

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

    return (
        <>
            <PolygonList polygons={polygons} />
            <Legend getColor={getColor} grades={grades} />
        </>
    );
};

export default PolygonMap;
