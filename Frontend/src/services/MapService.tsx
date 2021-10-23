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

export interface IPolygon {
    polygonList: { polygon: [number, number], opacity: number }[];
    multiPolygonList: { multiPolygon: [number, number], opacity: number }[];
}

export type TCircle = { area: number; circle_opacity: number; position: [number, number]; radius: number };

export interface ICircles {
    circles: TCircle[];
}

export interface IFilterParams {
    sportsFacility: number[];
    departmentalAffiliation: number[];
    sportsZonesList: number[];
    sportsZonesTypes: number[];
    sportsServices: number[];
    availability: number[];
}

export const fetchMarkers = (params: IFilterParams) =>
    Client.doRequest<IMarkers>('locations', { method: RequestMethod.POST, data: params });
export const fetchDict = () => Client.doRequest<IDict>('catalog');
export const fetchPolygons = () => Client.doRequest<IPolygon>('population');
export const fetchCircles = (params) => Client.doRequest<ICircles>('circles', { method: RequestMethod.POST, data: params });
