import React from 'react'
import styles from './style.module.less'
import { LockClosedIcon } from '@radix-ui/react-icons'

export default function Doc(props: any) {
    return (
        <div className={styles['doc']}>
            <div className={styles['doc-tips']}>
                <LockClosedIcon style={{ marginRight: '8px' }} />
                个人简历正在迭代中，暂未开放访问
            </div>
        </div>
    )
}
