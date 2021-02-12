import { Point, Shape } from './types';

export function findPointIndexInShape(target: Point, shapes: Shape[]) {
    for (let i = 0; i < shapes.length; i++) {
        if (isPointInShape(target, shapes[i])) return i;
    }
    return -1;
}

export function isPointInShape(p: Point, s: Shape) {
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

export function distancePointToPoint(a: Point, b: Point) {
    // Pitagora
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function projectPointToSegment(p: Point, l: [Point, Point]) {
    // http://www.sunshine2k.de/coding/java/PointOnLine/PointOnLine.html#step5
    const X = 0;
    const Y = 1;
    // get dot product of e1, e2
    const e1 = [l[1][X] - l[0][X], l[1][Y] - l[0][Y]] as Point;
    const e2 = [p[X] - l[0][X], p[Y] - l[0][Y]] as Point;
    const valDp = dotProduct(e1, e2);
    // get squared length of e1
    const len2 = e1[X] * e1[X] + e1[Y] * e1[Y];
    const proj: Point = [(l[0][X] + (valDp * e1[X]) / len2), (l[0][Y] + (valDp * e1[Y]) / len2)];
    if (
        proj[0] > l[0][0] && proj[0] > l[1][0] || // too far left
        proj[0] < l[0][0] && proj[0] < l[1][0] || // too far right
        proj[1] > l[0][1] && proj[1] > l[1][1] || // too far up
        proj[1] < l[0][1] && proj[1] < l[1][1]    // too far down
    ) {
        return null;
    } else {
        return proj;
    }
}

function dotProduct(vec1: Point, vec2: Point) {
    // http://www.sunshine2k.de/coding/java/PointOnLine/PointOnLine.html#step4
    return vec1[0] * vec2[0] + vec1[1] * vec2[0];
}