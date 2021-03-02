import { order } from './data';
import { dot, vecSum } from './shapes';
import { AreaDictionary, IIndexable, Vector, Shape } from './types';

export class Area {
    private static counter = 0;

    readonly id: number;
    public shape: Shape;
    public isCarWalkable = true;
    public direction = {
        left: true,
        up: true,
        right: true,
        down: true,
    };
    public isParking = false;
    public stop: string | null = null;
    public isSelected = false;

    constructor(quad?: Shape) {
        this.id = Area.newId();
        this.shape = quad ?? [[-1, -1], [-1, -1], [-1, -1], [-1, -1]];
    }

    static newId() {
        return Area.counter++;
    }

    toAreaDictionary(): AreaDictionary {
        const points = order(this.shape);
        const dir = this.direction ?? [0, 0];
        return {
            id: this.id,
            points: {
                lu: points[0].map(x => Math.round(x)) as Vector,
                ru: points[1].map(x => Math.round(x)) as Vector,
                rb: points[2].map(x => Math.round(x)) as Vector,
                lb: points[3].map(x => Math.round(x)) as Vector,
            },
            carWalk: this.isCarWalkable,
            dir: { ...this.direction },
            parking: this.isParking,
            stop: `${this.stop ?? "None"}`,
            ref: this,
        };
    }

    fromAreaDictionary(ad: AreaDictionary) {
        this.shape = Object.values(ad.points);
        this.isCarWalkable = ad.carWalk;
        const dirs = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, 1],
            down: [0, -1],
        };
        this.direction = { ...ad.dir };

        this.isParking = ad.parking;
        this.stop = ad.stop;
        ad.ref = this;
        return this;
    }
}