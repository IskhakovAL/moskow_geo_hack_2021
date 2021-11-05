import { Coordinate } from './IPositions';
import { IFilterParams } from './IFilterParams';

export interface IPointInfo {
    polygonList: Coordinate[];
    totalAreaOfSportsZones: number;
    typesOfSportsServices: string[];
    typesOfSportsZones: string[];
}

export type PointParams = { pointCoord: Coordinate } & IFilterParams;
