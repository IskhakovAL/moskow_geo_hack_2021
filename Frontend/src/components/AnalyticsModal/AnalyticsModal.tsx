import React, { useMemo } from 'react';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import styles from './analyticsModal.m.scss';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import * as MapService from '../../services/MapService';
import FileUtils from '../../utils/FileUtils';

const cursor = {
    dot: 'crosshair',
    area: 'all-scroll',
};

const CURSOR_ID = 'cursor-id';

const AnalyticsModal = () => {
    const dispatch = useDispatch();
    const analytics = useSelector(mapsSelectors.analytics);
    const filters = useSelector(mapsSelectors.filters);
    const pointCoord = useSelector(mapsSelectors.pointCoord);
    const areaCoord = [];

    const isDotAnalytics = analytics === 'dot';
    const isEmptyAnalytics = analytics === 'empty';
    const isAreaAnalytics = analytics === 'area';

    const removePrevCursorStyle = () => {
        const prevCursor = document.getElementById(CURSOR_ID);

        if (prevCursor) {
            prevCursor.remove();
        }
    };

    const addCursorStyle = (analytics) => {
        const cursorStyle = document.createElement('style');

        cursorStyle.innerHTML = `.leaflet-container {cursor: ${cursor[analytics]}!important;}`;
        cursorStyle.id = CURSOR_ID;
        document.head.appendChild(cursorStyle);
    };
    const handleSwitch = (e) => {
        removePrevCursorStyle();
        addCursorStyle('dot');

        if (!e.target.checked) {
            dispatch(mapsActions.changeAnalytics(''));
        }

        if (analytics === '') {
            dispatch(mapsActions.changeAnalytics('dot'));
        }
    };
    const handleChangeAnalytics = (e) => {
        dispatch(mapsActions.changeAnalytics(e.target.value));
        removePrevCursorStyle();

        addCursorStyle(e.target.value);
    };

    const downloadZip = () => {
        if (isEmptyAnalytics) {
            MapService.fetchEmptyZonesFile(filters)
                .then(FileUtils.downloadZip)
                .catch(() => ({}));
        }
        if (isDotAnalytics) {
            MapService.fetchPointInfoFile({ pointCoord, ...filters })
                .then(FileUtils.downloadZip)
                .catch(() => ({}));
        }
    };
    const disabled = useMemo(() => {
        if (isDotAnalytics) {
            return !Object.keys(pointCoord).length;
        }

        if (isAreaAnalytics) {
            return !Object.keys(areaCoord).length;
        }

        if (!analytics) {
            return true;
        }
    }, [analytics, areaCoord, pointCoord]);

    return (
        <div className={styles.modal}>
            <FormControl component="fieldset">
                <FormControlLabel
                    control={<Switch checked={Boolean(analytics)} onChange={handleSwitch} />}
                    labelPlacement="start"
                    label="Аналитика"
                    className={styles.switch}
                />
                <RadioGroup
                    aria-label="Аналитика"
                    name="radio-buttons-group"
                    onChange={handleChangeAnalytics}
                >
                    <FormControlLabel
                        value="dot"
                        control={<Radio checked={isDotAnalytics} />}
                        label="Аналитика по точке"
                    />
                    <FormControlLabel
                        value="area"
                        control={<Radio checked={isAreaAnalytics} />}
                        label="Аналитика по области"
                    />
                    <FormControlLabel
                        value="empty"
                        control={<Radio checked={isEmptyAnalytics} />}
                        label="Пустые зоны"
                    />
                </RadioGroup>
                <Button
                    variant="contained"
                    className={styles.button}
                    disabled={disabled}
                    onClick={downloadZip}
                >
                    Сохранить Слои
                </Button>
            </FormControl>
        </div>
    );
};

export default AnalyticsModal;
