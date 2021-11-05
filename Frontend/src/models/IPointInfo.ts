import { LatLngExpression } from 'leaflet';
import { Coordinate } from './IPositions';
import { IFilterParams } from './IFilterParams';

export interface IPointInfo {
    polygonList: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
    totalAreaOfSportsZones: number;
    typesOfSportsServices: string[];
    typesOfSportsZones: string[];
}
export type PointCoord = { pointCoord: Coordinate };
export type PointParams = PointCoord & IFilterParams;
