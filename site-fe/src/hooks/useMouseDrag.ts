import { useRef, useState } from "react"
import useEvent from "./useEvent"

/**
 * 鼠标拖拽 - 捕获鼠标移动时的偏移量
 * @returns
 */
export default function useMouseDrag() {
    // 缓存状态
    const cache = useRef({
        // 鼠标位置
        mousePosition: {
            x: 0,
            y: 0
        }
    })

    // 鼠标移动时的偏移量
    const [offset, setOffset] = useState({
        xOffset: 0,
        yOffset: 0
    })

    /**
     * 鼠标按下
     */
    const onMouseDown = useEvent((e: MouseEvent) => {
        const { pageX, pageY } = e;

        cache.current.mousePosition = {
            x: pageX,
            y: pageY
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    })

    /**
     * 鼠标移动
     */
    const onMouseMove = useEvent((e: MouseEvent) => {
        const { pageX, pageY } = e;
        const { x, y } = cache.current.mousePosition;

        setOffset({
            xOffset: pageX - x,
            yOffset: pageY - y
        })

        cache.current.mousePosition = {
            x: pageX,
            y: pageY
        }
    })

    /**
     * 鼠标抬起
     */
    const onMouseUp = useEvent((e: MouseEvent) => {
        setOffset({
            xOffset: 0,
            yOffset: 0
        })
        
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    })

    return {
        ...offset,
        onMouseDown,
    }
}