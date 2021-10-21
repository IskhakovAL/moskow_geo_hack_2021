import React, { useCallback, useState } from 'react';
import { Button } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Modal from '../Modal/Modal';
import styles from './filtersModal.m.scss';

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
    const [acitveFilter, setActiveFilter] = useState('');
    const handleOpen = (filter) => {
        setActiveFilter(filter);
    };

    const LazyFilter = React.lazy(() => import(`../Filters/${acitveFilter}`));
    const handleCloseFilter = useCallback(() => {
        setActiveFilter('');
    }, []);

    return (
        <Modal title="Фильтры" onYesText="Нарисовать" onClose={onClose} onYes={() => undefined}>
            {!acitveFilter && (
                <>
                    {filters.map((filter) => (
                        <>
                            <Button
                                key={filter.component}
                                className={styles.filterButton}
                                onClick={() => handleOpen(filter.component)}
                                endIcon={<KeyboardArrowRightIcon />}
                            >
                                {filter.name}
                            </Button>
                            <br />
                        </>
                    ))}
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
                    <React.Suspense fallback={<span>Загрузка...</span>}>
                        <LazyFilter />
                    </React.Suspense>
                </>
            )}
        </Modal>
    );
};

export default FiltersModal;
