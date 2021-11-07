import { useSelector } from 'react-redux';
import { Polygon } from 'react-leaflet';
import React from 'react';
import { Typography } from '@mui/material';
import { mapsSelectors } from '../../ducks/maps';
import ReportModal from '../ReportModal/ReportModal';
import styles from './rectanglePolygon.m.scss';

const RectanglePolygon = () => {
    const rectangleInfo = useSelector(mapsSelectors.rectangleInfo);
    const analytics = useSelector(mapsSelectors.analytics);

    if (!Object.keys(rectangleInfo).length || analytics !== 'area') {
        return null;
    }

    const renderList = (item, idx) => (
        <Typography component="p" key={idx} className={styles.item}>
            ● {item}
        </Typography>
    );

    return (
        <>
            <Polygon pathOptions={{ color: 'blue' }} positions={rectangleInfo.polygonList as any} />
            <ReportModal>
                <>
                    <Typography className={styles.mb5}>
                        <Typography component="span" className={styles.text}>
                            Суммарная площадь спортивных зон (на 100 тыс.):
                        </Typography>{' '}
                        {rectangleInfo.averageAreaOfSportsZones} км²
                    </Typography>
                    <Typography>
                        <Typography component="span" className={styles.text}>
                            Спортивные зоны (на 100 тыс.):
                        </Typography>
                        <Typography component="div" className={styles.typographyDiv}>
                            {rectangleInfo.typesOfSportsZones.map(renderList)}
                        </Typography>
                    </Typography>
                    <Typography>
                        <Typography component="p" className={styles.text}>
                            Спортивные услуги (на 100 тыс.):
                        </Typography>{' '}
                        <Typography component="div" className={styles.typographyDiv}>
                            {rectangleInfo.typesOfSportsServices.map(renderList)}
                        </Typography>
                    </Typography>
                </>
            </ReportModal>
        </>
    );
};

export default RectanglePolygon;
