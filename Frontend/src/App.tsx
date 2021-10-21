import React, { useCallback, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import * as MapService from './services/MapService';
import styles from './app.m.scss';
import FiltersModal from './components/FiltersModal/FiltersModal';
import { IDict } from './services/MapService';

const initialParams = {
    sportsFacility: [],
    departmentalAffiliation: [],
    sportsZonesList: [],
    sportsZonesTypes: [],
    sportsServices: [],
    availability: [],
};

function App() {
    const [srcDoc, setSrcDoc] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpenFilters, setIsOpenFilters] = useState(true);
    const [dict, setDict] = useState({} as IDict);

    const fetchMap = async (params = initialParams) => {
        setIsFetching(true);
        try {
            const response = await MapService.fetchMap(params);

            setSrcDoc(response);
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
        fetchMap();
        fetchDict();
    }, []);

    const handleOpen = useCallback(() => {
        setIsOpenFilters(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpenFilters(false);
    }, []);

    console.log('isFetching', isFetching);

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
                <iframe srcDoc={srcDoc} width="100%" style={{ height: '95vh' }}>
                    Ваш браузер не поддерживает плавающие фреймы!
                </iframe>
            )}
            {isOpenFilters && (
                <FiltersModal onClose={handleClose} dict={dict} fetchMap={fetchMap} />
            )}
        </>
    );
}

export default App;
