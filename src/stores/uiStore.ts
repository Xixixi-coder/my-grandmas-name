import { create } from 'zustand';

interface UIState {
  soundEnabled: boolean;
  isTyping: boolean;
  isLoading: boolean;
  showTraumaIndex: boolean;

  toggleSound: () => void;
  setTyping: (typing: boolean) => void;
  setLoading: (loading: boolean) => void;
  toggleTraumaIndex: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  soundEnabled: false,
  isTyping: false,
  isLoading: false,
  showTraumaIndex: false,

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setTyping: (typing) => set({ isTyping: typing }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleTraumaIndex: () => set((state) => ({ showTraumaIndex: !state.showTraumaIndex }))
}));
