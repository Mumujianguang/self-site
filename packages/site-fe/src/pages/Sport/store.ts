import { api } from '@/api'
import { create } from 'zustand'

export interface ISportRecord {
    id: string
    icon?: string
    title: string
    content: string
    summary: string
}

export interface ISportStore {
    sportRecords: ISportRecord[]
    fetchSportRecords: () => Promise<void>
}

export const useSportStore = create<ISportStore>((set) => ({
    sportRecords: [],
    fetchSportRecords: async () => {
        const response = await api.get('/huawei/healthkit/activityRecords', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const sportRecords = response.data.data

        set({ sportRecords })
    }
}))