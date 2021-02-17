import { Shape } from './types';

export function order(s: Shape) {
    const X = 0;
    const Y = 1;

    let lu = [...s].sort((a, b) => a[Y] < b[Y] ? -1 : 1).slice(0, 2).sort((a, b) => a[X] < b[X] ? -1 : 1)[0];
    let i_lu = s.findIndex(p => p === lu);

    const ordered = [];
    for (let i = 0; i < s.length; i++) {
        ordered.push(s[(i_lu + i) % s.length]);
    }

    return ordered;
}