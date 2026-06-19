import { useState } from 'react';
import type { Insights, Lang, Profile } from '../types';
import { CATEGORY_ICON, CATEGORY_LABEL, PHASE_NAME, makeT } from '../i18n';
import { MoonOrb } from './MoonOrb';
import { buildShareLink, copyLink, shareResult } from '../lib/share';
import type { ShareCardData } from '../lib/shareImage';

interface Props {
  insights: Insights;
  lang: Lang;
  profile?: Profile;
}

function fmtTime(iso: string | null, lang: Lang): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString(lang === 'km' ? 'km-KH' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TodayView({ insights, lang, profile }: Props) {
  const t = makeT(lang);
  const { moon } = insights;
  const kh = moon.khmerLunar;
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const dateLabel = new Date(`${insights.date}T12:00:00Z`).toLocaleDateString(
    lang === 'km' ? 'km-KH' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  );

  const card = (): ShareCardData => ({
    phaseName: PHASE_NAME[lang][moon.phaseKey],
    illumination: moon.illumination,
    waxing: moon.waxing,
    lunarDay: moon.lunarDay,
    khmerLine: lang === 'km' ? kh.formattedKm : kh.formattedEn,
    gregorianLabel: dateLabel,
    signSymbol: insights.moonSign?.symbol,
    signName: insights.moonSign ? (lang === 'km' ? insights.moonSign.km : insights.moonSign.en) : '',
    caption: `${insights.greeting} · ${PHASE_NAME[lang][moon.phaseKey]}`,
    footer: location.host,
    lang,
  });

  const link = () =>
    buildShareLink({
      date: insights.date,
      lat: profile?.latitude,
      lng: profile?.longitude,
      tz: profile?.tzOffsetMin,
    });

  const onShare = async () => {
    setBusy(true);
    try {
      const r = await shareResult(card(), link());
      if (r === 'downloaded') flash(t('imageSaved'));
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    if (await copyLink(link())) flash(t('linkCopied'));
  };

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Hero */}
      <section className="glass animate-fadeup overflow-hidden rounded-[28px] p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aurora-cyan">
          {insights.greeting}
        </p>
        <p className="mt-1 text-xs text-muted">{dateLabel}</p>

        <div className="my-3 flex justify-center">
          <div className="animate-float">
            <MoonOrb illumination={moon.illumination} waxing={moon.waxing} size={260} />
          </div>
        </div>

        <h1 className="font-sans text-[30px] font-extrabold tracking-tight">
          <span className="gradient-text animate-sheen">{PHASE_NAME[lang][moon.phaseKey]}</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/75">{insights.mood}</p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button onClick={onShare} disabled={busy} className="btn-primary flex-1 max-w-[220px]">
            {busy ? '…' : `✨ ${t('share')}`}
          </button>
          <button onClick={onCopy} className="btn-ghost" aria-label={t('copyLink')}>
            🔗
          </button>
        </div>
        {toast && <p className="mt-2 text-xs text-aurora-cyan">{toast}</p>}
      </section>

      {/* Khmer traditional date — the real Chhankitek calendar */}
      <section className="glass animate-fadeup rounded-[24px] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t('traditionalDate')}
          </h2>
          <span className="text-lg">🌙</span>
        </div>
        <p
          className={`text-lg font-semibold leading-snug text-moonglow ${
            lang === 'km' ? 'font-khmer' : ''
          }`}
        >
          {lang === 'km' ? kh.formattedKm : kh.formattedEn}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <KhChip
            main={`${kh.day} ${lang === 'km' ? kh.moonPhaseKm : kh.moonPhaseEn}`}
            sub={lang === 'km' ? 'ថ្ងៃ' : 'lunar day'}
            khmer={lang === 'km'}
          />
          <KhChip
            main={lang === 'km' ? kh.monthKm : kh.monthEn}
            sub={kh.isLeapMonth ? t('leapMonth') : lang === 'km' ? 'ខែ' : 'month'}
            khmer={lang === 'km'}
            highlight={kh.isLeapMonth}
          />
          <KhChip
            main={lang === 'km' ? kh.animalKm : kh.animalEn}
            sub={lang === 'km' ? 'ឆ្នាំ' : 'animal year'}
            khmer={lang === 'km'}
          />
          <KhChip main={lang === 'km' ? kh.sakKm : kh.sakEn} sub={t('era')} khmer={lang === 'km'} />
          <KhChip main={`${kh.beYear}`} sub={t('buddhistEra')} />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        <Stat label={t('illumination')} value={`${moon.illumination}%`} />
        <Stat label={t('lunarDay')} value={`${moon.lunarDay}`} />
        <Stat label={t('moonSign')} value={signSymbol(insights)} />
      </section>

      {(moon.moonrise || moon.moonset) && (
        <section className="grid grid-cols-2 gap-3">
          <Stat label={t('moonrise')} value={`🌖 ${fmtTime(moon.moonrise, lang)}`} />
          <Stat label={t('moonset')} value={`🌒 ${fmtTime(moon.moonset, lang)}`} />
        </section>
      )}

      {/* Signs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {insights.moonSign && (
          <SignCard
            title={t('moonSign')}
            symbol={insights.moonSign.symbol}
            name={lang === 'km' ? insights.moonSign.km : insights.moonSign.en}
            element={t(insights.moonSign.element)}
            elementLabel={t('element')}
          />
        )}
        {insights.sunSign ? (
          <SignCard
            title={t('sunSign')}
            symbol={insights.sunSign.symbol}
            name={lang === 'km' ? insights.sunSign.km : insights.sunSign.en}
            element={t(insights.sunSign.element)}
            elementLabel={t('element')}
          />
        ) : (
          <div className="glass-soft rounded-2xl p-4 text-sm text-muted">{t('noBirth')}</div>
        )}
      </section>

      {/* Biorhythms */}
      {insights.biorhythm && (
        <section className="glass rounded-[24px] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            {t('biorhythms')}
          </h2>
          <div className="space-y-4">
            <Bio label={t('physical')} value={insights.biorhythm.physical} color="#7ee0b0" />
            <Bio label={t('emotional')} value={insights.biorhythm.emotional} color="#ff5ec7" />
            <Bio label={t('intellectual')} value={insights.biorhythm.intellectual} color="#7b5cff" />
          </div>
        </section>
      )}

      {/* Guidance */}
      <section className="glass rounded-[24px] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          {t('guidance')}
        </h2>
        <ul className="space-y-3">
          {insights.advice.map((a, i) => (
            <li
              key={i}
              className="glass-soft flex animate-fadeup items-start gap-3 rounded-2xl p-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-xl leading-none">
                {a.category === 'general' ? '🌙' : CATEGORY_ICON[a.category]}
              </span>
              <div>
                {a.category !== 'general' && (
                  <div className="text-xs font-semibold uppercase tracking-wide text-gold/85">
                    {CATEGORY_LABEL[lang][a.category]}
                  </div>
                )}
                <p className="text-sm leading-relaxed text-ink/85">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function signSymbol(insights: Insights): string {
  return insights.moonSign?.symbol ?? '—';
}

function KhChip({
  main,
  sub,
  khmer,
  highlight,
}: {
  main: string;
  sub: string;
  khmer?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-3.5 py-2 ${
        highlight ? 'border-gold/60 bg-gold/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <div className={`text-sm font-semibold text-moonglow ${khmer ? 'font-khmer' : ''}`}>{main}</div>
      <div className={`text-[10px] uppercase tracking-wide text-muted ${khmer ? 'font-khmer' : ''}`}>
        {sub}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-soft rounded-2xl px-3 py-3 text-center">
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-lg font-bold text-moonglow">{value}</div>
    </div>
  );
}

function SignCard({
  title,
  symbol,
  name,
  element,
  elementLabel,
}: {
  title: string;
  symbol: string;
  name: string;
  element: string;
  elementLabel: string;
}) {
  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-5">
      <div className="text-4xl text-gold">{symbol}</div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted">{title}</div>
        <div className="text-lg font-bold text-moonglow">{name}</div>
        <div className="text-xs text-muted">
          {elementLabel}: {element}
        </div>
      </div>
    </div>
  );
}

function Bio({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = (value + 100) / 2;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-ink/70">{label}</span>
        <span className="font-semibold text-ink/90">{value > 0 ? `+${value}` : value}%</span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/25" />
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
        />
      </div>
    </div>
  );
}
