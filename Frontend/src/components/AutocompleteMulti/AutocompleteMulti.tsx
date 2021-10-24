import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Autocomplete } from 'mui-rff';
import { DictItem } from '../../models/IDict';

interface IProps {
    label: string;
    name: string;
    options: DictItem[];
}
export default function AutocompleteMulti({ options, label, name }: IProps) {
    return (
        <Stack spacing={3}>
            <Autocomplete
                multiple
                name={name}
                style={{ margin: 24 }}
                id="tags-standard"
                options={options}
                getOptionLabel={(option: DictItem) => option.name}
                // @ts-ignore
                renderInput={(params) => (
                    <TextField {...params} variant="standard" label={label} placeholder="" />
                )}
            />
        </Stack>
    );
}
