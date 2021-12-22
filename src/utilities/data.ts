import { Shape, Vector } from "./types";
import { dot, vecSum, vecScale, vecSub } from "./shapes";

export function order(s: Shape) {
  const X = 0;
  const Y = 1;

  const firstP = s[0];
  const rightP = s[1];
  const leftP = s[3];

  const opposite = s[2];

  // y axis is inverted in images, so this formula is inverted too
  const rightDir: Vector = [
    -(firstP[Y] - opposite[Y]),
    firstP[X] - opposite[X],
  ];

  if (
    dot(vecSub(rightP, opposite), rightDir) <
    dot(vecSub(leftP, opposite), rightDir)
  ) {
    const tmp = s[1];
    s[1] = s[3];
    s[3] = tmp;
    return true;
  }

  return false;
}
