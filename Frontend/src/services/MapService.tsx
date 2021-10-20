import Client from '../client/Client';

export const fetchMap = () => Client.doRequest('map');
export const fetchArray = () => Client.doRequest('test');
