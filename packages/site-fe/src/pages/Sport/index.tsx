import React, { useEffect } from 'react'
import styles from './style.module.less'
import { useSportStore } from './store'
import { LockClosedIcon } from '@radix-ui/react-icons'

export default function Sport(props: any) {
    const store = useSportStore()

    useEffect(() => {
        // store.fetchSportRecords().catch((error) => {
        //     console.log('sport error', error)

        // })
    }, [])

    return (
        <div className={styles['sport']}>
            <div className={styles['sport-tips']}>
                <LockClosedIcon style={{ marginRight: '8px' }} />
                暂未接入运动数据
            </div>
        </div>
    )
}
