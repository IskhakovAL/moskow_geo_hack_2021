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
                        <Popup>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    доступность:{' '}
                                </Typography>
                                {marker.popup.availabilityName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    наименование спортивного объекта:{' '}
                                </Typography>
                                {marker.popup.objectName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    перечень спортивных зон:{' '}
                                </Typography>
                                {marker.popup.organizationName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    тип спортивных зон (крытые спортивные зоны, открытые спортивные
                                    зоны, бассейны):{' '}
                                </Typography>
                                {marker.popup.sportType}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    ведомственная принадлежность:{' '}
                                </Typography>
                                {marker.popup.zonesName}
                            </Typography>
                            <Typography>
                                <Typography component="span" className={styles.text}>
                                    вид спортивных услуг:{' '}
                                </Typography>
                                {marker.popup.zonesType}
                            </Typography>
                        </Popup>
                    </Marker>
                );
            })}
        </MarkerClusterGroup>
    );
};

export default MarkerList;
