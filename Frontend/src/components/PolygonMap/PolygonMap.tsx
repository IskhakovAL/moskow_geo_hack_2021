import React, { useEffect, useState } from 'react';
import { Polygon, MapContainer, TileLayer } from 'react-leaflet';
import CircularProgress from '@mui/material/CircularProgress';
import * as MapService from '../../services/MapService';
import styles from '../../app.m.scss';

const PolygonMap = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [polygons, setPolygons] = useState({ polygonList: [], multiPolygonList: [] });

    const fetchPolygons = async () => {
        setIsFetching(true);
        try {
            const response = await MapService.fetchPolygons();

            setPolygons(response);
            setIsFetching(false);
        } catch {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPolygons();
    }, []);
    return (
        <MapContainer
            style={{ height: 'calc(100vh - 48px)', marginTop: '48px' }}
            center={[55.7522, 37.6156]}
            zoom={12}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {isFetching ? (
                <div className={styles.loader}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {polygons.multiPolygonList.map((polygon, idx) => (
                        <Polygon
                            key={idx}
                            pathOptions={{ fillOpacity: polygon.opacity }}
                            positions={polygon.multiPolygon}
                        />
                    ))}
                    {polygons.polygonList.map((polygon, idx) => (
                        <Polygon
                            key={idx}
                            pathOptions={{ fillOpacity: polygon.opacity }}
                            positions={polygon.polygon}
                        />
                    ))}
                </>
            )}
        </MapContainer>
    );
};

export default PolygonMap;
