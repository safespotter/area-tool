import React, { useRef, useState, useEffect } from "react";
import "./Canvas.scss";
import {
  Area,
  Vector,
  Shape,
  Tool,
  DirKeys,
  Options,
} from "../utilities/types";
import {
  distancePointToPoint,
  projectPointToSegment,
  findPointInShapeIndex,
  vecSum,
  vecScale,
  isPointInShape,
  vecRotate,
  vecSub,
  centroidOfShape,
  vecNegative,
} from "../utilities/shapes";

const TOGGLE_SIDEWALK = 0;
const TOGGLE_PARK = 1;
const CANVAS_W = 1920;
const CANVAS_H = 1080;
const POINT_RADIUS = 5;
const SNAP_DISTANCE = 25;
// const ARROW_SCALE = .1;
const ARROW_SIZE = 16;
const ARROW_SIZE_SMALL = 10;
const ID_SIZE = 48;

const alpha = 0.25;

const styleRoad = {
  width: 2,
  stroke: `rgb(220, 80, 80)`,
  fill: `rgba(220, 80, 80, ${alpha})`,
  arrow: `rgba(220, 80, 80, ${alpha * 2})`,
  selected: {
    width: 2,
    stroke: `rgb(255, 130, 130)`,
    fill: `rgba(255, 130, 130, ${alpha})`,
    arrow: `rgba(255, 130, 130, ${alpha * 2})`,
  },
};

const styleSidewalk = {
  width: 2,
  stroke: `rgb(50, 100, 250)`,
  fill: `rgba(50, 100, 250, ${alpha})`,
  arrow: `rgba(50, 100, 250, ${alpha * 2})`,
  selected: {
    width: 2,
    stroke: `rgb(50, 200, 250)`,
    fill: `rgba(50, 200, 250, ${alpha})`,
    arrow: `rgba(50, 200, 250, ${alpha * 2})`,
  },
};

const styleParking = {
  width: 2,
  stroke: `rgb(200, 170, 0)`,
  fill: `rgba(240, 190, 0, ${alpha})`,
  arrow: `rgba(200, 170, 0, ${alpha * 2})`,
  selected: {
    width: 2,
    stroke: `rgb(255, 215, 50)`,
    fill: `rgba(255, 250, 50, ${alpha})`,
    arrow: `rgba(255, 215, 50, ${alpha * 2})`,
  },
};

const styleSidewalkParking = {
  width: 2,
  stroke: `rgb(50, 200, 50)`,
  fill: `rgba(50, 200, 50, ${alpha})`,
  arrow: `rgba(50, 200, 50, ${alpha * 2})`,
  selected: {
    width: 2,
    stroke: `rgb(100, 240, 100)`,
    fill: `rgba(100, 255, 100, ${alpha})`,
    arrow: `rgba(100, 240, 100, ${alpha * 2})`,
  },
};

