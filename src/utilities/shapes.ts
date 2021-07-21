import { Vector, Shape } from "./types";

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
      // is the point in the Y range of the edge?
      ((edge[0][Y] <= p[Y] && edge[1][Y] >= p[Y]) ||
        (edge[1][Y] <= p[Y] && edge[0][Y] >= p[Y])) && // is our point to the left the line that our edge sits on at Y = point[Y]?
      p[X] <
        ((edge[0][X] - edge[1][X]) * (p[Y] - edge[1][Y])) /
          (edge[0][Y] - edge[1][Y]) +
          edge[1][X]
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

export function projectPointToSegment(
  p: Vector,
  l: [Vector, Vector]
): Vector | null {
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

export function vecFromCoordinateSystem(
  v: Vector,
  up: Vector,
  right: Vector
): Vector {
  return vecSum(vecScale(right, v[0]), vecScale(up, v[1]));
}

export function vecToCoordinateSystem(
  v: Vector,
  up: Vector,
  right: Vector
): Vector {
  /* 
        x1 = rx * x + ux * y 
        y1 = ry * x + uy * y

        x = (x1 - ux * y) / rx = (y1 - uy * y) / ry => 
        x1 * ry - ux * ry * y = y1 * rx - uy * rx * y =>
        y = (x1 * ry - y1 * rx) / (ux * ry - uy * rx)
     */
  const y =
    (v[0] * right[1] - v[1] * right[0]) / (up[0] * right[1] - up[1] * right[0]);
  const x = (v[0] - up[0] * y) / right[0];
  return [x, y];
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
