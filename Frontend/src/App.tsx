import React, { useEffect } from 'react';
import * as MapService from './services/MapService';
import Availability from './components/Availability/Availability';

function App() {
    useEffect(() => {
        MapService.fetchMap()
            .then((response) => {
                console.log(response);
            })
            .catch((err) => console.log(err));
    }, []);
    return <Availability />;
}

export default App;
