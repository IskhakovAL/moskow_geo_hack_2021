import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, FormControlLabel, Switch, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { createForm } from 'final-form';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../Modal/Modal';
import { DictContext } from '../../context/context';
import styles from './filtersModal.m.scss';
import * as MapService from '../../services/MapService';
import { IDict } from '../../models/IDict';
import { mapsActions, mapsSelectors } from '../../ducks/maps';

interface IProps {
    onClose: () => void;
}

const filters = [
    { component: 'SportsFacility', name: 'Наименование спортивного объекта' },
    { component: 'DepartmentalAffiliation', name: 'Ведомственная принадлежность' },
    { component: 'SportsZonesList', name: 'Перечень спортивных зон ' },
    { component: 'SportsZonesTypes', name: 'Типы спортивных зон' },
    { component: 'SportsServices', name: 'Виды спортивных услуг' },
    { component: 'Availability', name: 'Доступность' },
];

const FiltersModal = ({ onClose }: IProps) => {
    const hasMarkers = useSelector(mapsSelectors.hasMarkers);
    const hasCircles = useSelector(mapsSelectors.hasCircles);
    const hasPolygons = useSelector(mapsSelectors.hasPolygons);

    const [acitveFilter, setActiveFilter] = useState('');
    const [dict, setDict] = useState({} as IDict);
    const dispatch = useDispatch();

    const initialValues = {
        sportsFacility: [],
        departmentalAffiliation: [],
        sportsZonesList: [],
        sportsZonesTypes: [],
        sportsServices: [],
        availability: [],
    };
    const fetchDict = async () => {
        try {
            const response = await MapService.fetchDict();

            setDict(response);
        } catch {}
    };

    useEffect(() => {
        fetchDict();
    }, []);
    const valuesRef = useRef(initialValues);

    const handleSwitchMarkers = (e) => {
        dispatch(mapsActions.switchMarkers(e.target.checked));
    };

    const handleSwitchCircles = (e) => {
        dispatch(mapsActions.switchCircles(e.target.checked));
    };

    const handleSwitchPolygon = (e) => {
        dispatch(mapsActions.switchPolygons(e.target.checked));
    };

    const handleOpen = (filter) => {
        setActiveFilter(filter);
    };

    const LazyFilter = React.lazy(() => import(`../Filters/${acitveFilter}`));
    const handleCloseFilter = useCallback(() => {
        setActiveFilter('');
    }, []);

    const onSubmit = async (values) => {
        const params = {
            sportsFacility: values.sportsFacility.map((item) => item.id),
            departmentalAffiliation: values.departmentalAffiliation.map((item) => item.id),
            sportsZonesList: values.sportsZonesList.map((item) => item.id),
            sportsZonesTypes: values.sportsZonesTypes.map((item) => item.id),
            sportsServices: values.sportsServices.map((item) => item.id),
            availability: Object.keys(values.availability).reduce((acc, key) => {
                if (values.availability[key]) {
                    acc.push(key);
                }

                return acc;
            }, []),
        };

        dispatch(mapsActions.fetchPosition(params));
    };

    const form = useMemo(() => createForm({ onSubmit }), []);

    return (
        <Modal title="Фильтры" onYesText="Нарисовать" onClose={onClose} onYes={form.submit}>
            <Form
                form={form}
                onSubmit={onSubmit}
                initialValues={
                    Object.keys(valuesRef.current).length ? valuesRef.current : initialValues
                }
                render={({ values, handleSubmit }) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        valuesRef.current = values;
                    }, [values]);
                    return (
                        <form onSubmit={handleSubmit}>
                            {!acitveFilter && (
                                <>
                                    <div className={styles.border}>
                                        {filters.map((filter) => (
                                            <React.Fragment key={filter.component}>
                                                <Button
                                                    className={styles.filterButton}
                                                    onClick={() => handleOpen(filter.component)}
                                                    endIcon={<KeyboardArrowRightIcon />}
                                                >
                                                    {filter.name}
                                                </Button>
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <Typography>Слои</Typography>
                                    <FormControlLabel
                                        style={{ marginTop: '10px' }}
                                        control={
                                            <Switch
                                                defaultChecked={hasMarkers}
                                                onChange={handleSwitchMarkers}
                                            />
                                        }
                                        label="Спортивные объекты"
                                    />
                                    <FormControlLabel
                                        style={{ marginTop: '10px' }}
                                        control={
                                            <Switch
                                                onChange={handleSwitchCircles}
                                                defaultChecked={hasCircles}
                                            />
                                        }
                                        label="Зоны доступности"
                                    />
                                    <FormControlLabel
                                        style={{ marginTop: '10px' }}
                                        control={
                                            <Switch
                                                onChange={handleSwitchPolygon}
                                                defaultChecked={hasPolygons}
                                            />
                                        }
                                        label="Плотность населения"
                                    />
                                </>
                            )}
                            {acitveFilter && (
                                <>
                                    <Button
                                        className={styles.backButton}
                                        startIcon={<KeyboardArrowLeftIcon />}
                                        onClick={handleCloseFilter}
                                    >
                                        Назад к фильтрам
                                    </Button>
                                    <DictContext.Provider value={dict}>
                                        <React.Suspense fallback={<span>Загрузка...</span>}>
                                            <LazyFilter />
                                        </React.Suspense>
                                    </DictContext.Provider>
                                </>
                            )}
                        </form>
                    );
                }}
            />
        </Modal>
    );
};

export default FiltersModal;
