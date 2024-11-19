import useIntersectionOb from "@/hooks/useIntersectionOb"
import classNames from "classnames"
import { useMemo, useRef } from "react"
import styles from  './style.module.less'

interface Props {
    children?: JSX.Element[] | JSX.Element
}

export default function EntryAnimationBox(props: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const { visible } = useIntersectionOb(ref)

    const cssClassNames = useMemo(() => {
        return classNames([
            visible && styles['visible'],
            styles['entry-animation-box']
        ])
    }, [visible])

    return (
        <div
            ref={ref}
            className={cssClassNames}
        >
            {props.children}
        </div>
    )
}