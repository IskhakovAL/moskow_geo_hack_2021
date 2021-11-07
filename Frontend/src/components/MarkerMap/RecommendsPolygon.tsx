import { Polygon } from 'react-leaflet';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { mapsSelectors } from '../../ducks/maps';

const RecommendsPolygon = () => {
    const polygon = useSelector(mapsSelectors.recommendsPolygon);
    const hasRecommends = useSelector(mapsSelectors.hasRecommends);

    const reversePolygon = useMemo(() => polygon.map((item) => [item[1], item[0]]), [polygon]);

    if (!polygon.length || !hasRecommends) {
        return null;
    }

    return <Polygon pathOptions={{ color: '#1976d2' }} positions={reversePolygon as any} />;
};

export default RecommendsPolygon;
