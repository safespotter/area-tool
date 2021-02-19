import React, { useRef } from 'react';
import { Button } from '@material-ui/core';
import { Area, AreaDictionary, Vector } from '../utilities/types';

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
    load: (arr: Area[]) => void;
};

export function IOManager({ target, source, load }: IOMangerProps) {
    const dlRef = useRef<HTMLAnchorElement>(null);
    const loadRef = useRef<HTMLInputElement>(null);

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
        const ad = area.toAreaDictionary();

        const points = [ad.points.lu, ad.points.ru, ad.points.rb, ad.points.lb].map(p => p.join(',')).join(',');
        const carWalk = ad.carWalk ? 1 : 0;
        const parking = ad.parking ? 1 : 0;
        const stop = ad.stop;
        const direction = [ad.dir.left, ad.dir.up, ad.dir.right, ad.dir.down].map(f => f ? 1 : 0).join(',');

        return [points, carWalk, direction, parking, stop].join(',');
    };

    const loader = async (f: File | null) => {
        if (!f) {
            console.error("Unable to load file!");
            return;
        }
        const csv = await f.text();
        const rows = csv.split('\n').filter(s => s !== "");
        const strings = rows.slice(1).map(r => r.split(','));
        const dictionaries = strings.map(r => {
            let ad: any = { points: {}, dir: {} };
            const vals: number[] = r.map(v => +v);
            ad.points.lu = vals.slice(0, 2) as Vector;
            ad.points.ru = vals.slice(2, 4) as Vector;
            ad.points.rb = vals.slice(4, 6) as Vector;
            ad.points.lb = vals.slice(6, 8) as Vector;
            ad.carWalk = vals[8] > 0;
            ad.dir.left = vals[9] > 0;
            ad.dir.up = vals[10] > 0;
            ad.dir.right = vals[11] > 0;
            ad.dir.down = vals[12] > 0;
            ad.parking = vals[13] > 0;
            ad.stop = r[14];
            return ad as AreaDictionary;
        });
        const newAreas = dictionaries.map(ad => new Area().fromAreaDictionary(ad));
        load(newAreas);
    };

    return (
        <div className="IOManager">
            <Button variant="contained" color="primary"
                onClick={() => loadRef.current?.click()}
            >
                Load CSV
            </Button>
            <input hidden
                type="file"
                ref={loadRef}
                accept=".csv"
                onChange={() => loader(loadRef.current?.files?.item(0) ?? null)}
            />

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
        </div >
    );
}