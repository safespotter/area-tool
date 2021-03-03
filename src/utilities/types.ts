import { Area } from "./area";

export type Vector = [number, number];
export type Shape = Vector[];
export enum Tool { ADD, SELECT, SET_DIRECTIONS, TOGGLE_TYPE };

export type DirKeys = "left" | "right" | "up" | "down";

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

export type Options = {
    ids: boolean;
    arrows: boolean;
};

export { Area } from "./area";