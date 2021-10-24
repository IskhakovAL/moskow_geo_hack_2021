import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'react-final-form';
import { DictContext } from '../../context/context';

export default function Availability() {
    const { availability = [] } = useContext(DictContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Доступность</FormLabel>
                <FormGroup>
                    {availability.map((opt) => (
                        <FormControlLabel
                            key={String(opt.id)}
                            control={
                                <Field name={`availability.${String(opt.id)}`} type="checkbox">
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
