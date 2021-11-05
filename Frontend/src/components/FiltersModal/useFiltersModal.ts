import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createForm } from 'final-form';
import { mapsActions, mapsSelectors } from '../../ducks/maps';
import FormUtils from '../../utils/FormUtils';

export default function useFiltersModal() {
    const dispatch = useDispatch();

    const hasMarkers = useSelector(mapsSelectors.hasMarkers);
    const hasCircles = useSelector(mapsSelectors.hasCircles);
    const hasPolygons = useSelector(mapsSelectors.hasPolygons);
    const [isOpenFilters, setIsOpenFilters] = useState(true);

    const onOpen = useCallback(() => {
        setIsOpenFilters(true);
    }, []);

    const onClose = useCallback(() => {
        setIsOpenFilters(false);
    }, []);

    const onSwitchMarkers = useCallback((e) => {
        dispatch(mapsActions.switchMarkers(e.target.checked));
    }, []);

    const onSwitchCircles = useCallback((e) => {
        dispatch(mapsActions.switchCircles(e.target.checked));
    }, []);

    const onSwitchPolygon = useCallback((e) => {
        dispatch(mapsActions.switchPolygons(e.target.checked));
    }, []);

    const onSubmit = useCallback(async (values) => {
        const params = FormUtils.encodeFormValues(values);

        dispatch(mapsActions.saveFilters(params));
        dispatch(mapsActions.fetchPosition(params));
    }, []);

    const form = useMemo(() => createForm({ onSubmit }), []);

    return {
        form,
        hasMarkers,
        hasCircles,
        hasPolygons,
        isOpenFilters,
        onOpen,
        onClose,
        onSwitchMarkers,
        onSwitchCircles,
        onSwitchPolygon,
        onSubmit,
    };
}
