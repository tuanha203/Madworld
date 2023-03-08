import create from 'zustand'

export const useStore = create((set: any) => ({
    showGraph: false,
    setShowGraph: () => set((state: any) => ({ showGraph: state.showGraph = true })),
    hideShowGraph: () => set((state: any) => ({ showGraph: state.showGraph = false }))
}))
