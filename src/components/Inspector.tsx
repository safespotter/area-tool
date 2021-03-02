import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Clear, Check, CheckBoxOutlined, Delete } from '@material-ui/icons';
import { order } from '../utilities/data';
import { dot, vecSum } from '../utilities/shapes';
import { Area, AreaDictionary, IIndexable, Vector } from '../utilities/types';

import './Inspector.scss';

type InspectorProps = {
    target: Area[];
    update: (updated: Area[]) => void;
    selectById: (id: number) => void;
    deleteById: (id: number) => void;
};

export default function Inspector({ target, update, selectById, deleteById }: InspectorProps) {

    const [inspected, setInspected] = useState<AreaDictionary[]>();
    const updateInspected = (updated: AreaDictionary, changed = true) => {
        updated.changed = changed;
        if (!inspected) return;
        const unchanged = inspected?.filter(a => a.id !== updated.id);
        setInspected([updated, ...unchanged].sort((a, b) => a.id < b.id ? -1 : 1));
    };

    useEffect(() => {

        const selected = target;

        // let selected: Area[] = target.filter(a => a.isSelected);
        // if (selected.length === 0)
        //     selected = target;

        let list = selected.map(a => a.toAreaDictionary());

        const pending = inspected?.filter(t => t.changed);
        list = list.map(a => {
            const t = pending?.find(t => t.id === a.id);
            return t ? t : a;
        });

        list = list.sort((a, b) => a.id < b.id ? -1 : 1);

        setInspected(list);
    }, [target]);


    function renderAD(a: AreaDictionary) {

        const renderPoint = (p: Vector, key: string, ref: AreaDictionary) => {
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
                        <input type="checkbox"
                            checked={v}
                            onChange={() => {
                                (a.dir as IIndexable)[k] = !(a.dir as IIndexable)[k];
                                updateInspected(a);
                            }}
                        />
                    </td>
                );
            });

        return (
            <tr key={a.id} onClick={() => selectById(a.id)} className={a.ref?.isSelected ? "selected" : ""}>
                <td key="delete" className="delete">
                    <Button variant="contained" color="secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteById(a.id);
                        }}
                    >
                        <Delete />
                    </Button>
                </td>
                <td key="id">
                    <div className="id"> {a.id} </div>
                </td>
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
                <td className={!a.changed ? "hide" : "space"} />
                <td key="update" className={!a.changed ? "hide" : ""}>
                    <Button variant="contained" color="primary"

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
                <td key="discard" className={!a.changed ? "hide" : ""}>
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
                        <th />
                        <th>ID      </th>
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