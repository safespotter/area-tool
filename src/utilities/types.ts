import { Area } from "./area";

export type Point = [number, number];
export type Shape = Point[];
export enum Tool { ADD, SELECT };

export type AreaDictionary = {
    id: number;
    points: {
        lu: Point;
        ru: Point;
        rb: Point;
        lb: Point;
    };
    carWalk: boolean;
    dir: {
        left: boolean;
        up: boolean;
        right: boolean;
        down: boolean;
    };
    parking: boolean;
    stop: string;
    changed?: boolean;
    ref?: Area;
};

export interface IIndexable<T = any> { [key: string]: T; }

export { Area } from "./area";