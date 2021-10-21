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

export const fetchMap = (params) =>
    Client.doRequest('map', { method: RequestMethod.POST, data: params });
export const fetchDict = () => Client.doRequest<IDict>('catalog');
