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

    const [x, y] = [p[0], p[1]];
    const [x1, y1] = [l[0][0], l[0][1]];
    const [x2, y2] = [l[1][0], l[1][1]];

    // find m and q of the segment line
    const m = (y1 - y2) / (x1 - x2);
    const q = (x1 * y2 - x2 * y1) / (x1 - x2);

    // find m and q of the projection line
    const mproj = -1 / m;
    const qproj = y - mproj * x;

    // solve the system and find the point that sits on both lines
    const xproj = (qproj - q) / (m - mproj);
    const yproj = m * xproj + q;

    const proj = [xproj, yproj] as Point;

    if (
        proj[0] > l[0][0] && proj[0] > l[1][0] || // too far left
        proj[0] < l[0][0] && proj[0] < l[1][0] || // too far right
        proj[1] > l[0][1] && proj[1] > l[1][1] || // too far up
        proj[1] < l[0][1] && proj[1] < l[1][1]    // too far down
    ) {
        return null;
    }
    return proj;
}