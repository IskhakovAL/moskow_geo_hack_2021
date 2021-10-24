import Client from '../client/Client';
import { RequestMethod } from '../client/BaseHttpClient';
import { IFilterParams } from '../models/IFilterParams';
import { ICircles, IMarkers, IPolygon } from '../models/IPositions';
import { IDict } from '../models/IDict';

export const fetchMarkers = (params: IFilterParams) =>
    Client.doRequest<IMarkers>('locations', { method: RequestMethod.POST, data: params });
export const fetchDict = () => Client.doRequest<IDict>('catalog');
export const fetchPolygons = () => Client.doRequest<IPolygon>('population');
export const fetchCircles = (params) =>
    Client.doRequest<ICircles>('circles', { method: RequestMethod.POST, data: params });
