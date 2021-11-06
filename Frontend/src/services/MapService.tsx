import Client from '../client/Client';
import { RequestMethod, ResponseType } from '../client/BaseHttpClient';
import { IFilterParams } from '../models/IFilterParams';
import { IPolygonList, IPositions } from '../models/IPositions';
import { IDict } from '../models/IDict';
import { IPointInfo, PointParams } from '../models/IPointInfo';
import { IPlots } from '../models/IPlots';
import { IRectangleInfo, RectangleParams } from '../models/IReactangleInfo';
import { TEmptyZones } from '../models/IEmptyZones';

export const fetchPositions = (params: IFilterParams) => {
    return Client.doRequest<IPositions>('locations', {
        method: RequestMethod.POST,
        data: params,
    });
};

export const fetchMunicipalityInfo = () => {
    return Client.doRequest<IPolygonList>('municipalityInfo');
};

export const fetchEmptyZones = (params: IFilterParams) => {
    return Client.doRequest<TEmptyZones>('emptyZones', {
        method: RequestMethod.POST,
        data: params,
    });
};

export const fetchEmptyZonesFile = (params: IFilterParams) => {
    return Client.doRequest('emptyZonesFile', {
        method: RequestMethod.POST,
        data: params,
        responseType: ResponseType.BLOB,
    });
};

export const fetchPointInfo = (data: PointParams) => {
    return Client.doRequest<IPointInfo>('pointInfo', {
        method: RequestMethod.POST,
        data,
    });
};

export const fetchPointInfoFile = (data: PointParams) => {
    return Client.doRequest('pointInfoFile', {
        method: RequestMethod.POST,
        data,
        responseType: ResponseType.BLOB,
    });
};

export const fetchRectangleInfo = (data: PointParams) => {
    return Client.doRequest<IRectangleInfo>('rectangleInfo', {
        method: RequestMethod.POST,
        data,
    });
};

export const fetchRectangleFile = (data: RectangleParams) => {
    return Client.doRequest('rectangleInfoFile', {
        method: RequestMethod.POST,
        data,
        responseType: ResponseType.BLOB,
    });
};

export const fetchPlots = () => {
    return Client.doRequest<IPlots>('plots');
};

export const fetchDict = () => Client.doRequest<IDict>('catalog');
