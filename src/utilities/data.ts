import { Shape, Vector } from "./types";
import { dot, vecSum, vecScale, vecSub } from "./shapes";

export function order(s: Shape) {
  const X = 0;
  const Y = 1;

  let lu = [...s]
    .sort((a, b) => (a[Y] < b[Y] ? -1 : 1))
    .slice(0, 2)
    .sort((a, b) => (a[X] < b[X] ? -1 : 1))[0];
  let i_lu = s.findIndex((p) => p === lu);

  const ordered: Shape = [];
  const firstP = s[i_lu];
  const nextP = s[(i_lu + 1) % s.length];
  const prevP = s[(i_lu + s.length - 1) % s.length];

  const center = vecScale(vecSum(vecSum(firstP, nextP), prevP), 1 / 3);

  // y axis is inverted in images, so this formula is inverted too
  const clockwisePerpendicular: Vector = [
    -(firstP[Y] - center[Y]),
    firstP[X] - center[X],
  ];

  if (
    dot(vecSub(nextP, center), clockwisePerpendicular) >
    dot(vecSub(prevP, center), clockwisePerpendicular)
  ) {
    for (let i = 0; i < s.length; i++) {
      const p = s[(i_lu + i) % s.length];
      ordered.push([...p]);
    }
  } else {
    for (let i = 0; i < s.length; i++) {
      const p = s[(i_lu + s.length - i) % s.length];
      ordered.push([...p]);
    }
  }

  return ordered;
}
