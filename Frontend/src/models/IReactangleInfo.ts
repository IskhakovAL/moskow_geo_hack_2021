import { TPolygon } from './IPositions';
import { IFilterParams } from './IFilterParams';

export interface IRectangleInfo {
    areaOfSportZones: number;
    numberOfSportZones: number;
    typesOfSportServices: number;
    polygonList: TPolygon[];
}

export type RectangleCoord = { rectangleCoord: number[] };
export type RectangleParams = RectangleCoord & IFilterParams;
