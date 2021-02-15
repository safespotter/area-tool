import { Shape } from './types';

export function order(s: Shape) {
    const X = 0;
    const Y = 1;

    // sort up first
    let ol = s.sort((a, b) => a[Y] < b[Y] ? -1 : 1);

    if (ol[0][X] > ol[1][X]) {
        const tmp = ol[0];
        ol[0] = ol[1];
        ol[1] = tmp;
    }
    if (ol[2][X] < ol[3][X]) {
        const tmp = ol[2];
        ol[2] = ol[3];
        ol[3] = tmp;
    }
    return ol;
}