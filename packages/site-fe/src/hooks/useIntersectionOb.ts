import { RefObject, useEffect, useState } from "react"

export default function useIntersectionOb(target: RefObject<HTMLElement | null>) {
    const [state, setState] = useState({
        visible: false,
        intersectionRatio: 0,
    })

    useEffect(() => {
        if (!target?.current) {
            return () => {}
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log(entry)

                setState({
                    visible: entry.isIntersecting,
                    intersectionRatio: entry.intersectionRatio,
                })
            })
        }, {
            rootMargin: '0px',
            threshold: 0.5,
        })

        observer.observe(target.current)

        return () => target.current && observer.unobserve(target.current)
    }, [])

    return state
}