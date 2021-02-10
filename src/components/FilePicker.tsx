import React, { useRef, useEffect, useState } from 'react';

import './FilePicker.css';

type FilePickerProps = {
    setFileList: (f: FileList | null) => void,
    accept_types?: string;
};

function FilePicker({ setFileList, accept_types = "" }: FilePickerProps) {

    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="FilePicker">
            <input
                ref={ref}
                type="file"
                accept={accept_types}
                onChange={_ => setFileList(ref.current!.files)}
            />
        </div>
    );
}

export default FilePicker;