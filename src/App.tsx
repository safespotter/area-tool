import React, { useEffect, useState } from 'react';
import './App.scss';
import Video from './components/Video';
import FilePicker from './components/FilePicker';
import { Area, Tool, Options } from './utilities/types';
import ToolSelector from './components/ToolSelector';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';
import { IOManager } from './components/IOManager';
import OptionSelector from './components/OptionSelector';


export default function App() {

    const [file, setFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [video, setVideo] = useState<HTMLVideoElement | null>(null);
    const [slider, setSlider] = useState<number | undefined>();
    const [quadList, setQuadList] = useState<Area[]>([]);
    const [tool, setTool] = useState<Tool>(Tool.ADD);
    const [options, setOptions] = useState<Options>({ ids: true, arrows: true, });

    useEffect(() => {
        if (file) {
            const source = URL.createObjectURL(file);
            setVideoSrc(source);
        }
    }, [file]);

    const deleteQuads = (quads: Area[]) => {
        const filteredList = quadList.filter(a => quads.every(b => b.id !== a.id));
        setQuadList(filteredList);
    };

    const setSelected = (index: number) => {
        quadList.map(a => a.isSelected = false);
        if (index >= 0 && index < quadList.length) {
            quadList[index].isSelected = true;
        }
        setQuadList([...quadList]);
    };

    const setSelectedById = (id: number) => {
        setSelected(quadList.findIndex(a => a.id === id));
    };

    const updateQuads = (quads: Area[]) => {
        const notUpdated = quadList.filter(a => quads.every(b => b.id !== a.id));
        setQuadList([...quads, ...notUpdated]);
    };

    return (
        <div className="App">
            <div>
                <div className="BlockButtons">
                    <OptionSelector
                        options={options}
                        updateOptions={setOptions}
                    />
                </div>
                <div className="BlockCanvas">
                    <Canvas
                        img={video}
                        quads={quadList}
                        newQuad={(quad: Area) => setQuadList([quad, ...quadList])}
                        tool={tool}
                        setSelected={setSelected}
                        updateQuads={updateQuads}
                        deleteQuads={deleteQuads}
                        slider={slider}
                        width={video?.videoWidth || undefined}
                        height={video?.videoHeight || undefined}
                        options={options}
                    />
                    <Video
                        source={videoSrc}
                        setVideo={setVideo}
                        setSlider={setSlider}
                        value={slider ?? 0}
                    />
                </div>
                <div className="BlockButtons">
                    <ToolSelector
                        value={tool}
                        onAdd={() => { setTool(Tool.ADD); setSelected(-1); }}
                        onSelect={() => { setTool(Tool.SELECT); setSelected(-1); }}
                        onSetDirections={() => { setTool(Tool.SET_DIRECTIONS); }}
                    />
                    <FilePicker setFile={setFile} accept_types="video/*" />
                    <IOManager
                        target={quadList}
                        source={file?.name}
                        load={arr => setQuadList(arr)}
                    />
                </div>
            </div>
            <div>
                <Inspector
                    target={quadList}
                    update={updateQuads}
                    selectById={setSelectedById}
                    deleteById={(id) => deleteQuads(quadList.filter(q => q.id === id))}
                />
            </div>
        </div>
    );
}
