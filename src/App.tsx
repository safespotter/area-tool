import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import VideoCanvas from './components/VideoCanvas';
import FilePicker from './components/FilePicker';
import { Point, Shape, Tool } from './utilities/types';
import ToolSelector from './components/ToolSelector';


export default function App() {

    const [file, setFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [quadList, setQuadList] = useState<Shape[]>([]);
    const [selected, setSelected] = useState<number>(-1);
    const [tool, setTool] = useState<Tool>(Tool.ADD);

    useEffect(() => {
        if (file) {
            const source = URL.createObjectURL(file);
            setVideoSrc(source);
        }
    }, [file]);

    const moveSelected = (vec: Point) => {
        for (const p of quadList[selected]) {
            p[0] += vec[0];
            p[1] += vec[1];
        }
        setQuadList(quadList);
    };

    return (
        <div className="App">
            <VideoCanvas
                source={videoSrc}
                quads={quadList}
                newQuad={(quad: Shape) => { setQuadList([quad, ...quadList]); }}
                tool={tool}
                selected={selected}
                setSelected={setSelected}
                moveSelected={moveSelected}
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
