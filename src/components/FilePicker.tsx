import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

import './FilePicker.css';

type FilePickerProps = {
    setFile: (f: File | null) => void,
    accept_types?: string;
};

function FilePicker({ setFile, accept_types = "" }: FilePickerProps) {

    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="FilePicker">
            <Button variant="contained" color="primary"
                onClick={() => ref.current?.click()}
            >
                Select Video
            </Button>
            <input hidden
                ref={ref}
                type="file"
                accept={accept_types}
                onChange={_ => setFile(ref.current?.files?.item(0) ?? null)}
            />
        </div>
    );
}

export default FilePicker;