const styleZebra = {
  width: 2,
  stroke: `rgb(150, 150, 150)`,
  fill: `rgba(150, 150, 150, ${alpha})`,
  arrow: `rgba(150, 150, 150, ${alpha * 2})`,
  selected: {
    width: 2,
    stroke: `rgb(230, 230, 230)`,
    fill: `rgba(230, 230, 230, ${alpha})`,
    arrow: `rgba(230, 230, 230, ${alpha * 2})`,
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
  options?: Options;
}

export default function Canvas({
  img,
  quads,
  newQuad,
  tool,
  setSelected,
  updateQuads,
  deleteQuads,
  slider,
  width,
  height,
  options = { ids: true, arrows: true },
}: CanvasProps) {
  const [points, setPoints] = useState<Shape>([]);
  const [dragging, setDragging] = useState<boolean>(false);
  const [modifier, setModifier] = useState<boolean>(false);
  const [oldMouse, setOldMouse] = useState<Vector | null>(null);
  const [dragIndexes, setDragIndexes] = useState<number[] | null>(null);

  const ref = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  let canvasH = CANVAS_H;
  let canvasW = CANVAS_W;

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    // Background
    try {
      if (!img) throw Error;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Finished Quads
    for (let i = quads.length - 1; i >= 0; i--) {
      const quad = quads[i];
      drawArea(context, quad);
    }

    if (mouse.x && mouse.y) {
      // New Quad
      if (points && tool === Tool.ADD) {
        let close = false;
        const pos = snapToShapes(
          [mouse.x, mouse.y],
          quads.map((a) => a.shape)
        );
        let path = [pos, ...points];
        if (points.length === 3) {
          close = true;
        }
        context.lineWidth = styleRoad.width;
        context.strokeStyle = styleRoad.stroke;
        context.fillStyle = styleRoad.fill;
        drawPath(context, path, true, close);
      }
    }
  }, [img, quads, tool, mouse, modifier, points, slider, width, options]);

  const snapToShapes = (pos: Vector, shapes: Shape[]) => {
    if (modifier) return pos;

    // give priority to points instead of edges
    // find the closest point
    shapes.push([
      [0, 0],
      [canvasW, 0],
      [canvasW, canvasH],
      [0, canvasH],
    ]); // add boundaries
    let [minDist, newPoint] = shapes.flat().reduce(
      ([dist, point]: [number, Vector | null], p) => {
        const d = distancePointToPoint(pos, p);
        if (d < dist || dist === -1) return [d, p];
        else return [dist, point];
      },
      [-1, null]
    );

    if (newPoint && minDist < SNAP_DISTANCE) {
      pos = newPoint;
    } else {
      [minDist, newPoint] = shapes.reduce(
        ([dist, point]: [number, Vector | null], s) => {
          // find the closest point in the edges
          let [d, p] = s.reduce(
            ([dist, point]: [number, Vector | null], p1, i, s) => {
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
            },
            [-1, null]
          );

          // confront it with the previous results
          if ((p && d < dist) || dist === -1) return [d, p];
          return [dist, point];
        },
        [-1, null]
      );

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

    pos = snapToShapes(
      pos,
      quads.map((a) => a.shape)
    );

    const updatedShape = [pos, ...points];

    if (updatedShape.length === 4) {
      const newArea = new Area(updatedShape);
      newArea.order();
      newArea.isSelected = true;
      setSelected(-1);
      newQuad(newArea);
      setPoints([]);
    } else {
      setPoints(updatedShape);
    }
  };

  const drawPath = (
    canvasCtx: CanvasRenderingContext2D,
    points: [number, number][],
    f_drawPoints = false,
    close = true
  ) => {
    if (points[0]) canvasCtx.moveTo(points[0][0], points[0][1]);
    canvasCtx.beginPath();
    for (const p of points) {
      canvasCtx.lineTo(p[0], p[1]);
    }

    if (close) {
      canvasCtx.closePath();
      canvasCtx.fill();
    }
    canvasCtx.stroke();

    if (f_drawPoints) {
      points.forEach((p, i) => drawPoint(canvasCtx, p, i));
    }
  };

  const drawPoint = (
    canvasCtx: CanvasRenderingContext2D,
    point: Vector,
    index = 2
  ) => {
    const tmpFill = canvasCtx.fillStyle;
    const tmpStroke = canvasCtx.strokeStyle;
    const fillStyles = ["#fff", "#f55", "#5f5", "#55f"];
    canvasCtx.fillStyle = fillStyles[index];
    canvasCtx.strokeStyle = "#000";
    canvasCtx.beginPath();
    canvasCtx.arc(point[0], point[1], POINT_RADIUS, 0, 2 * 3.15);
    canvasCtx.closePath();
    canvasCtx.fill();
    canvasCtx.stroke();
    canvasCtx.fillStyle = tmpFill;
    canvasCtx.strokeStyle = tmpStroke;
  };

  const drawArrows = (
    canvasCtx: CanvasRenderingContext2D,
    quad: Vector[],
    directions: { left: boolean; up: boolean; right: boolean; down: boolean },
    color = "#000",
    f_highlight = false
  ) => {
    let arrow: Shape = [
      [-0.7, -1],
      [0, 1],
      [0.7, -1],
    ];
    arrow = arrow.map((vec) =>
      vecScale(vec, f_highlight ? ARROW_SIZE : ARROW_SIZE_SMALL)
    );

    const topMid = centroidOfShape([quad[0], quad[1]]);
    const botMid = centroidOfShape([quad[2], quad[3]]);
    const rightMid = centroidOfShape([quad[1], quad[2]]);
    const leftMid = centroidOfShape([quad[3], quad[0]]);

    const up = vecSub(topMid, botMid);
    const right = vecSub(rightMid, leftMid);

    const arrows = Object.entries(directions).map(([k, v]) => {
      if (!v) return null;
      let dir: Vector, anchor: Vector;
      switch (k) {
        case "up":
          dir = up;
          anchor = topMid;
          break;
        case "down":
          dir = vecNegative(up);
          anchor = botMid;
          break;
        case "right":
          dir = right;
          anchor = rightMid;
          break;
        case "left":
          dir = vecNegative(right);
          anchor = leftMid;
          break;
        default:
          return null;
      }

      const rotated = arrow.map((vec) => vecRotate(vec, dir));
      const translation = vecSub(anchor, rotated[1]);
      return rotated.map((vec) => vecSum(vec, translation));
    });

    const tmpStroke = canvasCtx.strokeStyle;
    const tmpFill = canvasCtx.fillStyle;
    const tmpWidth = canvasCtx.lineWidth;

    if (f_highlight) canvasCtx.strokeStyle = "#000";
    else canvasCtx.strokeStyle = color;

    canvasCtx.fillStyle = color;
    canvasCtx.lineWidth = 2;

    for (const arrow of arrows) {
      if (!arrow) continue;
      drawPath(canvasCtx, arrow, false, true);
    }

    canvasCtx.strokeStyle = tmpStroke;
    canvasCtx.fillStyle = tmpFill;
    canvasCtx.lineWidth = tmpWidth;
  };

  const drawArea = (canvasCtx: CanvasRenderingContext2D, area: Area) => {
    let movement: Vector = [0, 0];
    // Drag
    if (dragging && oldMouse) {
      movement = [mouse.x! - oldMouse[0], mouse.y! - oldMouse[1]] as Vector;
    }

    const shape = area.isSelected
      ? area.shape.map((p, i) => {
          if (dragIndexes && dragIndexes.some((n) => n === i))
            return snapToShapes(
              vecSum(p, movement),
              quads.filter((a) => a.id !== area.id).map((a) => a.shape)
            );
          else return p;
        })
      : area.shape;

    const center = centroidOfShape(shape);

    let style;
    if (area.isCarWalkable) {
      if (area.isParking) style = styleParking;
      else style = styleRoad;
    } else {
      if (area.isParking) style = styleSidewalkParking;
      else if (
        area.direction.up ||
        area.direction.left ||
        area.direction.right ||
        area.direction.down
      )
        style = styleZebra;
      else style = styleSidewalk;
    }
    if (area.isSelected) style = style.selected;

    const tmp = {
      lw: canvasCtx.lineWidth,
      ss: canvasCtx.strokeStyle,
      fs: canvasCtx.fillStyle,
    };
    canvasCtx.lineWidth = style.width;
    canvasCtx.strokeStyle = style.stroke;
    canvasCtx.fillStyle = style.fill;

    drawPath(canvasCtx, shape, area.isSelected, true);
    if (options.ids)
      drawText(canvasCtx, area.id.toString(), center, ID_SIZE, style.stroke);

    if (tool === Tool.SET_DIRECTIONS)
      drawArrows(canvasCtx, shape, area.direction, "#3e3", true);
    else if (options.arrows)
      drawArrows(canvasCtx, shape, area.direction, style.stroke);

    // if (area.isParking) drawParking(canvasCtx, shape, style.stroke);

    canvasCtx.lineWidth = tmp.lw;
    canvasCtx.strokeStyle = tmp.ss;
    canvasCtx.fillStyle = tmp.fs;
  };

  const drawText = (
    canvasCtx: CanvasRenderingContext2D,
    text: string,
    center: Vector,
    size = 12,
    color = "#000"
  ) => {
    const tmp = {
      font: canvasCtx.font,
      ta: canvasCtx.textAlign,
      tb: canvasCtx.textBaseline,
      fs: canvasCtx.fillStyle,
      ss: canvasCtx.strokeStyle,
    };

    canvasCtx.font = `${size}px sans-serif`;
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.fillStyle = color;
    canvasCtx.strokeStyle = "#000";

    canvasCtx.fillText(text, center[0], center[1]);
    canvasCtx.strokeText(text, center[0], center[1]);

    canvasCtx.font = tmp.font;
    canvasCtx.textAlign = tmp.ta;
    canvasCtx.textBaseline = tmp.tb;
    canvasCtx.fillStyle = tmp.fs;
  };

  const handleSelect = () => {
    // check if we have a selected area
    const selected = quads.find((a) => a.isSelected);
    let indexes: number[] | null = null;
    if (selected) {
      // check its closest points and edges to drag them
      const points = selected.shape;
      let distance: number;
      indexes = [-1];
      // find the closest point to the mouse pointer
      [distance, indexes[0]] = points.reduce(
        ([res_d, res_i], p, i) => {
          const d = distancePointToPoint([mouse.x!, mouse.y!], p);
          return d < res_d ? [d, i] : [res_d, res_i];
        },
        [999, -1]
      );
      // if it's too far check if one of the edges is close enough
      if (distance > SNAP_DISTANCE) {
        [distance, indexes] = points.reduce(
          ([res_d, res_is], p, i, points) => {
            const j = (i + 1) % points.length;
            const p1 = points[j];
            const proj = projectPointToSegment([mouse.x!, mouse.y!], [p, p1]);
            if (!proj) return [res_d, res_is];
            const dist = distancePointToPoint([mouse.x!, mouse.y!], proj);
            return dist < res_d ? [dist, [i, j]] : [res_d, res_is];
          },
          [999, [-1]]
        );
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
      const target = findPointInShapeIndex(
        [mouse.x, mouse.y],
        quads.map((a) => a.shape)
      );
      setSelected(target);
    }
  };

  const handleSetDirections = (all = false) => {
    const pos = [mouse.x, mouse.y] as Vector;
    const targetArea = quads.find((q) => isPointInShape(pos, q.shape));
    if (!targetArea) return;

    if (all) {
      const newState = !Object.values(targetArea.direction).every((x) => x);
      for (const key of Object.keys(targetArea.direction)) {
        targetArea.direction[key as DirKeys] = newState;
      }
    } else {
      const shape = targetArea.shape;
      const center = centroidOfShape(shape);
      const sectors = {
        up: [shape[0], shape[1], center] as Shape,
        down: [shape[2], shape[3], center] as Shape,
        right: [shape[1], shape[2], center] as Shape,
        left: [shape[3], shape[0], center] as Shape,
      };

      const selectedDir: DirKeys | null = (() => {
        for (const [k, v] of Object.entries(sectors)) {
          if (isPointInShape(pos, v)) return k as DirKeys;
        }
        return null;
      })();

      if (!selectedDir) return;

      targetArea.direction[selectedDir] = !targetArea.direction[selectedDir];
    }

    updateQuads([targetArea]);
  };

  const handleToggleType = (version = TOGGLE_SIDEWALK) => {
    const pos = [mouse.x, mouse.y] as Vector;
    const targetArea = quads.find((q) => isPointInShape(pos, q.shape));
    if (!targetArea) return;

    switch (version) {
      case TOGGLE_SIDEWALK:
        if (targetArea.isCarWalkable) {
          targetArea.isCarWalkable = false;
        } else {
          targetArea.isCarWalkable = true;
        }
        break;
      case TOGGLE_PARK:
        if (targetArea.isParking) {
          targetArea.isParking = false;
        } else {
          targetArea.isParking = true;
        }
        break;
    }

    updateQuads([targetArea]);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    switch (e.button) {
      case 0:
        switch (tool) {
          case Tool.ADD:
            addPoint();
            break;
          case Tool.SELECT:
            handleSelect();
            break;
          case Tool.SET_DIRECTIONS:
            handleSetDirections();
            break;
          case Tool.TOGGLE_TYPE:
            handleToggleType(TOGGLE_SIDEWALK);
            break;
          default:
            throw Error("Tool not implemented");
        }
        break;
      case 2:
        switch (tool) {
          case Tool.TOGGLE_TYPE:
            handleToggleType(TOGGLE_PARK);
            break;
          case Tool.SET_DIRECTIONS:
            handleSetDirections(true);
            break;
        }
        break;
    }
  };

  const stopDragging = () => {
    if (dragging && oldMouse) {
      const selectedAreas = quads.filter((a) => a.isSelected);
      const movement: Vector = [mouse.x! - oldMouse[0], mouse.y! - oldMouse[1]];
      const updated = selectedAreas.map((a) => {
        a.shape = a.shape.map((p, i) => {
          if (dragIndexes && dragIndexes.some((n) => n === i))
            return snapToShapes(
              vecSum(p, movement),
              quads.filter((b) => b.id !== a.id).map((b) => b.shape)
            );
          else return p;
        });
        return a;
      });
      updated.forEach((a) => a.order());
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
    if (dragging && dragIndexes?.length === 4) {
      setDragging(false);
      setDragIndexes(null);
      setOldMouse(null);
      deleteQuads(quads.filter((q) => q.isSelected));
    } else {
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
        onMouseMove={onMouseMove}
        onContextMenu={(e) => e.preventDefault()}
        width={CANVAS_W}
        height={CANVAS_H}
        onKeyDown={(e) => {
          if (e.key === "Control") setModifier(true);
        }}
        onKeyUp={(e) => {
          if (e.key === "Control") setModifier(false);
        }}
        tabIndex={0}
        onMouseEnter={() => ref.current?.focus()}
        onBlur={() => setPoints([])}
      />
    </div>
  );
}
