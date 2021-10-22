import React, { useCallback, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import * as MapService from './services/MapService';
import styles from './app.m.scss';
import FiltersModal from './components/FiltersModal/FiltersModal';
import { IDict } from './services/MapService';
import Map from './Map/Map';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
};

function App() {
    const [markers, setMarkers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [dict, setDict] = useState({} as IDict);

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
    const fetchDict = async () => {
        try {
            const response = await MapService.fetchDict();

            setDict(response);
        } catch {}
    };

    useEffect(() => {
        fetchMarkers();
        fetchDict();
    }, []);

    const handleOpen = useCallback(() => {
        setIsOpenFilters(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpenFilters(false);
    }, []);

    return (
        <>
            <div className={styles.arrow}>
                <ArrowBackIcon onClick={handleOpen} />
            </div>
            {isFetching ? (
                <div className={styles.loader}>
                    <CircularProgress />
                </div>
            ) : (
                <Map markers={markers} />
            )}
            {isOpenFilters && (
                <FiltersModal onClose={handleClose} dict={dict} fetchMarkers={fetchMarkers} />
            )}
        </>
    );
}

export default App;
