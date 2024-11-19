import classNames from 'classnames'
import styles from './style.module.less'
import { Blockquote, Progress } from '@radix-ui/themes'
import { useEffect, useRef } from 'react';
import useScroll from '@/hooks/useScroll';

interface Props {
    open?: boolean,
    title?: string,
    children: JSX.Element | JSX.Element[],
    onClose?: () => void
}

export default function Modal(props: Props) {
    const {
        open = false,
        onClose = () => {},
    } = props;

    const ref = useRef<HTMLDivElement | null>(null);
    const { scrollPercent } = useScroll(ref)

    const wrapOnClose = () => {
        onClose?.();
    }

    return (
        <div
            className={classNames([
                styles['modal'],
                open && styles['open']
            ])}
            onClick={wrapOnClose}
        >
            <div
                ref={ref}
                className={styles['modal-body']}
                onClick={e => e.stopPropagation()}
            >
                {
                    props.title &&
                    <div className={styles['modal-body-title']}>
                        <Blockquote size={'5'} weight={'bold'}>{props.title}</Blockquote>
                    </div>
                }

                <div className={styles['modal-body-progress']}>
                    <Progress size={'1'} value={scrollPercent} color='jade' />
                    <div className={styles['modal-body-progress-text']}>
                        {scrollPercent}%
                    </div>
                </div>

                <div className={styles['modal-body-content']}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}