import React, { useContext } from 'react';
import AutocompleteVirtualization from '../AutocompleteVirtualization/AutocompleteVirtualization';
import { DictContext } from '../../context/context';

const SportsZonesList = () => {
    const { sportsZonesList = [] } = useContext(DictContext);

    return (
        <AutocompleteVirtualization
            name="sportsZonesList"
            label="Перечень спортивных зон"
            options={sportsZonesList}
        />
    );
};

export default SportsZonesList;
