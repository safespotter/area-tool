import React, { useRef, useState, useEffect, ComponentProps } from 'react';
import useMouse from '@react-hook/mouse-position';
import './Canvas.css';

const CANVAS_W = 1280;
const CANVAS_H = 720;
const POINT_RADIUS = 5;

type CanvasProps = {
    img: CanvasImageSource | null;
};

function Canvas({ img }: CanvasProps) {

    const [points, setPoints] = useState<[number, number][]>([]);

    const ref = useRef<HTMLCanvasElement>(null);
    const mouse = useMouse(ref);

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) {
            return;
        }

        if (img) {
            context.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        } else {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        context.strokeStyle = '#f00';
        context.fillStyle = '#00f';
        drawPath(context, points, true);

        if (points[0] && mouse.x && mouse.y) {
            drawPath(context, [points[0], [mouse.x, mouse.y]]);
        }

    });

    const addPoint = () => {
        if (!mouse.x || !mouse.y) {
            return;
        }
        setPoints([[mouse.x, mouse.y], ...points]);
    };

    const drawPath = (canvasCtx: CanvasRenderingContext2D, points: [number, number][], f_drawPoints = false) => {
        if (points[0])
            canvasCtx.moveTo(points[0][0], points[0][1]);
        canvasCtx.beginPath();
        for (const p of points) {
            canvasCtx.lineTo(p[0], p[1]);
        }
        canvasCtx.stroke();

        if (f_drawPoints) {
            for (const p of points)
                drawPoint(canvasCtx, p);
        }
    };

    const drawPoint = (canvasCtx: CanvasRenderingContext2D, point: [number, number]) => {
        canvasCtx.beginPath();
        canvasCtx.arc(point[0], point[1], POINT_RADIUS, 0, 2 * 3.15);
        canvasCtx.closePath();
        canvasCtx.fill();
    };

    return (
        <div className="Canvas">
            <canvas
                ref={ref}
                onClick={addPoint}
                width={CANVAS_W}
                height={CANVAS_H} 
            />
        </div>
    );
}




export default Canvas;