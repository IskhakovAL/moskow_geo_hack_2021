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
                url="https://api.mapbox.com/styles/v1/prokudin/ckv52trrj1wyn15nz1u8mzi84/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJva3VkaW4iLCJhIjoiY2t2NTJ3OGM3MDNhcDJvcGoyenRlbWR3eSJ9.EYDdmolFRoe4n1tuJ75vGw"
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
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
