import React, { useEffect, useState } from 'react';
import { Skeleton, Stack } from '@mui/material';
import Availability from './components/Availability/Availability';
import * as MapService from './services/MapService';
import SportServices from './components/SportServices/SportServices';
import styles from './App.m.scss';

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
                <Availability />
                <SportServices />
            </div>
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
