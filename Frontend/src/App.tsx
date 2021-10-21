import React, { useEffect, useState } from 'react';
import { Skeleton, Stack } from '@mui/material';
import Availability from './components/Filters/Availability';
import * as MapService from './services/MapService';
import styles from './App.m.scss';
import SportsFacility from './components/Filters/SportsFacility';
import DepartmentalAffiliation from './components/Filters/DepartmentalAffiliation';
import SportsZonesList from './components/Filters/SportsZonesList';
import SportsZonesTypes from './components/Filters/SportsZonesTypes';
import SportsServices from './components/Filters/SportServices';

function App() {
    const [srcDoc, setSrcDoc] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        (async () => {
            setIsFetching(true);
            try {
                const response = await MapService.fetchMap();

                setSrcDoc(response);
                setIsFetching(false);
            } catch {
                setIsFetching(false);
            }
        })();
    }, []);

    return (
        <>
            <div className={styles.filters}>
                <SportsFacility />
                <DepartmentalAffiliation />
                <SportsZonesList />
            </div>
            <div className={styles.filters}>
                <SportsZonesTypes />
                <SportsServices />
            </div>
            <Availability />
            {isFetching ? (
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width="100%" height="60vh" />
                </Stack>
            ) : (
                <iframe srcDoc={srcDoc} width="100%" style={{ minHeight: '60vh' }}>
                    Ваш браузер не поддерживает плавающие фреймы!
                </iframe>
            )}
        </>
    );
}

export default App;
