import React, { useRef, useState, useEffect } from 'react';
import './Canvas.scss';
import { Area, Vector, Shape, Tool } from '../utilities/types';
import { distancePointToPoint, projectPointToSegment, findPointInShapeIndex, vecSum, vecScale, vecFromCoordinateSystem, centroidOfShape, dirShapeToShape, isPointInShape, vecRotate } from '../utilities/shapes';
import { order } from '../utilities/data';

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const POINT_RADIUS = 5;
const SNAP_DISTANCE = 25;
const ARROW_SIZE = 12;

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
    updateQuads: (arr: Area[]) => void;
    deleteQuads: (arr: Area[]) => void;
    slider?: number;
    width?: number;
    height?: number;
};

export default function Canvas({
    img, quads, newQuad, tool, setSelected, updateQuads, deleteQuads, slider, width, height
}: CanvasProps) {

    const [points, setPoints] = useState<Shape>([]);
    const [dragging, setDragging] = useState<boolean>(false);
    const [oldMouse, setOldMouse] = useState<Vector | null>(null);
    const [dragIndexes, setDragIndexes] = useState<number[] | null>(null);

    const ref = useRef<HTMLCanvasElement>(null);
    const [mouse, setMouse] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });

    let canvasH = CANVAS_H;
    let canvasW = CANVAS_W;

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) {
            return;
        }

        canvasH = canvas.height;
        canvasW = canvas.width;

        // Background
        try {
            if (!img) throw Error;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        } catch (e) {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        let movement: Vector = [0, 0];
        // Drag
        if (dragging && oldMouse) {
            movement = [mouse.x! - oldMouse[0], mouse.y! - oldMouse[1]] as Vector;
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

            const shape = quad.isSelected
                ? quad.shape.map((p, i) => {
                    if (dragIndexes && dragIndexes.some(n => n === i))
                        return snapToShapes(vecSum(p, movement), quads.filter(a => a.id !== quad.id).map(a => a.shape));
                    else return p;
                })
                : quad.shape;


            drawPath(context, shape, quad.isSelected);
            drawArrow(context, shape, quad.direction ?? [0, 0], style.stroke);
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
                context.lineWidth = style1.width;
                context.strokeStyle = style1.stroke;
                context.fillStyle = style1.fill;
                drawPath(context, path, true, close);
            }


        }
    }, [img, quads, tool, mouse, points, slider, width]);

    const snapToShapes = (pos: Vector, shapes: Shape[]) => {
        // give priority to points instead of edges
        // find the closest point
        console.log(canvasW, canvasH);
        shapes.push([[0, 0], [canvasW, 0], [canvasW, canvasH], [0, canvasH]]); // add boundaries
        let [minDist, newPoint] = shapes.flat().reduce(([dist, point]: [number, Vector | null], p) => {
            const d = distancePointToPoint(pos, p);
            if (d < dist || dist === -1) return [d, p];
            else return [dist, point];
        }, [-1, null]);

        if (newPoint && minDist < SNAP_DISTANCE) {
            pos = newPoint;
        } else {
            [minDist, newPoint] = shapes.reduce(([dist, point]: [number, Vector | null], s) => {
                // find the closest point in the edges
                let [d, p] = s.reduce(([dist, point]: [number, Vector | null], p1, i, s) => {

                    const p2 = s[(i + 1) % s.length];
                    let proj = projectPointToSegment(pos, [p1, p2]);
                    let d, p;
                    // if we found a projection it is the closest point
                    if (proj) {
                        d = distancePointToPoint(pos, proj);
                        p = proj;
                        // confront it with the previous results
                        if (d < dist || dist === -1) return [d, p];
                    }
                    return [dist, point];
                }, [-1, null]);

                // confront it with the previous results
                if (p && d < dist || dist === -1) return [d, p];
                return [dist, point];
            }, [-1, null]);

            if (newPoint && minDist < SNAP_DISTANCE) {
                pos = newPoint;
            }
        }

        return pos;
    };

    const addPoint = () => {
        if (!mouse.x || !mouse.y) {
            return;
        }

        let pos: Vector = [mouse.x, mouse.y];

        pos = snapToShapes(pos, quads.map(a => a.shape));

        const updatedShape = [pos, ...points];

        if (updatedShape.length === 4) {
            const newArea = new Area(order(updatedShape), [0, 1]);
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

    const drawPoint = (canvasCtx: CanvasRenderingContext2D, point: Vector) => {
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

    const drawArrow = (canvasCtx: CanvasRenderingContext2D, quad: Vector[], dirVec: Vector, color = "#000") => {
        const center = centroidOfShape(quad);

        const shapeUp = dirShapeToShape([quad[2], quad[3]], [quad[0], quad[1]]);
        const shapeRight = dirShapeToShape([quad[3], quad[0]], [quad[1], quad[2]]);


        let arrow: Shape = [[-1, 0], [0, 2], [1, 0]];
        arrow = arrow.map(v => vecScale(v, ARROW_SIZE));

        const dirVecOriented = vecFromCoordinateSystem(dirVec, shapeUp, shapeRight);
        arrow = arrow.map(v => vecRotate(v, dirVecOriented));

        // arrow = arrow.map(v => vecRotate(v, dirVec));
        // arrow = arrow.map(v => vecFromCoordinateSystem(v, shapeUp, shapeRight));

        arrow = arrow.map(v => vecSum(v, center));

        const tmpFill = canvasCtx.fillStyle;
        canvasCtx.fillStyle = "rgba(0,0,0,0)";
        const tmpStroke = canvasCtx.strokeStyle;
        canvasCtx.strokeStyle = color;

        drawPath(canvasCtx, arrow, false, false);

        canvasCtx.fillStyle = tmpFill;
        canvasCtx.strokeStyle = tmpStroke;
    };

    const handleSelect = () => {
        // check if we have a selected area
        const selected = quads.find(a => a.isSelected);
        let indexes: number[] | null = null;
        if (selected) {
            // check its closest points and edges to drag them
            const points = selected.shape;
            let distance: number;
            indexes = [-1];
            // find the closest point to the mouse pointer
            [distance, indexes[0]] = points.reduce(([res_d, res_i], p, i) => {
                const d = distancePointToPoint([mouse.x!, mouse.y!], p);
                return d < res_d ? [d, i] : [res_d, res_i];
            }, [999, -1]);
            // if it's too far check if one of the edges is close enough
            if (distance > SNAP_DISTANCE) {
                [distance, indexes] = points.reduce(([res_d, res_is], p, i, points) => {
                    const j = (i + 1) % points.length;
                    const p1 = points[j];
                    const proj = projectPointToSegment([mouse.x!, mouse.y!], [p, p1]);
                    if (!proj) return [res_d, res_is];
                    const dist = distancePointToPoint([mouse.x!, mouse.y!], proj);
                    return dist < res_d ? [dist, [i, j]] : [res_d, res_is];
                }, [999, [-1]]);
            }
            // if it's not check if we clicked it and drag the entire shape
            if (distance > SNAP_DISTANCE) {
                if (isPointInShape([mouse.x, mouse.y], selected.shape)) {
                    indexes = [0, 1, 2, 3];
                } else {
                    indexes = null;
                }
            }
        }

        if (indexes) {
            // update the state
            setDragIndexes(indexes);
            setDragging(true);
            setOldMouse([mouse.x!, mouse.y!]);
        } else {
            // check if we clicked an area and select it
            const target = findPointInShapeIndex([mouse.x, mouse.y], quads.map(a => a.shape));
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

    const stopDragging = () => {
        if (dragging && oldMouse) {
            const selectedAreas = quads.filter(a => a.isSelected);
            const movement: Vector = [mouse.x! - oldMouse[0], mouse.y! - oldMouse[1]];
            const updated = selectedAreas.map(a => {
                a.shape = a.shape.map((p, i) => {
                    if (dragIndexes && dragIndexes.some(n => n === i))
                        return snapToShapes(vecSum(p, movement), quads.filter(b => b.id !== a.id).map(b => b.shape));
                    else return p;
                });
                return a;
            });
            updateQuads(updated);
            setDragging(false);
            setDragIndexes(null);
            setOldMouse(null);
        }
    };

    const onMouseUp = () => {
        stopDragging();
    };

    const onMouseLeave = () => {
        setPoints([]);
        if (dragging && dragIndexes?.length === 4) {
            setDragging(false);
            setDragIndexes(null);
            setOldMouse(null);
            deleteQuads(quads.filter(q => q.isSelected));
        }
        else {
            stopDragging();
        }
    };
    const onMouseMove = (e: React.MouseEvent) => {
        const canvas = ref.current;
        if (canvas) {
            const ratio = canvas.clientWidth / canvas.width;
            const topLeft = [canvas.offsetLeft, canvas.offsetTop];
            setMouse({
                x: (e.pageX - topLeft[0]) / ratio,
                y: (e.pageY - topLeft[1]) / ratio,
            });
        }
    };

    return (
        <div className="Canvas">
            <canvas
                ref={ref}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onMouseMove={e => onMouseMove(e)}
                width={width ?? CANVAS_W}
                height={height ?? CANVAS_H}
            />
        </div>
    );
}
