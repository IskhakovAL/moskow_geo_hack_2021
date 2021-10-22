import Client from '../client/Client';
import { RequestMethod } from '../client/BaseHttpClient';

type DictItem = {
    id: number;
    name: string;
};

export interface IDict {
    sportsFacility: DictItem[];
    departmentalAffiliation: DictItem[];
    sportsZonesList: DictItem[];
    sportsZonesTypes: DictItem[];
    sportsServices: DictItem[];
    availability: DictItem[];
}

export type MarkerType = { position: [number, number], popup: string};

export interface IMarkers {
    markers: MarkerType[];
}

export const fetchMarkers = (params) =>
    Client.doRequest<IMarkers>('locations', { method: RequestMethod.POST, data: params });
export const fetchDict = () => Client.doRequest<IDict>('catalog');
