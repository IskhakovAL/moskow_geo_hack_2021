import React, { useContext } from 'react';
import AutocompleteMulti from '../AutocompleteMulti/AutocompleteMulti';
import { DictContext } from '../../context/context';

const DepartmentalAffiliation = () => {
    const { departmentalAffiliation = [] } = useContext(DictContext);

    return (
        <AutocompleteMulti
            name="departmentalAffiliation"
            options={departmentalAffiliation}
            label="Ведомственная принадлежность"
        />
    );
};

export default DepartmentalAffiliation;
