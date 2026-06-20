import type { Lang } from '../types';

const KH_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KH_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ',
];
const KH_WEEK = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];

/** Convert Western digits in a value to Khmer numerals (use only for the
 *  traditional lunar-calendar context — Chhankitek dates). */
export function khNum(v: number | string): string {
  return String(v).replace(/[0-9]/g, (d) => KH_DIGITS[+d]);
}

/**
 * Numerals for modern UI metrics (scores, %, stats, picker, Gregorian dates).
 * Cambodians use Arabic digits in everyday digital interfaces, so we keep these
 * Arabic in both languages; Khmer numerals are reserved for the almanac date.
 */
export function num(v: number | string, _lang: Lang): string {
  return String(v);
}

/** Long date from a YYYY-MM-DD string — Khmer weekday/month words, Arabic day/year. */
export function fmtDate(ymd: string, lang: Lang): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  if (lang === 'km') {
    return `ថ្ងៃ${KH_WEEK[dt.getUTCDay()]} ${d} ${KH_MONTHS[m - 1]} ${y}`;
  }
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function fmtMonth(year: number, month1: number, lang: Lang): string {
  if (lang === 'km') return `${KH_MONTHS[month1 - 1]} ${year}`;
  return new Date(year, month1 - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/** Local HH:MM (Arabic digits — modern context). */
export function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
