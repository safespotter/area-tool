import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import VideoCanvas from './components/VideoCanvas';
import FilePicker from './components/FilePicker';
import { Shape, Tool } from './utilities/types';
import ToolSelector from './components/ToolSelector';


export default function App() {

    const [file, setFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [quadList, setQuadList] = useState<Shape[]>([]);
    const [selected, setSelected] = useState<Shape | null>(null);
    const [tool, setTool] = useState<Tool>(Tool.ADD);

    useEffect(() => {
        if (file) {
            const source = URL.createObjectURL(file);
            setVideoSrc(source);
        }
    }, [file]);

    return (
        <div className="App">
            <VideoCanvas
                source={videoSrc}
                quads={quadList}
                newQuad={(quad: Shape) => { setQuadList([quad, ...quadList]); }}
                tool={tool}
                selected={selected}
                setSelected={setSelected}
            />
            <FilePicker setFile={setFile} accept_types="video/*" />
            <ToolSelector
                value={tool}
                onAdd={() => setTool(Tool.ADD)}
                onSelect={() => setTool(Tool.SELECT)}
            />
        </div>
    );
}
