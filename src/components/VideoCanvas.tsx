import React, { useEffect, useRef } from 'react';
import { Shape } from '../utilities/types';
import Canvas, { CanvasProps } from './Canvas';

import './VideoCanvas.css';

type VideoCanvasProps = {
    source: string;
    setVideo: (video: HTMLVideoElement) => void;
    setSlider: (value: number | undefined) => void;
    value: number;
};

export default function VideoCanvas({ source, setVideo, setSlider, value }: VideoCanvasProps) {

    const videoRef = useRef<HTMLVideoElement>(null);


    useEffect(() => {
        if (videoRef.current && source) {
            videoRef.current.src = source;
            videoRef.current.currentTime = 0;
            setVideo(videoRef.current);
        }
    }, [source]);

    const setVideoPos = (percentage: number) => {
        if (!videoRef.current || !source || !percentage) {
            return;
        }
        // force range 0 - 100
        const value = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
        videoRef.current.currentTime = value / 100 * videoRef.current.duration;
        setSlider(value);
    };

    return (
        <div className="VideoCanvas">
            <input className="slider"
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={ev => { setVideoPos(+ev.target.value); }}
            />
            <video ref={videoRef} hidden />
        </div>
    );
}
