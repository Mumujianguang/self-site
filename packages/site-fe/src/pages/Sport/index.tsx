import React, { useEffect } from 'react'
import styles from './style.module.less'
import { useSportStore } from './store'

export default function Sport(props: any) {
    const store = useSportStore()

    useEffect(() => {
        store.fetchSportRecords()
    }, [])

    return (
        <div className={styles['sport']}>sport</div>
    )
}
