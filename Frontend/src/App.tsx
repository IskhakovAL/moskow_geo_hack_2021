import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter } from 'react-router-dom';
import Router from './components/Router/Router';
import AuthUtils from './utils/AuthUtils';

function App() {
    const { login } = AuthUtils.getAuthMetadata();

    if (!login) {
        AuthUtils.setAuthMetadata({ login: uuidv4() });
    }

    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
}

export default App;
