import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';

const options = [
    { id: 'step', name: 'С шаговой доступностью' },
    { id: 'regional', name: 'С районной доступностью' },
    { id: 'district', name: 'С окружной доступностью' },
    { id: 'city', name: 'Городского значения' },
];

const initialState = options.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
}, {});

export default function Availability() {
    const [state, setState] = React.useState(initialState);

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    // const handleSubmit = () => {
    //     const values = Object.keys(state).filter((key) => {
    //         return state[key];
    //     });
    //
    //     console.log(values);
    // };

    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Доступность</FormLabel>
                <FormGroup>
                    {options.map((opt) => (
                        <FormControlLabel
                            key={opt.id}
                            control={
                                <Checkbox
                                    checked={state[opt.id]}
                                    onChange={handleChange}
                                    name={opt.id}
                                />
                            }
                            label={opt.name}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Box>
    );
}
