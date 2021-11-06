import { LatLngExpression } from 'leaflet';

export interface Coordinate {
    0: number;
    1: number;
}

export type MarkerType = {
    area: number;
    position: Coordinate;
    popup: {
        availabilityName: string;
        objectName: string;
        organizationName: string;
        sportType: string;
        zonesName: string;
        zonesType: string;
    };
    fillOpacity: number;
    radius: number;
};

export interface IPositions {
    markers: MarkerType[];
}

export type TPolygon = {
    polygon: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][];
    fillOpacity: number;
    popup: {
        municipality: string;
        people: number;
    };
};

export interface IPolygonList {
    polygonList: TPolygon[];
}

export type TCircle = {
    area: number;
    fillOpacity: number;
    position: Coordinate;
    radius: number;
};
