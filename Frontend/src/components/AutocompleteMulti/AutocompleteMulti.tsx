import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Autocomplete } from 'mui-rff';

export default function AutocompleteMulti({ options, label, name }) {
    return (
        <Stack spacing={3}>
            <Autocomplete
                multiple
                name={name}
                style={{ margin: 24 }}
                id="tags-standard"
                options={options}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField {...params} variant="standard" label={label} placeholder="" />
                )}
            />
        </Stack>
    );
}
