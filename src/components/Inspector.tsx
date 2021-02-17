import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Clear, Check, CheckBoxOutlined } from '@material-ui/icons';
import { order } from '../utilities/data';
import { dot, vecSum } from '../utilities/shapes';
import { Area, AreaDictionary, IIndexable, Point } from '../utilities/types';

import './Inspector.scss';

type InspectorProps = {
    target: Area[];
    update: (updated: Area[]) => void;
};

export default function Inspector({ target, update }: InspectorProps) {

    const [inspected, setInspected] = useState<AreaDictionary[]>();
    const updateInspected = (updated: AreaDictionary, changed = true) => {
        updated.changed = changed;
        if (!inspected) return;
        const unchanged = inspected?.filter(a => a.id !== updated.id);
        setInspected([updated, ...unchanged].sort((a, b) => a.id < b.id ? -1 : 1));
    };

    useEffect(() => {
        let selected: Area[] = target.filter(a => a.isSelected);
        if (selected.length === 0)
            selected = target;

        let list = selected.map(a => a.toAreaDictionary());

        const pending = inspected?.filter(t => t.changed);
        list = list.map(a => {
            const t = pending?.find(t => t.id === a.id);
            return t ? t : a;
        });

        list = list.sort((a, b) => a.id < b.id ? -1 : 1);

        setInspected(list);
    }, [target]);

    useEffect(() => { console.log(inspected); }, [inspected]);


    function renderAD(a: AreaDictionary) {

        const renderPoint = (p: Point, key: string, ref: AreaDictionary) => {
            return p.map((val, i) => {
                return (
                    <td key={`${key}${i}`}>
                        <input
                            type="number"
                            value={Math.round(val)}
                            onChange={e => {
                                (ref.points as IIndexable)[key][i] = +e.target.value;
                                updateInspected(ref);
                            }}
                        />
                    </td>
                );
            });
        };

        const renderedPoints = Object.entries(a.points)
            .flatMap(([k, v]) => renderPoint(v, k, a));

        const renderedDirection = Object.entries(a.dir)
            .map(([k, v]) => {
                return (
                    <td key={k}>
                        <input
                            type="number"
                            value={v ? 1 : 0}
                            onChange={e => {
                                (a.dir as IIndexable)[k] = +e.target.value > 0;
                                updateInspected(a);
                            }}
                        />
                    </td>
                );
            });

        return (
            <tr key={a.id}>
                {renderedPoints}
                <td key="iscarwalkable">
                    <input type="checkbox"
                        checked={a.carWalk}
                        onChange={() => {
                            a.carWalk = !a.carWalk;
                            updateInspected(a);
                        }}
                    />
                </td>
                {renderedDirection}
                <td key="isparking">
                    <input type="checkbox"
                        checked={a.parking}
                        onChange={() => {
                            a.parking = !a.parking;
                            updateInspected(a);
                        }}
                    />
                </td>
                <td key="isstop">
                    <input
                        type="text"
                        value={a.stop ?? "None"}
                        onChange={e => {
                            a.stop = e.target.value;
                            updateInspected(a);
                        }}
                    />
                </td>
                <span />
                <td key="update">
                    <Button variant="contained" color="primary"
                        className={!a.changed ? "hide" : ""}
                        onClick={() => {
                            updateInspected(a, false);
                            update([
                                target.find(t => t.id === a.id)!.fromAreaDictionary(a)
                            ]);
                        }}
                    >
                        <Check />
                    </Button>
                </td>
                <td key="discard">
                    <Button variant="contained" color="secondary"
                        className={!a.changed ? "hide" : ""}
                        onClick={() => {
                            a = target.find(t => t.id === a.id)!.toAreaDictionary();
                            updateInspected(a, false);
                        }}
                    >
                        <Clear />
                    </Button>
                </td>
            </tr>
        );
    }

    return (
        <div className="Inspector">
            <table>
                <thead>
                    <tr>
                        <th>luX     </th>
                        <th>luY     </th>
                        <th>ruX     </th>
                        <th>ruY     </th>
                        <th>rbX     </th>
                        <th>rbY     </th>
                        <th>lbX     </th>
                        <th>lbY     </th>
                        <th>CarWalk </th>
                        <th>Left    </th>
                        <th>Up      </th>
                        <th>Right   </th>
                        <th>Down    </th>
                        <th>Parking </th>
                        <th>Stop    </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        inspected?.map((a) => renderAD(a))
                    }
                </tbody>
            </table>
        </div>
    );

}