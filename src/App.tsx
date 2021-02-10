import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import FilePicker from './components/FilePicker';


function App() {

    const [fileList, setFileList] = useState<FileList | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (!fileList || !videoRef.current) {
            return
        }

        const source = URL.createObjectURL(fileList[0])
        videoRef.current.src = source

    }, [fileList])

    return (
        <div className="App">
            <video ref={videoRef} controls/>
            <Canvas img={videoRef.current as CanvasImageSource} />
            <FilePicker setFileList={setFileList} accept_types="video/*" />

        </div>
    );
}

export default App;
