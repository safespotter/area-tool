import React, { useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { order } from '../utilities/data';
import { dot } from '../utilities/shapes';
import { Area, Point } from '../utilities/types';

import './IOManager.css';

const fields = [
    "luX",
    "luY",
    "ruX",
    "ruY",
    "rbX",
    "rbY",
    "lbX",
    "lbY",
    "CarWalk",
    "Left",
    "Up",
    "Right",
    "Down",
    "Parking",
    "Stop",
];

type IOMangerProps = {
    target: Area[];
    source?: string;
};

export function IOManager({ target, source }: IOMangerProps) {
    const dlRef = useRef<HTMLAnchorElement>(null);

    const filename = source ? source.replace(".mp4", "_areas.csv") : "areas.csv";

    const download = () => {
        const outStr = formatData(target);
        const blob = new Blob([outStr], { type: 'text/csv;charset=utf-8;' });
        const dlUrl = URL.createObjectURL(blob);
        dlRef.current?.setAttribute("href", dlUrl);
        dlRef.current?.click();
        URL.revokeObjectURL(dlUrl);
    };

    const formatData = (target: Area[]) => {
        const formatted = target.map(formatArea);
        return [fields.join(',')].concat(formatted).join('\n');
    };

    const formatArea = (area: Area) => {
        const points = order(area.shape)
            .map(p => [
                Math.round(p[0]),
                Math.round(p[1])
            ].join(','))
            .join(',');

        const carWalk = area.isCarWalkable ? "1" : "0";

        const dir: Point = area.direction ? area.direction : [0, 0];
        const direction = [
            dot(dir, [-1, 0]) > .25 ? "1" : "0",
            dot(dir, [0, -1]) > .25 ? "1" : "0",
            dot(dir, [1, 0]) > .25 ? "1" : "0",
            dot(dir, [0, 1]) > .25 ? "1" : "0",
        ].join(',');

        const parking = area.isCarWalkable ? "1" : "0";
        const stop = area.stop ? "" + area.stop : "None";

        return [points, carWalk, direction, parking, stop].join(',');
    };

    return (
        <div className="IOManager">
            <Button variant="contained" color="primary"
                onClick={download}
            >
                Download
            </Button>
            <a
                ref={dlRef}
                download={filename}
                hidden
            />
        </div>
    );
}