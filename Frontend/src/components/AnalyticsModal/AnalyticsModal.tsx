import React from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import styles from './analyticsModal.m.scss';
import { mapsActions, mapsSelectors } from '../../ducks/maps';

const cursor = {
    dot: 'crosshair',
    area: 'all-scroll',
};

const CURSOR_ID = 'cursor-id';

const AnalyticsModal = () => {
    const dispatch = useDispatch();
    const analytics = useSelector(mapsSelectors.analytics);
    const handleSwitch = (e) => {
        const prevCursor = document.getElementById(CURSOR_ID);

        if (prevCursor) {
            prevCursor.remove();
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
        const prevCursor = document.getElementById(CURSOR_ID);

        if (prevCursor) {
            prevCursor.remove();
        }

        const cursorStyle = document.createElement('style');

        cursorStyle.innerHTML = `.leaflet-container {cursor: ${cursor[e.target.value]}!important;}`;
        cursorStyle.id = CURSOR_ID;
        document.head.appendChild(cursorStyle);
    };

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
                        control={<Radio checked={analytics === 'dot'} />}
                        label="Аналитика по точке"
                    />
                    <FormControlLabel
                        value="area"
                        control={<Radio checked={analytics === 'area'} />}
                        label="Аналитика по области"
                    />
                    <FormControlLabel
                        value="empty"
                        control={<Radio checked={analytics === 'empty'} />}
                        label="Пустые зоны"
                    />
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default AnalyticsModal;
