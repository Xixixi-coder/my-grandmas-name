import type { Era } from '../types/genealogy';

interface NamePattern {
  pattern: RegExp;
  era: Era;
  weight: number;
}

const PATTERNS: NamePattern[] = [
  { pattern: /娣|盼|招|引|来|想|望/, era: '1940-1959', weight: 0.9 },
  { pattern: /花|兰|梅|菊|芳|香|秀/, era: '1940-1959', weight: 0.6 },
  { pattern: /红|卫|东|军|建|国|华|强/, era: '1960-1979', weight: 0.8 },
  { pattern: /英|雄|伟|刚|勇/, era: '1960-1979', weight: 0.7 },
  { pattern: /婷|娜|颖|慧|敏|静|丽|艳/, era: '1980-1999', weight: 0.7 },
  { pattern: /爽|洁|倩|璐|瑶|璇/, era: '1980-1999', weight: 0.6 },
  { pattern: /梓|涵|轩|萱|诺|语|汐/, era: '2000+', weight: 0.8 },
  { pattern: /[A-Za-z]+|子|一|可|沐/, era: '2000+', weight: 0.7 }
];

export const detectEra = (
  name: string,
  birthYear?: number
): { era: Era; confidence: number } => {
  if (birthYear) {
    if (birthYear >= 1940 && birthYear <= 1959) return { era: '1940-1959', confidence: 1.0 };
    if (birthYear >= 1960 && birthYear <= 1979) return { era: '1960-1979', confidence: 1.0 };
    if (birthYear >= 1980 && birthYear <= 1999) return { era: '1980-1999', confidence: 1.0 };
    if (birthYear >= 2000) return { era: '2000+', confidence: 1.0 };
  }

  let maxWeight = 0;
  let detectedEra: Era = 'unknown';

  for (const { pattern, era, weight } of PATTERNS) {
    if (pattern.test(name) && weight > maxWeight) {
      maxWeight = weight;
      detectedEra = era;
    }
  }

  return { era: detectedEra, confidence: maxWeight };
};

export interface EraQuestion {
  question: string;
  options: { value: string; label: string }[];
}

export const getQuestionsByEra = (era: Era): EraQuestion => {
  const questions: Record<Era, EraQuestion> = {
    '1940-1959': {
      question: '这个名字里，藏着家里人对她的什么期待？',
      options: [
        { value: 'beauty', label: '希望她像花一样美' },
        { value: 'son', label: '希望她带来弟弟' },
        { value: 'casual', label: '随便取的，那时候女孩不重要' },
        { value: 'other', label: '其他' }
      ]
    },
    '1960-1979': {
      question: '她的名字是不是带着时代的烙印？',
      options: [
        { value: 'political', label: '又红又专（红梅/建国）' },
        { value: 'practical', label: '朴素实用（秀英/桂芳）' },
        { value: 'hidden', label: '偷偷的美好（藏在朴实里的诗意）' },
        { value: 'other', label: '其他' }
      ]
    },
    '1980-1999': {
      question: '她的名字是突围还是延续？',
      options: [
        { value: 'neutral', label: '中性/男性化（亚男/若男）' },
        { value: 'artistic', label: '文艺清新（婷/娜/颖）' },
        { value: 'single', label: '单名（爽/静/洁）' },
        { value: 'other', label: '其他' }
      ]
    },
    '2000+': {
      question: '她的名字是谁的选择？',
      options: [
        { value: 'careful', label: '父母翻字典的郑重' },
        { value: 'fortune', label: '算命先生的建议' },
        { value: 'trend', label: '网络流行的跟风' },
        { value: 'other', label: '其他' }
      ]
    },
    unknown: {
      question: '关于她的名字，你知道些什么？',
      options: [
        { value: 'story', label: '知道背后的故事' },
        { value: 'nothing', label: '完全不知道' },
        { value: 'guess', label: '有一些猜测' },
        { value: 'other', label: '其他' }
      ]
    }
  };

  return questions[era] || questions.unknown;
};

export const getEraLabel = (era: Era): string => {
  const labels: Record<Era, string> = {
    '1940-1959': '四五十年代',
    '1960-1979': '六七十年代',
    '1980-1999': '八九十年代',
    '2000+': '千禧之后',
    unknown: '未知年代'
  };
  return labels[era];
};

export const getEraColor = (era: Era): string => {
  const colors: Record<Era, string> = {
    '1940-1959': 'text-amber-700',
    '1960-1979': 'text-red-700',
    '1980-1999': 'text-emerald-600',
    '2000+': 'text-sky-500',
    unknown: 'text-stone-400'
  };
  return colors[era];
};
