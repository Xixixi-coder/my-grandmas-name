import { create } from 'zustand'
import Taro from '@tarojs/taro'
import type { Person, FlowMode, GenerationComparison } from '../types/genealogy'

const STORAGE_KEY = 'grandma-genealogy-storage'

const loadState = () => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const saveState = (state: object) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

interface GenealogyState {
  grandmother: Partial<Person>
  mother: Partial<Person>
  user: Partial<Person>
  currentStep: number
  mode: FlowMode
  isCompleted: boolean

  setPersonData: (id: 'grandmother' | 'mother' | 'user', data: Partial<Person>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  setMode: (mode: FlowMode) => void
  reset: () => void
  getComparison: () => GenerationComparison | null
}

const persisted = loadState()

export const useGenealogyStore = create<GenealogyState>((set, get) => ({
  grandmother: persisted.grandmother || {},
  mother: persisted.mother || {},
  user: persisted.user || {},
  currentStep: persisted.currentStep || 1,
  mode: persisted.mode || 'normal',
  isCompleted: persisted.isCompleted || false,

  setPersonData: (id, data) => {
    set((state) => {
      const next = { ...state, [id]: { ...state[id], ...data } }
      saveState(next)
      return { [id]: next[id] }
    })
  },

  nextStep: () => {
    set((state) => {
      const next = state.currentStep + 1
      const newState = { currentStep: next, isCompleted: next > 6 }
      saveState({ ...state, ...newState })
      return newState
    })
  },

  prevStep: () => {
    set((state) => {
      const newStep = Math.max(1, state.currentStep - 1)
      saveState({ ...state, currentStep: newStep })
      return { currentStep: newStep }
    })
  },

  goToStep: (step) => {
    const clamped = Math.max(1, Math.min(6, step))
    set({ currentStep: clamped })
  },

  setMode: (mode) => set({ mode }),

  reset: () => {
    const blank = {
      grandmother: {},
      mother: {},
      user: {},
      currentStep: 1,
      mode: 'normal' as FlowMode,
      isCompleted: false
    }
    Taro.removeStorageSync(STORAGE_KEY)
    set(blank)
  },

  getComparison: () => {
    const { grandmother, mother, user } = get()
    if (!grandmother.fullName || !mother.fullName || !user.fullName) return null
    return { grandmother: grandmother as Person, mother: mother as Person, user: user as Person }
  }
}))
