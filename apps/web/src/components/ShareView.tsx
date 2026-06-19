import { useEffect, useState } from 'react';
import type { Lang, MoonDay } from '../types';
import { api } from '../api';
import { PHASE_NAME, makeT } from '../i18n';
import { MoonOrb } from './MoonOrb';
import { Starfield } from './Starfield';
import { shareResult } from '../lib/share';
import type { ShareCardData } from '../lib/shareImage';

interface Props {
  date: string;
  lat?: number;
  lng?: number;
  tz?: number;
  lang: Lang;
  onLang: (l: Lang) => void;
  onMakeYours: () => void;
}

export function ShareView({ date, lat, lng, tz, lang, onMakeYours }: Props) {
  const t = makeT(lang);
  const [moon, setMoon] = useState<MoonDay | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.moonDay(date, lat, lng, tz).then(setMoon).catch(() => setMoon(null));
  }, [date, lat, lng, tz]);

  const dateLabel = new Date(`${date}T12:00:00Z`).toLocaleDateString(
    lang === 'km' ? 'km-KH' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  );

  const onShare = async () => {
    if (!moon) return;
    setBusy(true);
    try {
      const card: ShareCardData = {
        phaseName: PHASE_NAME[lang][moon.phaseKey],
        illumination: moon.illumination,
        waxing: moon.waxing,
        lunarDay: moon.lunarDay,
        khmerLine: lang === 'km' ? moon.khmerLunar.formattedKm : moon.khmerLunar.formattedEn,
        gregorianLabel: dateLabel,
        footer: location.host,
        lang,
      };
      await shareResult(card, location.href);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 py-10">
        <div className="glass animate-fadeup w-full rounded-[28px] p-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aurora-cyan">
            🌙 {t('appName')}
          </p>
          <p className="mt-1 text-xs text-muted">{dateLabel}</p>

          {moon ? (
            <>
              <div className="my-4 flex justify-center">
                <div className="animate-float">
                  <MoonOrb illumination={moon.illumination} waxing={moon.waxing} size={240} />
                </div>
              </div>
              <h1 className="font-sans text-[28px] font-extrabold tracking-tight">
                <span className="gradient-text animate-sheen">{PHASE_NAME[lang][moon.phaseKey]}</span>
              </h1>
              <p
                className={`mx-auto mt-3 max-w-sm text-base font-semibold text-moonglow ${
                  lang === 'km' ? 'font-khmer' : ''
                }`}
              >
                {lang === 'km' ? moon.khmerLunar.formattedKm : moon.khmerLunar.formattedEn}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <button onClick={onMakeYours} className="btn-primary w-full">
                  {t('makeYours')}
                </button>
                <button onClick={onShare} disabled={busy} className="btn-ghost w-full">
                  {busy ? '…' : `✨ ${t('share')}`}
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 text-muted">{t('loading')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
