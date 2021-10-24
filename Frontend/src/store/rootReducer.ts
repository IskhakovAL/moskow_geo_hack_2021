import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import mapsReducer from '../ducks/maps';

export default function rootReducer(history) {
    const appReducer = combineReducers({
        maps: mapsReducer,
        router: connectRouter(history),
    });

    return (state, action) => {
        return appReducer(state, action);
    };
}
