import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Point, Shape } from './types';

export function findShape(target: Point, shapes: Shape[]) {
    for (const shape of shapes) {
        if (pointInShape(target, shape)) return shape;
    }
    return null;
}

export function pointInShape(p: Point, s: Shape) {
    let res = false;
    const X = 0;
    const Y = 1;
    for (let i = 0; i < s.length; i++) {
        // https://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
        const edge = [s[i], s[(i + 1) % s.length]];
        if (
            ( // is the point in the Y range of the edge?
                edge[0][Y] <= p[Y] && edge[1][Y] >= p[Y] ||
                edge[1][Y] <= p[Y] && edge[0][Y] >= p[Y]
            )
            &&
            (
                p[X] < (edge[0][X] - edge[1][X]) * (p[Y] - edge[1][Y]) / (edge[0][Y] - edge[1][Y]) + edge[1][X]
            )
        ) {
            res = !res;
        }
    }
    return res;
}