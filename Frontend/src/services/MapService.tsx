import Client from '../client/Client';
import { RequestMethod } from '../client/BaseHttpClient';
import { IFilterParams } from '../models/IFilterParams';
import { IPositions } from '../models/IPositions';
import { IDict } from '../models/IDict';

export const fetchPositions = (params: IFilterParams) =>
    Client.doRequest<IPositions>('locations', { method: RequestMethod.POST, data: params });
export const fetchDict = () => Client.doRequest<IDict>('catalog');
