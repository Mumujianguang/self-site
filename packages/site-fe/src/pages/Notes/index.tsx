import React, { useEffect } from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import styles from './style.module.less'
import { useNotesStore } from './store'
import { Grid } from '@radix-ui/themes'
import Modal from '@/components/Modal'
import 'highlight.js/styles/atom-one-dark.min.css'
import EntryAnimationBox from '@/components/EntryAnimationBox'

/**
 * 笔记列表
 * @returns 
 */
export default function Notes() {
    const store = useNotesStore()

    useEffect(() => {
        store.fetchNotes()
    }, [])

    return (
        <div className={styles['notes']}>
            <Grid className={styles['notes-content']} columns="1" gap="5">{
                store.notes.map((note, index) => (
                    <EntryAnimationBox key={index} >
                        <div className={styles['notes-content-item']} onClick={() => store.setActiveNote(note)}>
                            <div className={styles['notes-content-item-title']}>「 {note.title} 」</div>
                            <div className={styles['notes-content-item-summary']}>{note.content}</div>
                        </div>                     
                    </EntryAnimationBox>
                ))
            }</Grid>

            <Modal
                open={Boolean(store.activeNote)}
                title={store.activeNote?.title}
                onClose={() => store.setActiveNote(null)}
            >
                <div>
                    <Markdown rehypePlugins={[rehypeHighlight]}>{store.activeNote?.content}</Markdown>
                </div>
            </Modal>
        </div>
    )
}
