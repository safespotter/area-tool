import { Shape, CSVArea } from './types';

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

export function convertToCSV(s: Shape): CSVArea {
    const ol = order(s);
    return ({
        lu: {
            x: Math.round(ol[0][0]),
            y: Math.round(ol[0][1]),
        },
        ru: {
            x: Math.round(ol[1][0]),
            y: Math.round(ol[1][1]),
        },
        rb: {
            x: Math.round(ol[2][0]),
            y: Math.round(ol[2][1]),
        },
        lb: {
            x: Math.round(ol[3][0]),
            y: Math.round(ol[3][1]),
        },
        carWalk: true,

        direction: {
            left: false,
            up: false,
            right: false,
            down: false,
        },

        parking: false,

        stop: null,
    });
}