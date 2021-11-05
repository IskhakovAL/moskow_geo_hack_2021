import Client from '../client/Client';
import { RequestMethod, ResponseType } from '../client/BaseHttpClient';
import { IFilterParams } from '../models/IFilterParams';
import { IPositions, TPolygon } from '../models/IPositions';
import { IDict } from '../models/IDict';
import AuthUtils from '../utils/AuthUtils';
import { IPointInfo, PointParams } from '../models/IPointInfo';
import { IPlots } from '../models/IPlots';

export const fetchPositions = (params: IFilterParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest<IPositions>(`locations/${login}`, {
        method: RequestMethod.POST,
        data: params,
    });
};

export const fetchEmptyZones = (params: IFilterParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest<{ polygonList: TPolygon[] }>(`emptyZones/${login}`, {
        method: RequestMethod.POST,
        data: params,
    });
};

export const fetchEmptyZonesFile = (params: IFilterParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest(`emptyZonesFile/${login}`, {
        method: RequestMethod.POST,
        data: params,
        responseType: ResponseType.BLOB,
    });
};

export const fetchPointInfo = (data: PointParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest<IPointInfo>(`pointInfo/${login}`, {
        method: RequestMethod.POST,
        data,
    });
};

export const fetchPointInfoFile = (data: PointParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest(`pointInfoFile/${login}`, {
        method: RequestMethod.POST,
        data,
        responseType: ResponseType.BLOB,
    });
};

export const fetchPlots = () => {
    return Client.doRequest<IPlots>('plots');
};

export const fetchDict = () => Client.doRequest<IDict>('catalog');
