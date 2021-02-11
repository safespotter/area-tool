import React, { useEffect } from 'react';

import './Inspector.css';

type InspectorProps = {
    target: any;
};

export default function Inspector({ target }: InspectorProps) {

    return (
        <div className="Inspector">
            {JSON.stringify(target)}
        </div>
    );

}