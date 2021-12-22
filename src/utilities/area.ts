import { order } from "./data";
import { AreaDictionary, Vector, Shape } from "./types";

export class Area {
  private static counter = 0;

  readonly id: number;
  public shape: Shape;
  public isCarWalkable = true;
  public direction = {
    left: false,
    up: false,
    right: false,
    down: false,
  };
  public isParking = false;
  public stop: string | null = null;
  public isSelected = false;

  constructor(quad?: Shape) {
    this.id = Area.newId();
    this.shape = quad ?? [
      [-1, -1],
      [-1, -1],
      [-1, -1],
      [-1, -1],
    ];
  }

  static newId() {
    return Area.counter++;
  }

  order(): void {
    const order_changed = order(this.shape);
    if (order_changed) {
      let tmp = this.direction.left;
      this.direction.left = this.direction.up;
      this.direction.up = tmp;

      tmp = this.direction.right;
      this.direction.right = this.direction.down;
      this.direction.down = tmp;
    }
  }

  toAreaDictionary(): AreaDictionary {
    this.order();
    const dir = this.direction ?? [0, 0];
    return {
      id: this.id,
      points: {
        lu: this.shape[0].map((x) => Math.round(x)) as Vector,
        ru: this.shape[1].map((x) => Math.round(x)) as Vector,
        rb: this.shape[2].map((x) => Math.round(x)) as Vector,
        lb: this.shape[3].map((x) => Math.round(x)) as Vector,
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
