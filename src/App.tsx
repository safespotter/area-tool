import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import VideoCanvas from './components/VideoCanvas';
import FilePicker from './components/FilePicker';
import { Area, Point, Shape, Tool } from './utilities/types';
import ToolSelector from './components/ToolSelector';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';


export default function App() {

    const [file, setFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [video, setVideo] = useState<HTMLVideoElement | null>(null);
    const [slider, setSlider] = useState<number | undefined>();
    const [quadList, setQuadList] = useState<Area[]>([]);
    const [tool, setTool] = useState<Tool>(Tool.ADD);

    useEffect(() => {
        if (file) {
            const source = URL.createObjectURL(file);
            setVideoSrc(source);
        }
    }, [file]);

    const moveSelected = (vec: Point) => {
        // get the selected areas
        const selected = quadList.filter(a => a.isSelected);
        // add the vector to the points of the selected areas
        selected.map(a => {
            for (const p of a.shape) {
                p[0] += vec[0];
                p[1] += vec[1];
            }
        });
        updateQuads(selected);
    };

    const deleteSelected = () => {
        const filteredList = quadList.filter(a => !a.isSelected);
        setQuadList(filteredList);
    };

    const setSelected = (index: number) => {
        quadList.map(a => a.isSelected = false);
        if (index >= 0 && index < quadList.length) {
            quadList[index].isSelected = true;
        }
        setQuadList([...quadList]);
    };

    const updateQuads = (quads: Area[]) => {
        const notUpdated = quadList.filter(a => {
            for (const b of quads) {
                if (a.id === b.id)
                    return false;
            }
            return true;
        });
        setQuadList([...quads, ...notUpdated]);
    };

    return (
        <div className="App">
            <Canvas
                img={video}
                quads={quadList}
                newQuad={(quad: Area) => setQuadList([quad, ...quadList])}
                tool={tool}
                setSelected={setSelected}
                moveSelected={moveSelected}
                deleteSelected={deleteSelected}
                slider={slider}
            />
            <VideoCanvas
                source={videoSrc}
                setVideo={setVideo}
                setSlider={setSlider}
                value={slider ?? 0}
            />
            <FilePicker setFile={setFile} accept_types="video/*" />
            <ToolSelector
                value={tool}
                onAdd={() => { setTool(Tool.ADD); setSelected(-1); }}
                onSelect={() => { setTool(Tool.SELECT); setSelected(-1); }}
            />
            <Inspector
                target={quadList}
            />
        </div>
    );
}
