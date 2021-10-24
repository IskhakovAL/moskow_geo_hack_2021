import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import styles from '../../app.m.scss';
import MarkerMap from '../MarkerMap/MarkerMap';
import FiltersModal from '../FiltersModal/FiltersModal';
import * as MapService from '../../services/MapService';
import useFiltersModal from '../FiltersModal/useFiltersModal';
import { TCircle } from '../../services/MapService';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
};

const MarkerPage = () => {
    const [circles, setCircles] = useState([] as TCircle[]);
    const [markers, setMarkers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { isOpenFilters, onClose, onOpen } = useFiltersModal();

    const fetchPositions = async (params = initialParams) => {
        setIsFetching(true);
        try {
            const responseMarkers = await MapService.fetchMarkers(params);
            const responseCircles = await MapService.fetchCircles(params);

            setMarkers(responseMarkers.markers);
            setCircles(responseCircles.circles);
            setIsFetching(false);
        } catch {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    return (
        <>
            <div className={styles.arrow}>
                <ArrowBackIcon onClick={onOpen} />
            </div>
            {isFetching ? (
                <div className={styles.loader}>
                    <CircularProgress />
                </div>
            ) : (
                <MarkerMap markers={markers} circles={circles} />
            )}
            {isOpenFilters && <FiltersModal onClose={onClose} fetchMap={fetchPositions} />}
        </>
    );
};

export default MarkerPage;
