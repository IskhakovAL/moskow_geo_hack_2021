import React from 'react';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function AutocompleteMulti({ options, value, setValue, label }) {
    return (
        <Stack spacing={3} sx={{ width: 500 }}>
            <Autocomplete
                multiple
                style={{ margin: 24 }}
                value={value}
                onChange={(event, newValue) => {
                    console.log(newValue);
                    setValue(newValue);
                }}
                id="tags-standard"
                options={options}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label={label}
                        placeholder=""
                    />
                )}
            />
        </Stack>
    );
}
