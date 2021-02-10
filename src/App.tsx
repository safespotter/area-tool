import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import VideoCanvas from './components/VideoCanvas';
import FilePicker from './components/FilePicker';


function App() {

    const [file, setFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string>("");

    useEffect(() => {
        if (file) {
            const source = URL.createObjectURL(file)
            setVideoSrc(source)
        }
    }, [file])
    
    return (
        <div className="App">
            <VideoCanvas source={videoSrc} />
            <FilePicker setFile={setFile} accept_types="video/*" />
        </div>
    );
}

export default App;
