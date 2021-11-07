import { Polygon, Tooltip } from 'react-leaflet';
import React from 'react';
import { Typography } from '@mui/material';
import { TPolygon } from '../../models/IPositions';

interface IProps {
    polygons: TPolygon[];
}

const PolygonList = ({ polygons }: IProps) => {
    return (
        <>
            {polygons.map((polygon, idx) => (
                <Polygon
                    key={idx}
                    pathOptions={{ fillOpacity: polygon.fillOpacity, color: '#f90052' }}
                    positions={polygon.polygon}
                >
                    <Tooltip>
                        <>
                            <Typography>
                                Наименование района: {polygon.popup.municipality}
                            </Typography>
                            <Typography>Население: {polygon.popup.people}</Typography>
                        </>
                    </Tooltip>
                </Polygon>
            ))}
        </>
    );
};

export default PolygonList;
