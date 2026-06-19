import type { Lang } from '../types';

const KH_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KH_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ',
];
const KH_WEEK = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];

/** Convert Western digits in a value to Khmer numerals. */
export function khNum(v: number | string): string {
  return String(v).replace(/[0-9]/g, (d) => KH_DIGITS[+d]);
}

/** Numerals: Khmer when the UI is Khmer, otherwise unchanged. */
export function num(v: number | string, lang: Lang): string {
  return lang === 'km' ? khNum(v) : String(v);
}

/** Long date from a YYYY-MM-DD string — guaranteed Khmer (no browser-locale dependency). */
export function fmtDate(ymd: string, lang: Lang): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  if (lang === 'km') {
    return `ថ្ងៃ${KH_WEEK[dt.getUTCDay()]} ${khNum(d)} ${KH_MONTHS[m - 1]} ${khNum(y)}`;
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
  if (lang === 'km') return `${KH_MONTHS[month1 - 1]} ${khNum(year)}`;
  return new Date(year, month1 - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/** Local HH:MM, Khmer numerals when the UI is Khmer. */
export function fmtTime(iso: string | null, lang: Lang): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const s = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return lang === 'km' ? khNum(s) : s;
}
