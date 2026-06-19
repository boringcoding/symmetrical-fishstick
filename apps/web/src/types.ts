export type PhaseKey =
  | 'new'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'full'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

export type Lang = 'en' | 'km';
export type Category = 'haircut' | 'garden' | 'health' | 'finance' | 'love';

export interface KhmerLunar {
  day: number;
  moonPhase: number;
  moonPhaseKm: string;
  moonPhaseEn: 'waxing' | 'waning';
  monthIndex: number;
  monthKm: string;
  monthEn: string;
  isLeapMonth: boolean;
  beYear: number;
  jsYear: number;
  animalIndex: number;
  animalKm: string;
  animalEn: string;
  sakKm: string;
  sakEn: string;
  weekdayIndex: number;
  weekdayKm: string;
  weekdayEn: string;
  formattedKm: string;
  formattedEn: string;
}

export interface MoonDay {
  date: string;
  phaseAngle: number;
  illumination: number;
  phaseKey: PhaseKey;
  waxing: boolean;
  age: number;
  lunarDay: number;
  khmer: { day: number; type: 'koeut' | 'roach' };
  khmerLunar: KhmerLunar;
  moonSignIndex: number;
  moonrise: string | null;
  moonset: string | null;
}

export interface ZodiacSign {
  index: number;
  key: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  en: string;
  km: string;
}

export interface Insights {
  date: string;
  greeting: string;
  language: Lang;
  moon: MoonDay;
  mood: string;
  moonSign: ZodiacSign | null;
  sunSign: ZodiacSign | null;
  biorhythm: { physical: number; emotional: number; intellectual: number } | null;
  advice: Array<{ category: Category | 'general'; text: string }>;
}

export interface Profile {
  id: string;
  name: string;
  username?: string | null;
  avatarUrl?: string | null;
  authSub?: string | null;
  authProvider?: string | null;
  birthDate: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  tzOffsetMin: number;
  language: Lang;
  categories: string[] | null;
}
