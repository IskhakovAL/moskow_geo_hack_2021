import { RouterState } from 'connected-react-router';
import { IMapsState } from '../ducks/maps';

export default interface IStore {
    maps: IMapsState;
    router: RouterState;
}
