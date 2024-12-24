import React from 'react'
import styles from './style.module.less'
import { LockClosedIcon } from '@radix-ui/react-icons'

export default function Tools(props: any) {
    return (
        <div className={styles['tools']}>
            <div className={styles['tools-tips']}>
                <LockClosedIcon style={{ marginRight: '8px' }} />
                工具箱正在开发中...
            </div>
        </div>
    )
}
