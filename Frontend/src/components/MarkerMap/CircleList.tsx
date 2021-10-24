import { Circle } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import FiltersModal from '../FiltersModal/FiltersModal';
import useFiltersModal from '../FiltersModal/useFiltersModal';
import styles from '../../app.m.scss';
import { TCircle } from '../../models/IPositions';
import { IFilterParams } from '../../models/IFilterParams';

interface IProps {
    circles: TCircle[];
    fetchPositions: (params?: IFilterParams) => Promise<void>;
}

const CircleList = ({ circles, fetchPositions }: IProps) => {
    const { isOpenFilters, onClose, onOpen } = useFiltersModal();
    const [hasCircle, setHasCircle] = useState(Boolean(circles.length));

    useEffect(() => {
        setHasCircle(Boolean(circles.length));
    }, [circles.length]);

    return (
        <>
            <div className={styles.arrow}>
                <IconButton aria-label="arrow" onClick={onOpen}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            {hasCircle
                ? circles.map((circle, idx) => {
                      const hasArea = circle.area !== 0;

                      return (
                          <Circle
                              center={circle.position as any}
                              radius={circle.radius}
                              key={idx}
                              pathOptions={{
                                  weight: 0,
                                  fillOpacity: hasArea ? circle.circle_opacity : 0.2,
                                  fillColor: hasArea ? 'blue' : 'silver',
                              }}
                          />
                      );
                  })
                : null}
            {isOpenFilters && (
                <FiltersModal
                    onClose={onClose}
                    fetchPositions={fetchPositions}
                    onSwitchCircles={setHasCircle}
                />
            )}
        </>
    );
};

export default CircleList;
