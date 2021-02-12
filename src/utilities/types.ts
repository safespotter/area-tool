import { ADDRCONFIG } from "dns";

export type Point = [number, number];
export type Shape = Point[];
export enum Tool { ADD, SELECT };
export type CSVArea = {
    lu: {
        x: number;
        y: number;
    };
    ru: {
        x: number;
        y: number;
    };
    rb: {
        x: number;
        y: number;
    };
    lb: {
        x: number;
        y: number;
    };
    carWalk: boolean;
    direction: {
        left: boolean;
        up: boolean;
        right: boolean;
        down: boolean;
    };
    parking: boolean;
    stop: null;
};