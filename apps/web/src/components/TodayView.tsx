import type { Insights, Lang } from '../types';
import { CATEGORY_ICON, CATEGORY_LABEL, PHASE_NAME, makeT } from '../i18n';
import { MoonVisual } from './MoonVisual';

interface Props {
  insights: Insights;
  lang: Lang;
}

function fmtTime(iso: string | null, lang: Lang): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString(lang === 'km' ? 'km-KH' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TodayView({ insights, lang }: Props) {
  const t = makeT(lang);
  const { moon } = insights;
  const dateLabel = new Date(`${insights.date}T12:00:00Z`).toLocaleDateString(
    lang === 'km' ? 'km-KH' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <div className="space-y-5 pb-24">
      {/* Hero */}
      <section className="glass animate-fadeup overflow-hidden rounded-3xl p-7 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold/80">{insights.greeting}</p>
        <p className="mt-1 text-xs text-white/50">{dateLabel}</p>

        <div className="my-6 flex justify-center">
          <div className="animate-float">
            <MoonVisual illumination={moon.illumination} waxing={moon.waxing} size={210} />
          </div>
        </div>

        <h1 className="font-display text-4xl font-semibold text-moon-glow">
          {PHASE_NAME[lang][moon.phaseKey]}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/70">{insights.mood}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t('illumination')} value={`${moon.illumination}%`} />
        <Stat label={t('lunarDay')} value={`${moon.lunarDay}`} />
        <Stat
          label={t('khmerDay')}
          value={`${moon.khmer.day} ${t(moon.khmer.type)}`}
          khmer
        />
        <Stat
          label={moon.waxing ? '↑' : '↓'}
          value={moon.waxing ? t('koeut') : t('roach')}
          khmer
        />
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
          <div className="glass-soft rounded-2xl p-4 text-sm text-white/50">{t('noBirth')}</div>
        )}
      </section>

      {/* Biorhythms */}
      {insights.biorhythm && (
        <section className="glass rounded-3xl p-6">
          <h2 className="mb-4 font-display text-2xl text-moon-glow">{t('biorhythms')}</h2>
          <div className="space-y-4">
            <Bio label={t('physical')} value={insights.biorhythm.physical} color="#7ee0b0" />
            <Bio label={t('emotional')} value={insights.biorhythm.emotional} color="#e8a0c8" />
            <Bio label={t('intellectual')} value={insights.biorhythm.intellectual} color="#9bb8f0" />
          </div>
        </section>
      )}

      {/* Guidance */}
      <section className="glass rounded-3xl p-6">
        <h2 className="mb-4 font-display text-2xl text-moon-glow">{t('guidance')}</h2>
        <ul className="space-y-3">
          {insights.advice.map((a, i) => (
            <li
              key={i}
              className="glass-soft flex items-start gap-3 rounded-2xl p-4 animate-fadeup"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-xl leading-none">
                {a.category === 'general' ? '🌙' : CATEGORY_ICON[a.category]}
              </span>
              <div>
                {a.category !== 'general' && (
                  <div className="text-xs font-medium uppercase tracking-wide text-gold/80">
                    {CATEGORY_LABEL[lang][a.category]}
                  </div>
                )}
                <p className="text-sm leading-relaxed text-white/85">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, khmer }: { label: string; value: string; khmer?: boolean }) {
  return (
    <div className="glass-soft rounded-2xl px-4 py-3 text-center">
      <div className="text-[11px] uppercase tracking-wide text-white/45">{label}</div>
      <div className={`mt-1 text-lg font-semibold text-moon-glow ${khmer ? 'font-khmer' : ''}`}>
        {value}
      </div>
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
        <div className="text-[11px] uppercase tracking-wide text-white/45">{title}</div>
        <div className="text-lg font-semibold text-moon-glow">{name}</div>
        <div className="text-xs text-white/50">
          {elementLabel}: {element}
        </div>
      </div>
    </div>
  );
}

function Bio({ label, value, color }: { label: string; value: number; color: string }) {
  // value -100..100 -> 0..100 width with center at 50
  const pct = (value + 100) / 2;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-medium text-white/90">{value > 0 ? `+${value}` : value}%</span>
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
