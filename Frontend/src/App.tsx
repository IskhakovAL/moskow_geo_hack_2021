import React, { useCallback, useEffect, useState } from 'react';
import { Skeleton, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as MapService from './services/MapService';
import styles from './app.m.scss';
import FiltersModal from './components/FiltersModal/FiltersModal';

function App() {
    const [srcDoc, setSrcDoc] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpenFilters, setIsOpenFilters] = useState(false);

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
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width="100%" height="60vh" />
                </Stack>
            ) : (
                <iframe srcDoc={srcDoc} width="100%" style={{ height: '95vh' }}>
                    Ваш браузер не поддерживает плавающие фреймы!
                </iframe>
            )}
            {isOpenFilters && <FiltersModal onClose={handleClose} />}
        </>
    );
}

export default App;
