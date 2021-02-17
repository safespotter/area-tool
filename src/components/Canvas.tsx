import React, { useRef, useState, useEffect, ComponentProps } from 'react';
import useMouse from '@react-hook/mouse-position';
import './Canvas.scss';
import { Area, Point, Shape, Tool } from '../utilities/types';
import { distancePointToPoint, projectPointToSegment, findPointIndexInShape, vecSum } from '../utilities/shapes';

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const POINT_RADIUS = 5;
const SNAP_DISTANCE = 25;

const alpha = .25;

const style1 = {
    width: 2,
    stroke: `rgb(250, 50, 50)`,
    fill: `rgba(250, 50, 50, ${alpha})`,
    selected: {
        width: 2,
        stroke: `rgb(255, 200, 50)`,
        fill: `rgba(255, 200, 50, ${alpha})`,
    },
};

const style2 = {
    width: 2,
    stroke: `rgb(50, 50, 250)`,
    fill: `rgba(50, 50, 250, ${alpha})`,
    selected: {
        width: 2,
        stroke: `rgb(50, 250, 250)`,
        fill: `rgba(50, 250, 250, ${alpha})`,
    },
};

export interface CanvasProps {
    img: CanvasImageSource | null;
    quads: Area[];
    newQuad: (quad: Area) => void;
    tool: Tool;
    setSelected: (index: number) => void;
    moveSelected: (vector: Point) => void;
    deleteSelected: () => void;
    slider?: number;
    width?: number;
    height?: number;
};

export default function Canvas({
    img, quads, newQuad, tool, setSelected, moveSelected, deleteSelected, slider, width, height
}: CanvasProps) {

    const [points, setPoints] = useState<Shape>([]);
    const [dragging, setDragging] = useState<boolean>(false);
    const [oldMouse, setOldMouse] = useState<Point | null>(null);

    const ref = useRef<HTMLCanvasElement>(null);
    const rawMouse = useMouse(ref);
    const mouse: { x: number | null, y: number | null; } = { x: null, y: null };

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) {
            return;
        }

        const ratio = canvas.clientWidth / canvas.width;
        mouse.x = rawMouse.x ? rawMouse.x / ratio : null;
        mouse.y = rawMouse.y ? rawMouse.y / ratio : null;

        // Background
        if (img) {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        let movement: Point = [0, 0];
        // Drag
        if (dragging && oldMouse) {
            movement = [mouse.x! - oldMouse[0], mouse.y! - oldMouse[1]] as Point;
        }

        // Finished Quads
        for (const quad of quads) {
            let style;
            if (quad.isCarWalkable) {
                style = style1;
            } else {
                style = style2;
            }
            if (quad.isSelected)
                style = style.selected;

            context.lineWidth = style.width;
            context.strokeStyle = style.stroke;
            context.fillStyle = style.fill;

            if (quad.isSelected) {
                drawPath(context, quad.shape.map(p => vecSum(p, movement)), true);
            } else {
                drawPath(context, quad.shape);
            }
        }

        if (mouse.x && mouse.y) {

            // New Quad
            if (points && tool === Tool.ADD) {
                let close = false;
                const pos = snapToShapes([mouse.x, mouse.y], quads.map(a => a.shape));
                let path = [pos, ...points];
                if (points.length === 3) {
                    close = true;
                }
                context.strokeStyle = '#f00';
                context.fillStyle = '#00f';
                drawPath(context, path, true, close);
            }


        }
    }, [img, quads, tool, rawMouse, points, slider, width]);

    const snapToShapes = (pos: Point, shapes: Shape[]) => {
        let [minDist, newPoint] = shapes.reduce(([dist, point]: [number, Point | null], s) => {

            // find the closest point in each shape with his distance
            let [d, p] = s.reduce(([dist, point]: [number, Point | null], p1, i, s) => {

                const p2 = s[(i + 1) % s.length];
                let proj = projectPointToSegment(pos, [p1, p2]);
                let d, p;
                // if we found a projection it is the closest point
                if (proj) {
                    d = distancePointToPoint(pos, proj);
                    p = proj;
                }
                // otherwise check wich end of the segment is the closest and pick that one
                else {
                    const d1 = distancePointToPoint(pos, p1);
                    const d2 = distancePointToPoint(pos, p2);
                    [d, p] = d1 < d2 ? [d1, [...p1] as Point] : [d2, [...p2] as Point]; // ... to force copy
                }

                // confront it with the previous results
                if (d < dist || dist === -1) return [d, p];
                else return [dist, point];
            }, [-1, null]);

            // confront it with the previous results
            if (d < dist || dist === -1) return [d, p];
            else return [dist, point];
        }, [-1, null]);

        if (newPoint && minDist < SNAP_DISTANCE) {
            pos = newPoint;
        }
        return pos;
    };

    const addPoint = () => {
        if (!mouse.x || !mouse.y) {
            return;
        }

        let pos: Point = [mouse.x, mouse.y];

        pos = snapToShapes(pos, quads.map(a => a.shape));

        const updatedShape = [pos, ...points];

        if (updatedShape.length === 4) {
            const newArea = new Area(updatedShape);
            newArea.isSelected = true;
            setSelected(-1);
            newQuad(newArea);
            setPoints([]);
        } else {
            setPoints(updatedShape);
        }
    };

    const drawPath = (canvasCtx: CanvasRenderingContext2D, points: [number, number][], f_drawPoints = false, close = true) => {
        if (points[0])
            canvasCtx.moveTo(points[0][0], points[0][1]);
        canvasCtx.beginPath();
        for (const p of points) {
            canvasCtx.lineTo(p[0], p[1]);
        }

        if (close)
            canvasCtx.closePath();

        canvasCtx.stroke();
        canvasCtx.fill();

        if (f_drawPoints) {
            for (const p of points)
                drawPoint(canvasCtx, p);
        }
    };

    const drawPoint = (canvasCtx: CanvasRenderingContext2D, point: Point) => {
        const tmpFill = canvasCtx.fillStyle;
        const tmpStroke = canvasCtx.strokeStyle;
        canvasCtx.fillStyle = "#5f5";
        canvasCtx.strokeStyle = "#000";
        canvasCtx.beginPath();
        canvasCtx.arc(point[0], point[1], POINT_RADIUS, 0, 2 * 3.15);
        canvasCtx.closePath();
        canvasCtx.fill();
        canvasCtx.stroke();
        canvasCtx.fillStyle = tmpFill;
        canvasCtx.strokeStyle = tmpStroke;
    };

    const handleSelect = () => {
        const target = findPointIndexInShape([mouse.x, mouse.y] as Point, quads.map(a => a.shape));
        if (target >= 0 && quads[target].isSelected) {
            setDragging(true);
            setOldMouse([mouse.x!, mouse.y!]);
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
        if (dragging && oldMouse) {
            moveSelected([mouse.x! - oldMouse[0], mouse.y! - oldMouse[1]]);
            setDragging(false);
            setOldMouse(null);
        }
    };
    const onMouseLeave = () => {
        setPoints([]);
        if (dragging) {
            setDragging(false);
            setOldMouse(null);
            deleteSelected();
        }
    };

    return (
        <div className="Canvas">
            <canvas
                ref={ref}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                width={width ?? CANVAS_W}
                height={height ?? CANVAS_H}
            />
        </div>
    );
}
