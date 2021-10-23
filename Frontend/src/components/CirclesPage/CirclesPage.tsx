import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import * as MapService from '../../services/MapService';
import { TCircle } from '../../services/MapService';
import styles from '../../app.m.scss';
import FiltersModal from '../FiltersModal/FiltersModal';
import useFiltersModal from '../FiltersModal/useFiltersModal';
import CircleMap from '../CircleMap/CircleMap';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
};

const CirclesPage = () => {
    const [circles, setCircles] = useState([] as TCircle[]);
    const [isFetching, setIsFetching] = useState(false);
    const { isOpenFilters, onOpen, onClose } = useFiltersModal();

    const fetchCircles = async (params = initialParams) => {
        setIsFetching(true);
        try {
            const response = await MapService.fetchCircles(params);

            setCircles(response.circles);
            setIsFetching(false);
        } catch {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchCircles();
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
                <CircleMap circles={circles} />
            )}
            {isOpenFilters && <FiltersModal onClose={onClose} fetchMap={fetchCircles} />}
        </>
    );
};

export default CirclesPage;
