import { Area } from "./area";

export type Vector = [number, number];
export type Shape = Vector[];
export enum Tool { ADD, SELECT };

export type AreaDictionary = {
    id: number;
    points: {
        lu: Vector;
        ru: Vector;
        rb: Vector;
        lb: Vector;
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