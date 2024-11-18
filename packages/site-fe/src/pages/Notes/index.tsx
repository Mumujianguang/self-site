import React, { useEffect } from 'react'
import styles from './style.module.less'
import { useNotesStore } from './store'
import { Grid } from '@radix-ui/themes'

export default function Notes() {
    const store = useNotesStore()

    useEffect(() => {
        store.fetchNotes()
    }, [])

    return (
        <div className={styles['notes']}>
            <Grid className={styles['notes-content']} columns="1" gap="5">{
                store.notes.map((note, index) => (
                    <div key={index} className={styles['notes-content-item']}>
                        <div className={styles['notes-content-item-title']}>「 {note.title} 」</div>
                        <div className={styles['notes-content-item-summary']}>{note.content}</div>
                    </div>
                ))
            }</Grid>
        </div>
    )
}
