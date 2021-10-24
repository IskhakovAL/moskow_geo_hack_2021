import { Circle } from 'react-leaflet';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import FiltersModal from '../FiltersModal/FiltersModal';
import useFiltersModal from '../FiltersModal/useFiltersModal';
import styles from '../../app.m.scss';
import { TCircle } from '../../models/IPositions';
import { IFilterParams } from '../../models/IFilterParams';
import { mapsSelectors } from '../../ducks/maps';

interface IProps {
    circles: TCircle[];
    fetchPositions: (params?: IFilterParams) => Promise<void>;
}

const CircleList = ({ circles, fetchPositions }: IProps) => {
    const { isOpenFilters, onClose, onOpen } = useFiltersModal();
    const hasCircles = useSelector(mapsSelectors.hasCircles);

    return (
        <>
            <div className={styles.arrow}>
                <IconButton aria-label="arrow" onClick={onOpen}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            {hasCircles
                ? circles.map((circle, idx) => {
                      const hasArea = circle.area !== 0;

                      return (
                          <Circle
                              center={circle.position as any}
                              radius={circle.radius}
                              key={idx}
                              pathOptions={{
                                  weight: 0,
                                  fillOpacity: hasArea ? circle.fillOpacity : 0.07,
                                  fillColor: hasArea ? '#EC0E43' : '#110932',
                              }}
                          />
                      );
                  })
                : null}
            {isOpenFilters && <FiltersModal onClose={onClose} fetchPositions={fetchPositions} />}
        </>
    );
};

export default CircleList;
