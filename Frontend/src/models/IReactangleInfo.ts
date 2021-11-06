import { TPolygon } from './IPositions';
import { IFilterParams } from './IFilterParams';

export interface IRectangleInfo {
    averageAreaOfSportsZones: number;
    count: number;
    typesOfSportsZones: string[];
    typesOfSportsServices: string[];
    polygonList: TPolygon[];
}

export type RectangleCoord = { rectangleCoord: number[] };
export type RectangleParams = RectangleCoord & IFilterParams;
