import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Polygon } from 'react-leaflet';
import { Typography } from '@mui/material';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import ReportModal from '../ReportModal/ReportModal';
import styles from './emptyZones.m.scss';
import useModal from '../../hooks/useModal';

const EmptyZones = () => {
    const dispatch = useDispatch();
    const emptyZones = useSelector(mapsSelectors.emptyZones);
    const filters = useSelector(mapsSelectors.filters);
    const analytics = useSelector(mapsSelectors.analytics);
    const { polygon, isFetching } = emptyZones;
    const { isOpen, onClose, onOpen } = useModal();

    const onCloseReport = useCallback(() => {
        dispatch(mapsActions.resetEmptyZones());
        onClose();
    }, []);

    useEffect(() => {
        if (analytics === 'empty') {
            dispatch(mapsActions.fetchEmptyZones(filters));
            onOpen();
        }
    }, [filters, analytics]);

    if (analytics !== 'empty') {
        return null;
    }

    return (
        <>
            {Boolean(Object.keys(polygon).length) && (
                <Polygon
                    pathOptions={{ fillOpacity: polygon.fillOpacity, color: '#d5adfb' }}
                    positions={polygon.polygon}
                />
            )}
            {isOpen && (
                <ReportModal isFetching={isFetching} onClose={onCloseReport}>
                    <>
                        <Typography className={styles.mb5}>
                            <Typography component="span" className={styles.text}>
                                Суммарная площадь пустых зон по выбранным фильтрам:
                            </Typography>{' '}
                            {emptyZones.area} км²
                        </Typography>
                        <Typography className={styles.mb5}>
                            <Typography component="span" className={styles.text}>
                                Насление пустых зон:
                            </Typography>{' '}
                            {emptyZones.population}
                        </Typography>
                    </>
                </ReportModal>
            )}
        </>
    );
};

export default EmptyZones;
