import React, { useRef, useEffect, useState } from 'react';

import './FilePicker.css';

type FilePickerProps = {
    setFile: (f: File | null) => void,
    accept_types?: string;
};

function FilePicker({ setFile, accept_types = "" }: FilePickerProps) {

    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="FilePicker">
            <input
                ref={ref}
                type="file"
                accept={accept_types}
                onChange={_ => setFile(ref.current?.files?.item(0) ?? null)}
            />
        </div>
    );
}

export default FilePicker;