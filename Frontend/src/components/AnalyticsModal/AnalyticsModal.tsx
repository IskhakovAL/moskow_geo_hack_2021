import React, { useMemo } from 'react';
import cn from 'classnames';
import {
    Button,
    FormControl,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
    const rectangleCoord = useSelector(mapsSelectors.rectangleCoord);

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
        if (e.target.checked) {
            addCursorStyle('dot');
        }
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

        if (isAreaAnalytics) {
            MapService.fetchRectangleFile({ rectangleCoord, ...filters })
                .then(FileUtils.downloadZip)
                .catch(() => ({}));
        }
    };
    const disabled = useMemo(() => {
        if (isDotAnalytics) {
            return !Object.keys(pointCoord).length;
        }

        if (isAreaAnalytics) {
            return !rectangleCoord.length;
        }

        if (!analytics) {
            return true;
        }
    }, [analytics, rectangleCoord, pointCoord]);

    return (
        <div className={cn(styles.modal, { [styles.modalSwitchOff]: !analytics })}>
            <FormControl component="fieldset" className={styles.formControl}>
                <FormControlLabel
                    control={<Switch checked={Boolean(analytics)} onChange={handleSwitch} />}
                    labelPlacement="start"
                    label="Аналитика"
                    className={styles.switch}
                />
                {Boolean(analytics) && (
                    <>
                        <RadioGroup
                            aria-label="Аналитика"
                            name="radio-buttons-group"
                            onChange={handleChangeAnalytics}
                        >
                            <FormControlLabel
                                className={styles.formControlLabel}
                                value="dot"
                                control={<Radio checked={isDotAnalytics} />}
                                label={
                                    <Typography className={styles.label}>
                                        Аналитика по точке{' '}
                                        <Tooltip title="Активировав эту функцию вы можете выбрать интересующую Вас точку на карте (нажав на неё левой кнопкой мыши) и получить следующую информацию по ней: суммарную площадь объектов, типы спортивных зон, виды спортивных услуг.">
                                            <IconButton>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                className={styles.formControlLabel}
                                value="area"
                                control={<Radio checked={isAreaAnalytics} />}
                                label={
                                    <Typography className={styles.label}>
                                        Аналитика по области{' '}
                                        <Tooltip title="Активировав эту функцию вы можете выбрать интересующую Вас область на карте (зажав ctrl + выделив область левой кнопкой мыши) и получить следующую информацию по ней: перечень спортивных зон, суммарную площадь спортивных зон, виды спортивных услуг.">
                                            <IconButton>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                }
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
                    </>
                )}
            </FormControl>
        </div>
    );
};

export default AnalyticsModal;
