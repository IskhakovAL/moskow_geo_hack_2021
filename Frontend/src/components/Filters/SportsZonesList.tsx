import React from 'react';
import AutocompleteVirtualization from '../AutocompleteVirtualization/AutocompleteVirtualization';

const options = [
    { id: 'step', name: 'С шаговой доступностью' },
    { id: 'regional', name: 'С районной доступностью' },
    { id: 'district', name: 'С окружной доступностью' },
    { id: 'city', name: 'Городского значения' },
];

const SportsZonesList = () => {
    return (
        <AutocompleteVirtualization
            name="sportsZonesList"
            label="Перечень спортивных зон"
            options={options}
        />
    );
};

export default SportsZonesList;
