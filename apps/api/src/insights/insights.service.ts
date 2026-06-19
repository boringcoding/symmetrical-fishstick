import { Injectable } from '@nestjs/common';
import { MoonService, MoonDay } from '../moon/moon.service';
import { ProfileService } from '../profile/profile.service';
import {
  PHASE_CONTENT,
  WEEKDAY_ENERGY,
  ELEMENT_FLAVOR,
  ZODIAC,
  ZodiacSign,
  sunSignFromDate,
  observanceFor,
  biorhythmNote,
  hashSeed,
  pick,
  Lang,
  Category,
} from './content';

const DAY_MS = 86_400_000;

export interface Biorhythm {
  physical: number;
  emotional: number;
  intellectual: number;
}

export interface Insights {
  date: string;
  greeting: string;
  language: Lang;
  moon: MoonDay;
  mood: string;
  dayEnergy: string;
  reading: string[]; // composed, varied paragraphs
  observance: { title: string; note: string } | null;
  moonSign: ZodiacSign | null;
  sunSign: ZodiacSign | null;
  biorhythm: Biorhythm | null;
  advice: Array<{ category: Category; text: string }>;
}

@Injectable()
export class InsightsService {
  constructor(
    private readonly moon: MoonService,
    private readonly profiles: ProfileService,
  ) {}

  private biorhythm(birthDate: string, ref: Date): Biorhythm {
    const birth = new Date(`${birthDate}T00:00:00Z`);
    const days = Math.floor((ref.getTime() - birth.getTime()) / DAY_MS);
    const pct = (period: number) => Math.round(Math.sin((2 * Math.PI * days) / period) * 100);
    return { physical: pct(23), emotional: pct(28), intellectual: pct(33) };
  }

  private greet(name: string, lang: Lang): string {
    const hi = lang === 'km' ? 'សួស្ដី' : 'Hello';
    return name ? `${hi}, ${name}` : hi;
  }

  async forProfile(profileId: string, dateStr?: string): Promise<Insights> {
    const profile = await this.profiles.findOne(profileId);
    const lang = (profile.language === 'km' ? 'km' : 'en') as Lang;

    const d = this.parseDate(dateStr);
    const ref = new Date(Date.UTC(d.year, d.month - 1, d.day, 12, 0, 0));

    const moon = this.moon.computeDay({
      year: d.year,
      month: d.month,
      day: d.day,
      lat: profile.latitude ?? undefined,
      lng: profile.longitude ?? undefined,
      tzOffsetMin: profile.tzOffsetMin ?? 0,
      withRiseSet: profile.latitude != null && profile.longitude != null,
    });

    const phase = PHASE_CONTENT[moon.phaseKey];
    const moonSign = ZODIAC[moon.moonSignIndex] ?? null;
    const kh = moon.khmerLunar;

    // Deterministic but day-and-person specific selection seed.
    const base = `${moon.date}|${profile.id}`;
    const seed = (salt: string) => hashSeed(base + '|' + salt);

    // --- mood (varied per day) ---
    const mood = pick(phase.moods, seed('mood'))[lang];

    // --- weekday / planetary energy ---
    const we = WEEKDAY_ENERGY[kh.weekdayIndex] ?? WEEKDAY_ENERGY[0];
    const dayEnergy =
      lang === 'km'
        ? `ថ្ងៃ${kh.weekdayKm} ស្ថិតក្រោម${we.planet.km} — ${we.theme.km}។`
        : `${kh.weekdayEn} is ruled by the ${we.planet.en} — ${we.theme.en}.`;

    // --- composed reading (multiple independent signals → feels different daily) ---
    const reading: string[] = [];
    if (moonSign) reading.push(ELEMENT_FLAVOR[moonSign.element][lang]);

    let sunSign: ZodiacSign | null = null;
    let biorhythm: Biorhythm | null = null;
    if (profile.birthDate) {
      const [, m, day] = profile.birthDate.split('-').map(Number);
      sunSign = sunSignFromDate(m, day);
      biorhythm = this.biorhythm(profile.birthDate, ref);
      const bNote = biorhythmNote(biorhythm);
      if (bNote) reading.push(bNote[lang]);
    }

    // --- observance (Buddhist precept day) ---
    const obsRaw = observanceFor(kh.moonPhase, kh.day);
    const observance = obsRaw
      ? { title: obsRaw.title[lang], note: obsRaw.note[lang] }
      : null;

    // --- advice (general always, then chosen categories; each varied) ---
    const selected: Category[] =
      profile.categories && profile.categories.length
        ? (profile.categories as Category[])
        : ['general'];

    const advice: Array<{ category: Category; text: string }> = [];
    if (phase.advice.general) {
      advice.push({ category: 'general', text: pick(phase.advice.general, seed('general'))[lang] });
    }
    for (const cat of selected) {
      if (cat === 'general') continue;
      const variants = phase.advice[cat];
      if (variants && variants.length) {
        advice.push({ category: cat, text: pick(variants, seed(cat))[lang] });
      }
    }

    return {
      date: moon.date,
      greeting: this.greet(profile.name, lang),
      language: lang,
      moon,
      mood,
      dayEnergy,
      reading,
      observance,
      moonSign,
      sunSign,
      biorhythm,
      advice,
    };
  }

  private parseDate(date?: string): { year: number; month: number; day: number } {
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split('-').map(Number);
      return { year: y, month: m, day: d };
    }
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() };
  }
}
