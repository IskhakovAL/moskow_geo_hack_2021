import React, { useContext } from 'react';
import AutocompleteMulti from '../AutocompleteMulti/AutocompleteMulti';
import { DictContext } from '../../context/context';

const SportsZonesTypes = () => {
    const { sportsZonesTypes = [] } = useContext(DictContext);

    return (
        <AutocompleteMulti
            name="sportsZonesTypes"
            label="Типы спортивных зон"
            options={sportsZonesTypes}
        />
    );
};

export default SportsZonesTypes;
