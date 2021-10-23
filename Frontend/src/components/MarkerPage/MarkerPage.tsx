import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import styles from '../../app.m.scss';
import MarkerMap from '../MarkerMap/MarkerMap';
import FiltersModal from '../FiltersModal/FiltersModal';
import * as MapService from '../../services/MapService';
import useFiltersModal from '../FiltersModal/useFiltersModal';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
};

const MarkerPage = () => {
    const [markers, setMarkers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const { isOpenFilters, onOpen, onClose } = useFiltersModal();

    const fetchMarkers = async (params = initialParams) => {
        setIsFetching(true);
        try {
            const response = await MapService.fetchMarkers(params);

            setMarkers(response.markers);
            setIsFetching(false);
        } catch {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchMarkers();
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
                <MarkerMap markers={markers} />
            )}
            {isOpenFilters && <FiltersModal onClose={onClose} fetchMap={fetchMarkers} />}
        </>
    );
};

export default MarkerPage;
