import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Person, FlowMode, GenerationComparison } from '../types/genealogy';

interface GenealogyState {
  grandmother: Partial<Person>;
  mother: Partial<Person>;
  user: Partial<Person>;

  currentStep: number;
  mode: FlowMode;
  isCompleted: boolean;

  setPersonData: (id: 'grandmother' | 'mother' | 'user', data: Partial<Person>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setMode: (mode: FlowMode) => void;
  reset: () => void;
  getComparison: () => GenerationComparison | null;
}

export const useGenealogyStore = create<GenealogyState>()(
  persist(
    (set, get) => ({
      grandmother: {},
      mother: {},
      user: {},
      currentStep: 1,
      mode: 'normal',
      isCompleted: false,

      setPersonData: (id, data) =>
        set((state) => ({
          [id]: { ...state[id], ...data }
        })),

      nextStep: () =>
        set((state) => {
          const next = state.currentStep + 1;
          return {
            currentStep: next,
            isCompleted: next > 6
          };
        }),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1)
        })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(1, Math.min(6, step)) }),

      setMode: (mode) => set({ mode }),

      reset: () =>
        set({
          grandmother: {},
          mother: {},
          user: {},
          currentStep: 1,
          mode: 'normal',
          isCompleted: false
        }),

      getComparison: () => {
        const { grandmother, mother, user } = get();
        if (!grandmother.fullName || !mother.fullName || !user.fullName) {
          return null;
        }
        return {
          grandmother: grandmother as Person,
          mother: mother as Person,
          user: user as Person
        };
      }
    }),
    {
      name: 'grandma-genealogy-storage',
      partialize: (state) => ({
        grandmother: state.grandmother,
        mother: state.mother,
        user: state.user,
        currentStep: state.currentStep,
        mode: state.mode,
        isCompleted: state.isCompleted
      })
    }
  )
);
