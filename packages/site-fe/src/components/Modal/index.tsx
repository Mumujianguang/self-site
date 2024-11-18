import classNames from 'classnames'
import styles from './style.module.less'
import { Blockquote } from '@radix-ui/themes'

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
    } = props

    return (
        <div className={classNames([styles['modal'], open && styles['open']])} onClick={onClose}>
            <div className={styles['modal-body']} onClick={e => e.stopPropagation()}>
                {
                    props.title &&
                    <div className={styles['modal-body-title']}>
                        <Blockquote size={'5'} weight={'bold'}>{props.title}</Blockquote>
                    </div>
                }
                <div className={styles['modal-body-content']}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}