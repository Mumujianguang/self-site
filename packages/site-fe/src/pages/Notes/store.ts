import { api } from '@/api'
import { create } from 'zustand'

export interface INote {
    id: string
    icon?: string
    title: string
    content: string
    summary: string
}

export interface INotesStore {
    notes: INote[]
    fetchNotes: () => Promise<void>

    activeNote: INote | null
    setActiveNote: (note: INote | null) => void
}

export const useNotesStore = create<INotesStore>((set) => ({
    notes: [],
    fetchNotes: async () => {
        const response = await api.get('/notes/detailList')
        const notes = response.data.data

        set({ notes })
    },

    activeNote: null,
    setActiveNote: (note) => set({ activeNote: note })
}))