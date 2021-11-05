import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useDispatch, useSelector } from 'react-redux';
import { mapsActions, mapsSelectors } from '../../ducks/maps';

const stylePlot = { marginTop: '70px' };

const Dashbords = () => {
    const dispatch = useDispatch();
    const plots = useSelector(mapsSelectors.plots);

    useEffect(() => {
        dispatch(mapsActions.fetchPlots());
    }, []);

    if (!plots.length) {
        return null;
    }

    return (
        <>
            {plots.map((plot, idx) => (
                <Plot style={stylePlot} key={idx} data={plot.data} layout={plot.layout} />
            ))}
        </>
    );
};

export default Dashbords;
