import { useEffect, useState } from 'react';
import type { Lang, MoonDay, Profile } from '../types';
import { api } from '../api';
import { PHASE_NAME, makeT } from '../i18n';
import { MoonVisual } from './MoonVisual';

interface Props {
  profile: Profile;
  lang: Lang;
  onSelectDay: (date: string) => void;
}

const WEEKDAYS: Record<Lang, string[]> = {
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  km: ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'],
};

export function CalendarView({ profile, lang, onSelectDay }: Props) {
  const t = makeT(lang);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-based
  const [days, setDays] = useState<MoonDay[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .month(year, month, profile.latitude ?? undefined, profile.longitude ?? undefined, profile.tzOffsetMin)
      .then((d) => active && setDays(d))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [year, month, profile]);

  const shift = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  // Monday-first offset for the 1st of the month.
  const firstDow = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const todayStr = new Date().toISOString().slice(0, 10);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString(
    lang === 'km' ? 'km-KH' : 'en-US',
    { month: 'long', year: 'numeric' },
  );

  return (
    <div className="pb-24">
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => shift(-1)} className="btn-ghost" aria-label={t('prev')}>
            ‹
          </button>
          <h2 className="font-display text-2xl text-moon-glow">{monthLabel}</h2>
          <button onClick={() => shift(1)} className="btn-ghost" aria-label={t('next')}>
            ›
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-white/40">
          {WEEKDAYS[lang].map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>

        {loading || !days ? (
          <div className="py-16 text-center text-white/50">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map((d) => {
              const dayNum = Number(d.date.slice(8, 10));
              const isToday = d.date === todayStr;
              return (
                <button
                  key={d.date}
                  onClick={() => onSelectDay(d.date)}
                  title={PHASE_NAME[lang][d.phaseKey]}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl p-1 transition hover:bg-white/10 ${
                    isToday ? 'bg-gold/15 ring-1 ring-gold/60' : ''
                  }`}
                >
                  <span className="text-[11px] text-white/55">{dayNum}</span>
                  <MoonVisual illumination={d.illumination} waxing={d.waxing} size={26} />
                </button>
              );
            })}
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-white/35">
        {lang === 'km' ? 'ចុចថ្ងៃណាមួយ ដើម្បីមើលលម្អិត' : 'Tap any day to see its details'}
      </p>
    </div>
  );
}
