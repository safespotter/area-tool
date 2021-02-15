import { Point, Shape } from './types';

export class Area {
    private static counter = 0;

    readonly id: number;
    public shape: Shape;
    public isCarWalkable = true;
    public direction: Point | null = null;
    public isParking = false;
    public stop = null;
    public isSelected = false;

    constructor(quad: Shape, direction?: Point) {
        this.id = Area.newId();
        this.shape = quad;
        if (direction) this.direction = direction;
    }

    static newId() {
        return Area.counter++;
    }
}