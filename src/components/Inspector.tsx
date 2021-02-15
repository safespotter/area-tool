import React, { useEffect, useState } from 'react';
import { order } from '../utilities/data';
import { dot } from '../utilities/shapes';
import { Area, Point } from '../utilities/types';

import './Inspector.css';

type InspectorProps = {
    target: Area[];
};

export default function Inspector({ target }: InspectorProps) {

    const [inspected, setInspected] = useState<Area[]>([]);

    useEffect(() => {
        setInspected(target.filter(a => a.isSelected));
    });

    function renderArea(area: Area) {

        const renderPoint = (p: Point) => {
            return [
                <td key={"x" + p[0]}>{Math.round(p[0])}</td>,
                <td key={"y" + p[1]}>{Math.round(p[1])}</td>,
            ];
        };

        const renderedPoints = order(area.shape)
            .map(p => renderPoint(p))
            .reduce((acc, val) => acc.concat(val));
        // .map((el, i) => el.key = i);

        const renderDirection = (dir: Point | null) => {
            if (!dir) dir = [0, 0];
            // order is l-u-r-d
            return [
                <td key="left"> {dot(dir, [-1, 0]) > .25 ? 1 : 0}</td>,
                <td key="up">   {dot(dir, [0, -1]) > .25 ? 1 : 0}</td>,
                <td key="right">{dot(dir, [1, 0]) > .25 ? 1 : 0}</td>,
                <td key="down"> {dot(dir, [0, 1]) > .25 ? 1 : 0}</td>,
            ];
        };

        return (
            <tr key={area.id}>
                {renderedPoints}
                <td key="iscarwalkable">{area.isCarWalkable ? "true" : "false"}</td>
                {renderDirection(area.direction)}
                <td key="isparking">{area.isParking ? "true" : "false"}</td>
                <td key="isstop">{area.Stop ?? "None"}</td>
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
                        inspected.map((a) => renderArea(a))
                    }
                </tbody>
            </table>
        </div>
    );

}