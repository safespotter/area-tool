import React, { useRef, useState, useEffect, ComponentProps } from 'react'
import useMouse from '@react-hook/mouse-position'
import './Canvas.css'

const CANVAS_W = 1280
const CANVAS_H = 720
const POINT_RADIUS = 5

function Canvas() {

    const [points, setPoints] = useState<[number, number][]>([])

    const ref = useRef<HTMLCanvasElement>(null)
    const mouse = useMouse(ref)

    useEffect(() => {
        const canvas = ref.current
        const context = canvas?.getContext('2d')
        if (!canvas || !context) {
            return
        }

        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvas.width, canvas.height)

        let cur_pos = null
        for (const p of points){
            if (!cur_pos) cur_pos = p
            // context.fillRect(p[0] - POINT_RADIUS, p[1] - POINT_RADIUS, POINT_RADIUS * 2, POINT_RADIUS * 2)
            context.beginPath()
            context.moveTo(cur_pos[0], cur_pos[1])
            context.lineTo(p[0], p[1])
            context.stroke()
            cur_pos = p
        }

        if (cur_pos && mouse.x && mouse.y) {
            context.beginPath()
            context.moveTo(cur_pos[0], cur_pos[1])
            context.lineTo(mouse.x, mouse.y)
            context.stroke()
        }

    }, [points, mouse])

    const addPoint = () => {
        if (!mouse.x || !mouse.y){
            throw ReferenceError("Cannot get mouse position!")
        }
        setPoints([...points, [mouse.x, mouse.y]])
        console.log(points)
    }

    return (
        <canvas 
            ref={ref} 
            onClick={addPoint} 
            width={CANVAS_W}
            height={CANVAS_H}/>
    )
}




export default Canvas