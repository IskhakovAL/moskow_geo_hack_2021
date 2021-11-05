import Client from '../client/Client';
import { RequestMethod } from '../client/BaseHttpClient';
import { IFilterParams } from '../models/IFilterParams';
import { IPositions } from '../models/IPositions';
import { IDict } from '../models/IDict';
import AuthUtils from '../utils/AuthUtils';
import { IPointInfo, PointParams } from '../models/IPointInfo';

export const fetchPositions = (params: IFilterParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest<IPositions>(`locations/${login}`, {
        method: RequestMethod.POST,
        data: params,
    });
};

export const fetchPointInfo = (data: PointParams) => {
    const { login } = AuthUtils.getAuthMetadata();

    return Client.doRequest<IPointInfo>(`pointInfo/${login}`, {
        method: RequestMethod.POST,
        data,
    });
};
export const fetchDict = () => Client.doRequest<IDict>('catalog');
