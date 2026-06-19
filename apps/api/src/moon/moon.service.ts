import { Injectable } from '@nestjs/common';
import * as Astronomy from 'astronomy-engine';

const DAY_MS = 86_400_000;
const SYNODIC_MONTH = 29.530588853;

export type PhaseKey =
  | 'new'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'full'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

export interface MoonDay {
  date: string; // YYYY-MM-DD
  phaseAngle: number; // 0..360
  illumination: number; // 0..100 (%)
  phaseKey: PhaseKey;
  waxing: boolean;
  age: number; // days since previous new moon
  lunarDay: number; // 1..30
  khmer: { day: number; type: 'koeut' | 'roach' };
  moonSignIndex: number; // 0=Aries .. 11=Pisces (ecliptic longitude of Moon)
  moonrise: string | null; // ISO
  moonset: string | null; // ISO
}

@Injectable()
export class MoonService {
  /** Reference instant = local noon of the given calendar date. */
  private noonUtc(year: number, month: number, day: number, tzOffsetMin: number): Date {
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0) - tzOffsetMin * 60_000);
  }

  private localMidnightUtc(year: number, month: number, day: number, tzOffsetMin: number): Date {
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - tzOffsetMin * 60_000);
  }

  phaseKeyFromAngle(angle: number): PhaseKey {
    const a = ((angle % 360) + 360) % 360;
    if (a < 11.25 || a >= 348.75) return 'new';
    if (a < 78.75) return 'waxingCrescent';
    if (a < 101.25) return 'firstQuarter';
    if (a < 168.75) return 'waxingGibbous';
    if (a < 191.25) return 'full';
    if (a < 258.75) return 'waningGibbous';
    if (a < 281.25) return 'lastQuarter';
    return 'waningCrescent';
  }

  /** Most recent new moon at or before the given instant. */
  private previousNewMoon(when: Date): Date {
    const start = new Date(when.getTime() - 45 * DAY_MS);
    let nm = Astronomy.SearchMoonPhase(0, start, 50);
    let result: Astronomy.AstroTime | null = nm;
    while (nm && nm.date.getTime() <= when.getTime()) {
      result = nm;
      nm = Astronomy.SearchMoonPhase(0, new Date(nm.date.getTime() + 2 * DAY_MS), 50);
    }
    return (result ?? Astronomy.SearchMoonPhase(0, start, 50)!).date;
  }

  private riseSet(
    when: Date,
    lat: number,
    lng: number,
    tzOffsetMin: number,
    year: number,
    month: number,
    day: number,
  ): { rise: string | null; set: string | null } {
    try {
      const observer = new Astronomy.Observer(lat, lng, 0);
      const searchStart = this.localMidnightUtc(year, month, day, tzOffsetMin);
      const rise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, searchStart, 1);
      const set = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, searchStart, 1);
      return {
        rise: rise ? rise.date.toISOString() : null,
        set: set ? set.date.toISOString() : null,
      };
    } catch {
      return { rise: null, set: null };
    }
  }

  computeDay(opts: {
    year: number;
    month: number;
    day: number;
    lat?: number;
    lng?: number;
    tzOffsetMin?: number;
    withRiseSet?: boolean;
  }): MoonDay {
    const { year, month, day } = opts;
    const tz = opts.tzOffsetMin ?? 0;
    const ref = this.noonUtc(year, month, day, tz);

    const phaseAngle = Astronomy.MoonPhase(ref);
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, ref);
    const waxing = phaseAngle < 180;

    const newMoon = this.previousNewMoon(ref);
    const age = (ref.getTime() - newMoon.getTime()) / DAY_MS;
    const lunarDay = Math.min(30, Math.max(1, Math.floor(age) + 1));

    let khmerDay: number;
    let khmerType: 'koeut' | 'roach';
    if (waxing) {
      khmerType = 'koeut';
      khmerDay = Math.min(15, Math.max(1, Math.floor(age) + 1));
    } else {
      khmerType = 'roach';
      khmerDay = Math.min(15, Math.max(1, Math.floor(age - SYNODIC_MONTH / 2) + 1));
    }

    const eclMoon = Astronomy.EclipticGeoMoon(Astronomy.MakeTime(ref));
    const moonSignIndex = Math.floor((((eclMoon.lon % 360) + 360) % 360) / 30);

    let moonrise: string | null = null;
    let moonset: string | null = null;
    if (opts.withRiseSet && opts.lat != null && opts.lng != null) {
      const rs = this.riseSet(ref, opts.lat, opts.lng, tz, year, month, day);
      moonrise = rs.rise;
      moonset = rs.set;
    }

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return {
      date: dateStr,
      phaseAngle: Math.round(phaseAngle * 100) / 100,
      illumination: Math.round(illum.phase_fraction * 1000) / 10,
      phaseKey: this.phaseKeyFromAngle(phaseAngle),
      waxing,
      age: Math.round(age * 100) / 100,
      lunarDay,
      khmer: { day: khmerDay, type: khmerType },
      moonSignIndex,
      moonrise,
      moonset,
    };
  }

  computeMonth(opts: {
    year: number;
    month: number;
    lat?: number;
    lng?: number;
    tzOffsetMin?: number;
  }): MoonDay[] {
    const daysInMonth = new Date(opts.year, opts.month, 0).getDate();
    const result: MoonDay[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(
        this.computeDay({
          year: opts.year,
          month: opts.month,
          day: d,
          tzOffsetMin: opts.tzOffsetMin,
          withRiseSet: false,
        }),
      );
    }
    return result;
  }
}
