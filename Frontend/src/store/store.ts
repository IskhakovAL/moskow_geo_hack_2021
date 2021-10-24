import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import rootReducer from './rootReducer';

const history = createBrowserHistory({ basename: '/lks' });

const getStore = () => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');

        return createStore(rootReducer(history), composeWithDevTools(applyMiddleware(thunk)));
    }
    return createStore(rootReducer(history), applyMiddleware(thunk));
};

const store = getStore();

export { store, history };
