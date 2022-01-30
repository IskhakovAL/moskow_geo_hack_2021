import { Marker, Popup } from 'react-leaflet';
import React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { mapsSelectors } from '../../ducks/maps';
import styles from './markerList.m.scss';

const MarkerList = () => {
    const hasMarkers = useSelector(mapsSelectors.hasMarkers);
    const markers = useSelector(mapsSelectors.markers);

    if (!hasMarkers) {
        return null;
    }

    return (
        <MarkerClusterGroup>
            {markers.map((marker, idx) => {
                return (
                    <Marker position={[marker.position[0], marker.position[1]]} key={idx}>
                        <Popup maxHeight={500}>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    Доступность:{' '}
                                </Typography>
                                {marker.popup.availabilityName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    Наименование спортивного объекта:{' '}
                                </Typography>
                                {marker.popup.objectName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    Перечень спортивных зон:{' '}
                                </Typography>
                                {marker.popup.zonesName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    Типы спортивных зон:{' '}
                                </Typography>
                                {marker.popup.zonesType}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    Ведомственная принадлежность:{' '}
                                </Typography>
                                {marker.popup.organizationName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    Виды спортивных услуг:{' '}
                                </Typography>
                                {marker.popup.sportType}
                            </Typography>
                        </Popup>
                    </Marker>
                );
            })}
        </MarkerClusterGroup>
    );
};

export default MarkerList;
