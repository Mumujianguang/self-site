import React from 'react'
import styles from './style.module.less'
import Resume from './resume.mdx'
import { LockClosedIcon } from '@radix-ui/react-icons'

export default function Doc(props: any) {
    return (
        <div className={styles['doc']}>
            <div className={styles['doc-content']}>
                <Resume />
            </div>
        </div>
    )
}
