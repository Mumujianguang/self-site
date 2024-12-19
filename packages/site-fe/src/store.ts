import { api } from '@/api'
import { create } from 'zustand'

export interface IStore {
    pv: number
    incrementPV: () => void
}

export const useGlobalStore = create<IStore>((set) => ({
    pv: 0,
    incrementPV: async () => {
        const response = await api.post('/pv');
        console.log(response)
        
        set((state) => ({ pv: state.pv + 1 }))
    }
}))