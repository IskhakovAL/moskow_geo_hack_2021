import React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'react-final-form';

const options = [
    { id: 'step', name: 'С шаговой доступностью' },
    { id: 'regional', name: 'С районной доступностью' },
    { id: 'district', name: 'С окружной доступностью' },
    { id: 'city', name: 'Городского значения' },
];

export default function Availability() {
    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Доступность</FormLabel>
                <FormGroup>
                    {options.map((opt) => (
                        <FormControlLabel
                            key={opt.id}
                            control={
                                <Field name={opt.id} type="checkbox">
                                    {(props) => (
                                        <>
                                            <Checkbox
                                                name={props.input.name}
                                                onChange={props.input.onChange}
                                                checked={props.input.checked}
                                                value={props.input.value}
                                            />
                                        </>
                                    )}
                                </Field>
                            }
                            label={opt.name}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Box>
    );
}
