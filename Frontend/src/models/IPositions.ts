interface Coordinate {
    0: number;
    1: number;
}

export type MarkerType = { position: Coordinate; popup: string };

export interface IMarkers {
    markers: MarkerType[];
}

export interface IPolygon {
    polygonList: { polygon: Coordinate; opacity: number }[];
    multiPolygonList: { multiPolygon: Coordinate; opacity: number }[];
}

export type TCircle = {
    area: number;
    circle_opacity: number;
    position: Coordinate;
    radius: number;
};

export interface ICircles {
    circles: TCircle[];
}
