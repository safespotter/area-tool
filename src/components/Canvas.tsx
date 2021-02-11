import React, { useRef, useState, useEffect, ComponentProps } from 'react';
import useMouse from '@react-hook/mouse-position';
import './Canvas.css';
import { Point, Shape, Tool } from '../utilities/types';
import { findShape } from '../utilities/shapes';

const CANVAS_W = 1280;
const CANVAS_H = 720;
const POINT_RADIUS = 5;

export interface CanvasProps {
    img: CanvasImageSource | null;
    quads: Shape[];
    newQuad: (quad: Shape) => void;
    tool: Tool;
    selected: Shape | null;
    setSelected: (s: Shape | null) => void;
};

export default function Canvas({ img, quads, newQuad, tool, selected, setSelected }: CanvasProps) {

    const [points, setPoints] = useState<Shape>([]);
    const [dragging, setDragging] = useState<boolean>(false);

    const ref = useRef<HTMLCanvasElement>(null);
    const mouse = useMouse(ref);

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) {
            return;
        }

        if (tool === Tool.ADD) {
            setSelected(null);
        }
        if (tool === Tool.SELECT) {
            setPoints([]);
        }

        // Background
        if (img) {
            context.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        } else {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Finished Quads
        context.strokeStyle = '#f00';
        context.fillStyle = '#00f';
        for (const quad of quads) {
            drawPath(context, [...quad, quad[0]], true);
        }

        // New Quad
        if (points && mouse.x && mouse.y) {
            let path = [[mouse.x, mouse.y] as Point, ...points];
            if (points.length === 3) {
                path = [points[2], ...path];
            }
            drawPath(context, path, true);
        }

        // Selected Quad
        if (selected && selected[0]) {
            context.strokeStyle = '#ff0';
            context.fillStyle = '#0ff';
            drawPath(context, [...selected, selected[0]], true);
        }
    });

    const addPoint = () => {
        if (!mouse.x || !mouse.y) {
            return;
        }
        const updatedShape = [[mouse.x, mouse.y] as Point, ...points];

        if (updatedShape.length === 4) {
            newQuad(updatedShape);
            setPoints([]);
        } else {
            setPoints(updatedShape);
        }
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

    const drawPoint = (canvasCtx: CanvasRenderingContext2D, point: Point) => {
        canvasCtx.beginPath();
        canvasCtx.arc(point[0], point[1], POINT_RADIUS, 0, 2 * 3.15);
        canvasCtx.closePath();
        canvasCtx.fill();
    };

    const handleSelect = () => {
        const target = findShape([mouse.x, mouse.y] as Point, quads);
        if (target === selected) {
            setDragging(true);
        } else {
            setSelected(target);
        }
    };

    const onMouseDown = () => {
        switch (tool) {
            case Tool.ADD:
                addPoint();
                break;
            case Tool.SELECT:
                handleSelect();
                break;
            default:
                throw Error("No tool selected???");
        }
    };
    const onMouseUp = () => {
        setDragging(false);
    };
    const onMouseLeave = () => {
        setPoints([]);
    };

    return (
        <div className="Canvas">
            <canvas
                ref={ref}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                width={CANVAS_W}
                height={CANVAS_H}
            />
        </div>
    );
}
