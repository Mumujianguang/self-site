import { useCallback, useRef } from "react";

/**
 * 创建一个 引用 不变的回调函数
 * @param callback
 * @returns
 */
export default function useEvent(callback: Function) {
    const ref = useRef<any>({});

    ref.current.callback = callback

    return useCallback((...args: any): any => {
        return ref.current.callback.call(null, ...args)
    }, [])
}