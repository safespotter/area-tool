import { Vector, Shape } from './types';

export function findPointInShapeIndex(target: Vector, shapes: Shape[]) {
    for (let i = 0; i < shapes.length; i++) {
        if (isPointInShape(target, shapes[i])) return i;
    }
    return -1;
}

export function isPointInShape(p: Vector, s: Shape) {
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

export function distancePointToPoint(a: Vector, b: Vector) {
    // Pitagora
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function badProjectPointToSegment(p: Vector, l: [Vector, Vector]) {
    // WHY DID I EVEN BOTHER WITH ALL OF THIS MATH
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

    const proj = [xproj, yproj] as Vector;

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

export function projectPointToSegment(p: Vector, l: [Vector, Vector]): Vector | null {
    // WHY DO I ONLY THINK OF VECTORS IN MY FREE TIME AND NOT WHEN I'M ON THE CLOCK??????
    const lineVec = vecSub(l[1], l[0]);
    const lineLen = distancePointToPoint(l[0], l[1]);
    const lineVecNormalized = vecScale(lineVec, 1 / lineLen);
    const pointProjLen = dot(vecSub(p, l[0]), lineVecNormalized);
    if (pointProjLen < 0 || pointProjLen > lineLen) return null; // proj outside the segment
    const pointProj = vecSum(l[0], vecScale(lineVecNormalized, pointProjLen));
    return pointProj;
}

export function dot(vec1: Vector, vec2: Vector) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

export function vecSum(v1: Vector, v2: Vector): Vector {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

export function vecNegative(v: Vector): Vector {
    return [-v[0], -v[1]];
}

export function vecSub(v1: Vector, v2: Vector): Vector {
    return vecSum(v1, vecNegative(v2));
}

export function vecScale(v: Vector, n: number): Vector {
    return [v[0] * n, v[1] * n];
}

export function vecLen(v: Vector): number {
    return distancePointToPoint([0, 0], v);
}

export function vecFromCoordinateSystem(v: Vector, up: Vector, right: Vector): Vector {
    return vecSum(vecScale(right, v[0]), vecScale(up, v[1]));
}

export function vecRotate(v: Vector, upRotated: Vector): Vector {
    const up = vecScale(upRotated, 1 / vecLen(upRotated));
    const right = [up[1], -up[0]] as Vector;
    return vecFromCoordinateSystem(v, up, right);
}

export function centroidOfShape(shape: Shape) {
    const sum = shape.reduce((res, v) => vecSum(v, res));
    return vecScale(sum, 1 / shape.length);
}

export function dirShapeToShape(s1: Shape, s2: Shape) {
    const center1 = centroidOfShape(s1);
    const center2 = centroidOfShape(s2);
    const lineC1toC2 = vecSub(center2, center1);
    const distance = distancePointToPoint([0, 0], lineC1toC2);
    return vecScale(lineC1toC2, 1 / distance);
}