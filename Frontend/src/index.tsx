import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { store, history } from './store/store';
import App from './App';

import './index.scss';

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root'),
);
