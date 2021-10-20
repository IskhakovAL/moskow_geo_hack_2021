import React, { useEffect } from 'react';
import * as MapService from './services/MapService';

function App() {
    useEffect(() => {
        MapService.fetchMap()
            .then((response) => {
                console.log(response);
            })
            .catch((err) => console.log(err));
    }, []);
    return <h1>App</h1>;
}

export default App;
