import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Polygon } from 'react-leaflet';
import { mapsActions, mapsSelectors } from '../../ducks/maps';

const EmptyZones = () => {
    const dispatch = useDispatch();
    const emptyZones = useSelector(mapsSelectors.emptyZones);
    const filters = useSelector(mapsSelectors.filters);
    const analytics = useSelector(mapsSelectors.analytics);

    useEffect(() => {
        if (analytics === 'empty') {
            dispatch(mapsActions.fetchEmptyZones(filters));
        }
    }, [filters, analytics]);

    if (!Object.keys(emptyZones).length || analytics !== 'empty') {
        return null;
    }

    return (
        <Polygon
            pathOptions={{ fillOpacity: emptyZones.fillOpacity, color: 'green' }}
            positions={emptyZones.polygon}
        />
    );
};

export default EmptyZones;
