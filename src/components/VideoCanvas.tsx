import React, { useEffect, useRef } from 'react';
import Canvas from './Canvas';

import './VideoCanvas.css';

type VideoCanvasProps = {
    source: string;
};

function VideoCanvas({ source }: VideoCanvasProps) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const sliderRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = source;

        }
    }, [source]);

    const getVideoPos = () => {
        if (!videoRef.current) {
            return 0;
        }

        return videoRef.current.currentTime / videoRef.current.duration * 100;
    };
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
            <video ref={videoRef} hidden />
            <Canvas img={videoRef.current} />
            <input className="slider"
                type="range"
                min="0"
                max="100"
                onChange={ev => { setVideoPos(+ev.target.value); }}
            />
        </div>
    );
}

export default VideoCanvas;
