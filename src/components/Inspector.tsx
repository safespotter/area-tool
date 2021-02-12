import { format } from 'path';
import React, { useEffect } from 'react';
import { convertToCSV } from '../utilities/data';
import { CSVArea } from '../utilities/types';

import './Inspector.css';

type InspectorProps = {
    target: any;
};

export default function Inspector({ target }: InspectorProps) {

    let csvObj = null;
    if (target) csvObj = convertToCSV(target);

    const formatCSV = (csvObj: CSVArea | null) => {
        if (!csvObj) return;
        return (
            <tr>
                <td>{csvObj.lu.x}        </td>
                <td>{csvObj.lu.y}        </td>
                <td>{csvObj.ru.x}        </td>
                <td>{csvObj.ru.y}        </td>
                <td>{csvObj.rb.x}        </td>
                <td>{csvObj.rb.y}        </td>
                <td>{csvObj.lb.x}        </td>
                <td>{csvObj.lb.y}        </td>
                <td>{csvObj.carWalk}        </td>
                <td>{csvObj.direction.left} </td>
                <td>{csvObj.direction.up}   </td>
                <td>{csvObj.direction.right}</td>
                <td>{csvObj.direction.down} </td>
                <td>{csvObj.parking}        </td>
                <td>{csvObj.stop}        </td>
            </tr>
        );
    };

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
                    {formatCSV(csvObj)}
                </tbody>
            </table>
        </div>
    );

}