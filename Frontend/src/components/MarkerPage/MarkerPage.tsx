import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../app.m.scss';
import MarkerMap from '../MarkerMap/MarkerMap';
import { IFilterParams } from '../../models/IFilterParams';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import FiltersModal from '../FiltersModal/FiltersModal';
import AnalyticsModal from '../AnalyticsModal/AnalyticsModal';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
} as IFilterParams;

const MarkerPage = () => {
    const dispatch = useDispatch();
    const isFetching = useSelector(mapsSelectors.isFetching);

    useEffect(() => {
        dispatch(mapsActions.fetchPosition(initialParams));
    }, []);

    return (
        <>
            {isFetching ? (
                <div className={styles.loader}>
                    <CircularProgress />
                </div>
            ) : (
                <MarkerMap />
            )}
            <AnalyticsModal />
            <FiltersModal />
        </>
    );
};

export default MarkerPage;
