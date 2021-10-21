import React from 'react';
import AutocompleteMulti from '../AutocompleteMulti/AutocompleteMulti';

const options = [
    { id: 'step', name: 'С шаговой доступностью' },
    { id: 'regional', name: 'С районной доступностью' },
    { id: 'district', name: 'С окружной доступностью' },
    { id: 'city', name: 'Городского значения' },
];

const SportsZonesList = () => {
    return (
        <AutocompleteMulti name="sportsZonesList" label="Типы спортивных зон " options={options} />
    );
};

export default SportsZonesList;
