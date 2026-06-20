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
 * Numerals for modern UI metrics. Arabic in English; in Khmer we show Arabic
 * with the traditional Khmer numeral beside it: e.g. "92 (៩២)".
 */
export function num(v: number | string, lang: Lang): string {
  return lang === 'km' ? `${v} (${khNum(v)})` : String(v);
}

/** Percentage variant: "92%" / "92% (៩២%)". */
export function numPct(v: number | string, lang: Lang): string {
  return lang === 'km' ? `${v}% (${khNum(v)}%)` : `${v}%`;
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
