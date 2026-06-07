export interface Person {
  id: 'grandmother' | 'mother' | 'user';
  fullName: string;
  birthYear?: number;
  nickname?: string;
  nameOrigin: NameOrigin;
  youngWish: string;
  actualLife?: string;
  era: Era;
}

export interface NameOrigin {
  category: 'family_expectation' | 'era_mark' | 'breakthrough' | 'parent_choice' | 'other';
  customStory?: string;
}

export type Era = '1940-1959' | '1960-1979' | '1980-1999' | '2000+' | 'unknown';

export interface GenerationComparison {
  grandmother: Person;
  mother: Person;
  user: Person;
  traumaIndex?: TraumaIndex;
}

export interface TraumaIndex {
  patriarchal: number;
  eraMark: number;
  individualWill: number;
  survivalStrategy: number;
}

export interface ShareCard {
  type: 'comparison' | 'trauma' | 'linkedin';
  imageUrl: string;
  shareText: string;
  deepLink: string;
}

export type FlowMode = 'normal' | 'completion';

export interface UIState {
  currentStep: number;
  mode: FlowMode;
  isTyping: boolean;
  soundEnabled: boolean;
  isLoading: boolean;
}
