import React, { useEffect, useRef } from 'react';
import { Shape } from '../utilities/types';
import Canvas, { CanvasProps } from './Canvas';

import './VideoCanvas.css';

interface VideoCanvasProps extends Omit<CanvasProps, "img"> {
    source: string;
};

export default function VideoCanvas({ source, quads, newQuad, tool, selected, setSelected, moveSelected }: VideoCanvasProps) {

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && source) {
            videoRef.current.src = source;
        }
    }, [source]);

    const setVideoPos = (percentage: number) => {
        if (!videoRef.current) {
            return;
        }
        // force range 0 - 100
        const value = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
        videoRef.current.currentTime = value / 100 * videoRef.current.duration;
    };

    return (
        <div className="VideoCanvas">
            <Canvas
                img={source ? videoRef.current : null}
                quads={quads}
                newQuad={newQuad}
                tool={tool}
                selected={selected}
                setSelected={setSelected}
                moveSelected={moveSelected}
            />
            <input className="slider"
                type="range"
                min="0"
                max="100"
                onChange={ev => { setVideoPos(+ev.target.value); }}
            />
            <video ref={videoRef} hidden />
        </div>
    );
}
