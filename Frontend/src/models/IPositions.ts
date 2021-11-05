export interface Coordinate {
    0: number;
    1: number;
}

export type MarkerType = { position: Coordinate; popup: string };

export interface IPositions {
    markers: MarkerType[];
    circles: TCircle[];
    polygonList: TPolygon[];
}

export type TPolygon = { polygon: Coordinate; fillOpacity: number };

export type TCircle = {
    area: number;
    fillOpacity: number;
    position: Coordinate;
    radius: number;
};
