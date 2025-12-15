export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export interface UserInput {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  gender: Gender;
}

export interface CandleData {
  age: number;
  year: number;
  open: number;
  close: number;
  high: number;
  low: number;
  ma5: number; // 5-year moving average equivalent
  ma10: number; // 10-year moving average equivalent (Da Yun)
  summary: string; // Short phrase describing the luck
  trend: 'bull' | 'bear' | 'doji';
}

export interface BaziInfo {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  element: string; // The Day Master (e.g., Yang Fire)
  animal: string; // Zodiac animal
}

export interface FortuneResponse {
  bazi: BaziInfo;
  chartData: CandleData[];
  analysis: string; // Detailed markdown analysis
  bullYears: number[]; // Ages of significant 'bull markets'
  bearYears: number[]; // Ages of significant 'bear markets'
}
