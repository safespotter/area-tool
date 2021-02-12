import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Point, Shape } from './types';

export function findShapeIndex(target: Point, shapes: Shape[]) {
    for (let i = 0; i < shapes.length; i++) {
        if (pointInShape(target, shapes[i])) return i;
    }
    return -1;
}

export function pointInShape(p: Point, s: Shape) {
    let res = false;
    const X = 0;
    const Y = 1;
    for (let i = 0; i < s.length; i++) {
        // https://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
        const edge = [s[i], s[(i + 1) % s.length]];
        if (
            (   // is the point in the Y range of the edge?
                edge[0][Y] <= p[Y] && edge[1][Y] >= p[Y] ||
                edge[1][Y] <= p[Y] && edge[0][Y] >= p[Y]
            )
            &&
            (   // is our point to the left the line that our edge sits on at Y = point[Y]?
                p[X] < (edge[0][X] - edge[1][X]) * (p[Y] - edge[1][Y]) / (edge[0][Y] - edge[1][Y]) + edge[1][X]
            )
        ) {
            res = !res;
        }
    }
    return res;
}