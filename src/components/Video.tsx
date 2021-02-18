import React, { useEffect, useRef } from 'react';

import './Video.css';

type VideoProps = {
    source: string;
    setVideo: (video: HTMLVideoElement) => void;
    setSlider: (value: number | undefined) => void;
    value: number;
};

export default function Video({ source, setVideo, setSlider, value }: VideoProps) {

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && source) {
            videoRef.current.src = source;
            setVideo(videoRef.current);

            const loader = () => {
                setTimeout(() => {
                    if (videoRef.current?.duration) {
                        setVideoPos(1);
                    } else loader();
                }, 10);
            };

            loader();
        }
    }, [source]);

    const setVideoPos = (percentage: number) => {
        if (!videoRef.current || !source || !percentage) {
            return;
        }
        // force range 0 - 100
        const value = percentage < 1 ? 1 : percentage > 100 ? 100 : percentage;
        videoRef.current.currentTime = value / 100 * videoRef.current.duration;
        setSlider(value);
    };

    return (
        <div className="VideoCanvas">
            <input className="slider"
                type="range"
                min="1"
                max="100"
                onChange={ev => { setVideoPos(+ev.target.value); }}
            />
            <video ref={videoRef} hidden />
        </div>
    );
}
