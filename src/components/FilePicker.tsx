import React, { useRef, useEffect, useState } from 'react';

import './FilePicker.css';

const ACCEPT_TYPES = ".mp4"

function FilePicker() {

    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="FilePicker">
            <input 
                ref={ref}
                type="file"
                accept=".mp4"/>
        </div>
    );
}

export default FilePicker;