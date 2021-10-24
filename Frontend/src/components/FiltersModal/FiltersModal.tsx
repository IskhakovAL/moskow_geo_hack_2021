import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, FormControlLabel, IconButton, Switch, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '../Modal/Modal';
import { DictContext } from '../../context/context';
import styles from './filtersModal.m.scss';
import * as MapService from '../../services/MapService';
import { IDict } from '../../models/IDict';
import useFiltersModal from './useFiltersModal';

const filters = [
    { component: 'SportsFacility', name: 'Наименование спортивного объекта' },
    { component: 'DepartmentalAffiliation', name: 'Ведомственная принадлежность' },
    { component: 'SportsZonesList', name: 'Перечень спортивных зон ' },
    { component: 'SportsZonesTypes', name: 'Типы спортивных зон' },
    { component: 'SportsServices', name: 'Виды спортивных услуг' },
    { component: 'Availability', name: 'Доступность' },
];

const FiltersModal = () => {
    const {
        form,
        isOpenFilters,
        onClose,
        onOpen,
        hasMarkers,
        hasPolygons,
        hasCircles,
        onSwitchPolygon,
        onSwitchMarkers,
        onSwitchCircles,
        onSubmit,
    } = useFiltersModal();

    const [acitveFilter, setActiveFilter] = useState('');
    const [dict, setDict] = useState({} as IDict);

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

    const handleOpen = (filter) => {
        setActiveFilter(filter);
    };

    const LazyFilter = React.lazy(() => import(`../Filters/${acitveFilter}`));
    const handleCloseFilter = useCallback(() => {
        setActiveFilter('');
    }, []);

    return (
        <>
            <div className={styles.arrow}>
                <IconButton aria-label="arrow" onClick={onOpen}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            {isOpenFilters && (
                <Modal title="Фильтры" onYesText="Нарисовать" onClose={onClose} onYes={form.submit}>
                    <Form
                        form={form}
                        onSubmit={onSubmit}
                        initialValues={
                            Object.keys(valuesRef.current).length
                                ? valuesRef.current
                                : initialValues
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
                                                            onClick={() =>
                                                                handleOpen(filter.component)
                                                            }
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
                                                        onChange={onSwitchMarkers}
                                                    />
                                                }
                                                label="Спортивные объекты"
                                            />
                                            <FormControlLabel
                                                style={{ marginTop: '10px' }}
                                                control={
                                                    <Switch
                                                        onChange={onSwitchCircles}
                                                        defaultChecked={hasCircles}
                                                    />
                                                }
                                                label="Зоны доступности"
                                            />
                                            <FormControlLabel
                                                style={{ marginTop: '10px' }}
                                                control={
                                                    <Switch
                                                        onChange={onSwitchPolygon}
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
            )}
        </>
    );
};

export default FiltersModal;
