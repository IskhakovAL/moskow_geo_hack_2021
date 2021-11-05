import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter } from 'react-router-dom';
import Router from './components/Router/Router';
import AuthUtils from './utils/AuthUtils';
import Header from './components/Header/Header';

function App() {
    const { login } = AuthUtils.getAuthMetadata();

    if (!login) {
        AuthUtils.setAuthMetadata({ login: uuidv4() });
    }

    return (
        <BrowserRouter>
            <Header />
            <Router />
        </BrowserRouter>
    );
}

export default App;
