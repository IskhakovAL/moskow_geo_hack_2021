import { useCallback, useState } from 'react';

export default function useFiltersModal() {
    const [isOpenFilters, setIsOpenFilters] = useState(true);

    const handleOpen = useCallback(() => {
        setIsOpenFilters(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpenFilters(false);
    }, []);

    return {
        isOpenFilters,
        onOpen: handleOpen,
        onClose: handleClose,
    };
}
