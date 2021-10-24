import CircularProgress from '@mui/material/CircularProgress';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../../app.m.scss';
import MarkerMap from '../MarkerMap/MarkerMap';
import * as MapService from '../../services/MapService';
import { IFilterParams } from '../../models/IFilterParams';
import { TCircle } from '../../models/IPositions';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
} as IFilterParams;

const MarkerPage = () => {
    const [circles, setCircles] = useState([] as TCircle[]);
    const [markers, setMarkers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const fetchPositions = useCallback(async (params = initialParams) => {
        setIsFetching(true);
        try {
            const responseMarkers = await MapService.fetchPositions(params);

            setMarkers(responseMarkers.markers);
            setCircles(responseMarkers.circles);
            setIsFetching(false);
        } catch {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchPositions();
    }, []);

    return (
        <>
            {isFetching ? (
                <div className={styles.loader}>
                    <CircularProgress />
                </div>
            ) : (
                <MarkerMap markers={markers} circles={circles} fetchPositions={fetchPositions} />
            )}
        </>
    );
};

export default MarkerPage;
