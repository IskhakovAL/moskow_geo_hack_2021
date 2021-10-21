import React, { useContext } from 'react';
import AutocompleteVirtualization from '../AutocompleteVirtualization/AutocompleteVirtualization';
import { DictContext } from '../../context/context';

const SportsFacility = () => {
    const { sportsFacility = [] } = useContext(DictContext);

    return (
        <AutocompleteVirtualization
            name="sportsFacility"
            label="Наименование спортивного объекта"
            options={sportsFacility}
        />
    );
};

export default SportsFacility;
