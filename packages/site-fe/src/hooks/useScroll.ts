import { useEffect, useState } from "react";

export default function useScroll(target: HTMLElement) {
    const [scrollPercent, setScrollPercent] = useState(0)

    const getScrollPercent = () => {
        const {  scrollTop, scrollHeight, clientHeight } = target

        const scrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
        return scrollPercent;
    };

    const scrollTo = (percent: number) => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = Math.round((scrollHeight * percent) / 100);
        
        target.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = getScrollPercent();
            setScrollPercent(scrollPercent);
        }

        target.addEventListener('scroll', handleScroll);

        return () => {
            target.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return {
        scrollPercent,
        scrollTo
    }
}