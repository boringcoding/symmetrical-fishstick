import { Injectable } from '@nestjs/common';
import { KhmerService } from '../khmer/khmer.service';
import {
  ANIMALS,
  ANIMAL_TRAIT,
  BORN_DAY,
  LUCKY_COLORS,
  FORTUNE_HEADLINE,
  COMPAT_VERDICT,
  baseCompatBand,
  bandLine,
  hashSeed,
  Lang,
} from './fortune.content';

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export interface DailyFortune {
  date: string;
  animalIndex: number;
  animal: { km: string; en: string; emoji: string };
  animalTrait: string;
  bornDayTrait: string | null;
  score: number; // overall luck 0..100
  love: number;
  money: number;
  health: number;
  luckyNumber: number;
  luckyColor: { name: string; hex: string };
  headline: string;
}

export interface Compatibility {
  a: { animalIndex: number; km: string; en: string; emoji: string };
  b: { animalIndex: number; km: string; en: string; emoji: string };
  score: number;
  verdict: string;
}

@Injectable()
export class FortuneService {
  constructor(private readonly khmer: KhmerService) {}

  animalFromBirth(birthDate: string): number {
    const [y, m, d] = birthDate.split('-').map(Number);
    return this.khmer.forDate(y, m, d).animalIndex;
  }

  private animalObj(i: number) {
    const a = ANIMALS[i];
    return { animalIndex: i, km: a.km, en: a.en, emoji: a.emoji };
  }

  daily(birthDate: string, dateStr: string, lang: Lang): DailyFortune {
    const animalIndex = this.animalFromBirth(birthDate);
    const animal = ANIMALS[animalIndex];

    const seed = (salt: string) => hashSeed(`${birthDate}|${dateStr}|${salt}`);
    const band = (s: number) => 42 + (s % 58); // 42..99, feels fortune-like

    const score = band(seed('luck'));
    const love = band(seed('love'));
    const money = band(seed('money'));
    const health = band(seed('health'));
    const luckyNumber = (seed('num') % 9) + 1;
    const color = LUCKY_COLORS[seed('color') % LUCKY_COLORS.length];
    const headline = bandLine(FORTUNE_HEADLINE, score, seed('headline'))[lang];

    let bornDayTrait: string | null = null;
    const dow = new Date(`${birthDate}T00:00:00Z`).getUTCDay();
    if (!Number.isNaN(dow)) bornDayTrait = BORN_DAY[dow][lang];

    return {
      date: dateStr,
      animalIndex,
      animal: { km: animal.km, en: animal.en, emoji: animal.emoji },
      animalTrait: ANIMAL_TRAIT[animalIndex][lang],
      bornDayTrait,
      score,
      love,
      money,
      health,
      luckyNumber,
      luckyColor: { name: lang === 'km' ? color.km : color.en, hex: color.hex },
      headline,
    };
  }

  compatibility(aIndex: number, bIndex: number, lang: Lang): Compatibility {
    const base = baseCompatBand(aIndex, bIndex);
    const seed = hashSeed(`${Math.min(aIndex, bIndex)}-${Math.max(aIndex, bIndex)}`);
    const score = clamp(base + ((seed % 9) - 4), 20, 99);
    const verdict = bandLine(COMPAT_VERDICT, score, seed)[lang];
    return {
      a: this.animalObj(aIndex),
      b: this.animalObj(bIndex),
      score,
      verdict,
    };
  }

  /** Accept either an animal index (0-11) or a YYYY-MM-DD birth date. */
  resolveAnimal(value: string): number {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return this.animalFromBirth(value);
    const n = Number(value);
    if (Number.isInteger(n) && n >= 0 && n <= 11) return n;
    throw new Error('invalid animal/birth value');
  }
}
