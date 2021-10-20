import React, { useState } from 'react';
import AutocompleteVirtualization from '../AutocompleteVirtualization/AutocompleteVirtualization';

const options = [
    { id: 'step', name: 'С шаговой доступностью' },
    { id: 'regional', name: 'С районной доступностью' },
    { id: 'district', name: 'С окружной доступностью' },
    { id: 'city', name: 'Городского значения' },
];

const SportsZonesList = () => {
    const [value, setValue] = useState([]);

    return (
        <AutocompleteVirtualization
            label="Перечень спортивных зон"
            options={options}
            value={value}
            setValue={setValue}
        />
    );
};

export default SportsZonesList;
