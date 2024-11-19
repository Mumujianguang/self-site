import { RefObject, useEffect, useState } from "react";

export default function useScroll(target: RefObject<HTMLElement | null>) {
    const [scrollPercent, setScrollPercent] = useState(0)

    const getScrollPercent = () => {
        if (!target.current) {
            return 0;
        }
        
        const {  scrollTop, scrollHeight, clientHeight } = target.current
        
        if (scrollHeight <= clientHeight) {
            return 0;
        }

        const scrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
        return scrollPercent;
    };

    const scrollTo = (percent: number) => {
        if (!target.current) {  
            return;
        }

        const scrollHeight = target.current.scrollHeight;
        const scrollTop = Math.round((scrollHeight * percent) / 100);
        
        target.current.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        if (!target.current) {
            return;
        }

        const handleScroll = () => {
            const scrollPercent = getScrollPercent();
            setScrollPercent(scrollPercent);
        }

        target.current.addEventListener('scroll', handleScroll);
        return () => target.current?.removeEventListener('scroll', handleScroll);
        
    }, [])

    return {
        scrollPercent,
        scrollTo
    }
}