import { useEffect, useRef } from 'react'
import anime from 'animejs/lib/anime.es.js'
import style from './style.module.less'

export default function Signature() {
    const elementRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (elementRef.current) {
            anime({
                targets: elementRef.current.querySelectorAll(`.${style['el']}`),
                translateX: function(_el: Element, i: number) {
                    return 30
                },
                scale: function(_el: Element, i: number, l: number) {
                    return 1.2;
                },
                rotate: function() {
                    return anime.random(-30, 30)
                },
                borderRadius: function() {
                    return ['30%', anime.random(40, 60) + '%']
                },
                duration: function() {
                    return 1800
                },
                delay: function(_el: Element, i: number) {
                    return 2000 + (i * 200)
                },
                direction: 'alternate',
                loop: true
            });
        }
        
    }, [])

    return (
        <div ref={elementRef} className={`${style['signature']}`}>
            <div className={style['el']}>M</div>
            <div className={style['el']}>M</div>
            <div className={style['el']}>J</div>
            <div className={style['el']}>G</div>
        </div>
    )
}