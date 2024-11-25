import { useCallback, useRef } from "react";

type IEventFunction<T extends (...args: any) => any> = T extends (...args: infer Args) => infer Result ? (...args: Args) => Result : never;

/**
 * 创建一个 引用 不变的回调函数
 * @param callback
 * @returns
 */
export default function useEvent<T extends (...args: any[]) => any>(callback: T) {
    const ref = useRef<{ callback: IEventFunction<T> | null }>({
        callback: null
    });

    ref.current.callback = callback as unknown as IEventFunction<T>;

    return useCallback((...args: Parameters<IEventFunction<T>>): ReturnType<IEventFunction<T>> => {
        return ref.current.callback?.call(null, ...args)
    }, [])
}