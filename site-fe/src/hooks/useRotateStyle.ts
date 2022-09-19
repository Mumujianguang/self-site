import { CSSProperties, useEffect, useRef, useState } from "react";
import useEvent from "./useEvent";

export enum RotateStatus {
    running,
    paused
}

type RotateRuntime = {
    // 旋转角度
    rotate: number
    // 旋转速度/帧
    speed: number
    // 暂停动画：动画衰减速度/帧
    decaySpeed: number
    // 帧处理器标记
    rAFIndex?: number
}

// 默认旋转动画配置
const defaultRotateConfig = {
    rotate: 0,
    speed: 0.5,
    decaySpeed: 0.005
}

/**
 * 旋转动画
 * @returns
 */
export default function useRotateAnimation(rotateConfig: RotateRuntime = defaultRotateConfig) {
    const rotateRuntime = useRef<RotateRuntime>({
        ...rotateConfig
    })

    const [rotateStyle, setRotateStyle] = useState<CSSProperties>({})
    const [rotateStatus, setRotateStatus] = useState(RotateStatus.running);

    /**
     * 计算下一帧的旋转角度
     */
    function nextRotateFrame(targetSpeed?: number) {
        const { rotate, speed } = rotateRuntime.current;
        const nextRotate = (rotate + (targetSpeed! ?? speed)) % 360;

        rotateRuntime.current.rotate = nextRotate
    }

    /**
     * cancel rAF
     */
    const cancelRAF = useEvent(() => {
        if (rotateRuntime.current.rAFIndex) {
            cancelAnimationFrame(rotateRuntime.current.rAFIndex);
        }
    })

    /**
     * 旋转动画
     */
    const rotateAnimation = useEvent(() => {
        cancelRAF();

        rotateRuntime.current.rAFIndex = requestAnimationFrame(() => {
            nextRotateFrame()

            setRotateStyle({
                transform: `rotateY(${rotateRuntime.current.rotate}deg)`
            })

            rotateAnimation()
        })
    })

    /**
     * 创建 旋转暂停动画
     */
    const createRotateEnding = useEvent(() => {
        let { speed } = rotateRuntime.current
        const { decaySpeed } = rotateRuntime.current

        cancelRAF();

        const rotateEnding = () => {
            speed -= decaySpeed

            rotateRuntime.current.rAFIndex = requestAnimationFrame(() => {
                nextRotateFrame(speed)

                setRotateStyle({
                    transform: `rotateY(${rotateRuntime.current.rotate}deg)`
                })
    
                if (speed > 0) {
                    rotateEnding()
                }
            })
        }
        
        return rotateEnding
    })

    /**
     * 暂停动画
     */
    const cancelRotateAnimation = useEvent(() => {
        const rotateEnding = createRotateEnding();
        rotateEnding();
    })

    useEffect(() => {
        if (rotateStatus === RotateStatus.paused) {
            return;
        }

        rotateAnimation()

        return () => cancelRotateAnimation()
    }, [rotateStatus])
 
    return { rotateStyle, setRotateStatus };
}