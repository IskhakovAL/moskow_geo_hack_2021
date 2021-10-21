import * as React from 'react';
import { useContext } from 'react';
import AutocompleteMulti from '../AutocompleteMulti/AutocompleteMulti';
import { DictContext } from '../../context/context';

export default function SportsServices() {
    const { sportsServices = [] } = useContext(DictContext);

    return (
        <AutocompleteMulti
            name="sportsServices"
            options={sportsServices}
            label="Виды спортивных услуг"
        />
    );
}
