import { useEffect, useState } from 'react';
import type { Compatibility, DailyFortune, Lang } from '../types';
import { api, compatShareLink, fortuneShareLink } from '../api';
import { makeT } from './../i18n';
import { DateWheel } from './DateWheel';
import { LangToggle } from './Onboarding';
import { Starfield } from './Starfield';
import { buildCompatImage, buildFortuneImage } from '../lib/shareImage';
import { shareImage } from '../lib/share';
import { num } from '../lib/loc';

const BIRTH_KEY = 'luna.birth';

function todayLocal(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(
    n.getDate(),
  ).padStart(2, '0')}`;
}

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  onFullCalendar: (birth?: string) => void;
}

export function FortuneLanding({ lang, onLang, onFullCalendar }: Props) {
  const t = makeT(lang);
  const [birth, setBirth] = useState<string>(() => localStorage.getItem(BIRTH_KEY) || '');
  const [pickBirth, setPickBirth] = useState(false);
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [loading, setLoading] = useState(false);

  // compatibility sub-flow
  const [pickPartner, setPickPartner] = useState(false);
  const [compat, setCompat] = useState<Compatibility | null>(null);

  const load = (b: string) => {
    setLoading(true);
    api
      .fortune(b, todayLocal(), lang)
      .then(setFortune)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (birth) load(birth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const onBirth = (d: string) => {
    setBirth(d);
    localStorage.setItem(BIRTH_KEY, d);
    setPickBirth(false);
    load(d);
  };

  const onPartner = async (d: string) => {
    setPickPartner(false);
    const c = await api.compat(birth, d, lang);
    setCompat(c);
  };

  const shareF = async () => {
    if (!fortune) return;
    const blob = await buildFortuneImage({
      animalEmoji: fortune.animal.emoji,
      yearLabel: `${t('yearOfThe')} ${lang === 'km' ? fortune.animal.km : fortune.animal.en}`,
      score: fortune.score,
      luckyNumber: String(fortune.luckyNumber),
      luckyColorName: fortune.luckyColor.name,
      luckyColorHex: fortune.luckyColor.hex,
      headline: fortune.headline,
      subs: [
        { label: t('loveScore'), value: fortune.love },
        { label: t('moneyScore'), value: fortune.money },
        { label: t('healthScore'), value: fortune.health },
      ],
      footer: location.host,
      lang,
    });
    await shareImage(blob, {
      filename: 'luna-fortune.png',
      text: lang === 'km' ? 'រាសីខ្ញុំថ្ងៃនេះ 🌙 មកមើលរបស់អ្នក!' : 'My fortune today 🌙 check yours!',
      link: fortuneShareLink(fortune, lang),
    });
  };

  const shareC = async () => {
    if (!compat) return;
    const blob = await buildCompatImage({
      aEmoji: compat.a.emoji,
      bEmoji: compat.b.emoji,
      aLabel: lang === 'km' ? compat.a.km : compat.a.en,
      bLabel: lang === 'km' ? compat.b.km : compat.b.en,
      score: compat.score,
      verdict: compat.verdict,
      footer: location.host,
      lang,
    });
    await shareImage(blob, {
      filename: 'luna-match.png',
      text: lang === 'km' ? 'យើងត្រូវគ្នា ' + compat.score + '% 💞' : `We match ${compat.score}% 💞`,
      link: compatShareLink(compat, lang),
    });
  };

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="gradient-text font-sans text-xl font-extrabold tracking-tight">🌙 {t('appName')}</div>
          <LangToggle lang={lang} onLang={onLang} />
        </div>

        {!fortune && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 text-[64px] animate-float">🌙</div>
            <h1 className="font-sans text-[40px] font-extrabold leading-[1.05] tracking-tight">
              <span className="gradient-text animate-sheen">{t('fortuneTitle')}</span>
            </h1>
            <p className="mt-3 max-w-xs text-sm text-muted">{t('fortuneSub')}</p>
            <button onClick={() => setPickBirth(true)} className="btn-primary mt-8 w-full max-w-xs">
              {t('seeFortune')}
            </button>
          </div>
        )}

        {loading && <div className="flex flex-1 items-center justify-center text-muted">{t('loading')}</div>}

        {fortune && !loading && (
          <div className="flex flex-1 flex-col">
            {/* hero result */}
            <div className="glass animate-fadeup mt-2 rounded-[28px] p-6 text-center">
              <div className="text-[72px] leading-none animate-float">{fortune.animal.emoji}</div>
              <div className="mt-1 text-lg font-bold text-moonglow">
                {t('yearOfThe')} {lang === 'km' ? fortune.animal.km : fortune.animal.en}
              </div>
              <p className={`mt-0.5 text-xs text-muted ${lang === 'km' ? 'font-khmer' : ''}`}>
                {fortune.animalTrait}
              </p>

              <div className="my-4 flex justify-center">
                <ScoreRing score={fortune.score} label={t('luck')} lang={lang} />
              </div>

              <p className={`mx-auto max-w-sm text-base font-semibold text-ink ${lang === 'km' ? 'font-khmer' : ''}`}>
                {fortune.headline}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Mini label={t('loveScore')} value={fortune.love} icon="❤️" lang={lang} />
                <Mini label={t('moneyScore')} value={fortune.money} icon="💰" lang={lang} />
                <Mini label={t('healthScore')} value={fortune.health} icon="🌿" lang={lang} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="glass-soft rounded-2xl px-3 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted">{t('luckyNumber')}</div>
                  <div className="text-2xl font-extrabold text-moonglow">{num(fortune.luckyNumber, lang)}</div>
                </div>
                <div className="glass-soft flex flex-col items-center justify-center rounded-2xl px-3 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted">{t('luckyColor')}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full" style={{ background: fortune.luckyColor.hex }} />
                    <span className={`text-sm font-bold text-moonglow ${lang === 'km' ? 'font-khmer' : ''}`}>
                      {fortune.luckyColor.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-3 space-y-2">
              <button onClick={shareF} className="btn-primary w-full">
                ✨ {t('shareFortune')}
              </button>
              <button onClick={() => setPickPartner(true)} className="btn-ghost w-full text-center">
                {t('compatibility')}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setPickBirth(true)} className="btn-ghost flex-1 text-center text-xs">
                  {t('retake')}
                </button>
                <button onClick={() => onFullCalendar(birth)} className="btn-ghost flex-1 text-center text-xs">
                  {t('fullCalendar')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DateWheel
        open={pickBirth}
        lang={lang}
        value={birth || '1998-01-01'}
        title={t('whenBorn')}
        confirmLabel={t('seeFortune')}
        onClose={() => setPickBirth(false)}
        onConfirm={onBirth}
      />
      <DateWheel
        open={pickPartner}
        lang={lang}
        value={'1998-01-01'}
        title={t('theirBirth')}
        confirmLabel={t('checkMatch')}
        onClose={() => setPickPartner(false)}
        onConfirm={onPartner}
      />

      {compat && <CompatResult compat={compat} lang={lang} onClose={() => setCompat(null)} onShare={shareC} onAgain={() => { setCompat(null); setPickPartner(true); }} />}
    </div>
  );
}

function ScoreRing({ score, label, lang }: { score: number; label: string; lang: Lang }) {
  const r = 76;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: 180, height: 180 }}>
      <svg width={180} height={180} className="-rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5ec7" />
            <stop offset="50%" stopColor="#7b5cff" />
            <stop offset="100%" stopColor="#00e0ff" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.85,.25,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[44px] font-extrabold leading-none text-moonglow">{num(score, lang)}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted">{label}</span>
      </div>
    </div>
  );
}

function Mini({ label, value, icon, lang }: { label: string; value: number; icon: string; lang: Lang }) {
  return (
    <div className="glass-soft rounded-2xl px-2 py-3">
      <div className="text-base">{icon}</div>
      <div className="text-lg font-extrabold text-moonglow">{num(value, lang)}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

function CompatResult({
  compat,
  lang,
  onClose,
  onShare,
  onAgain,
}: {
  compat: Compatibility;
  lang: Lang;
  onClose: () => void;
  onShare: () => void;
  onAgain: () => void;
}) {
  const t = makeT(lang);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative w-full max-w-sm animate-fadeup rounded-[28px] p-7 text-center">
        <div className="flex items-center justify-center gap-3 text-[56px]">
          <span>{compat.a.emoji}</span>
          <span className="text-[40px]">💞</span>
          <span>{compat.b.emoji}</span>
        </div>
        <div className="mt-1 text-sm text-muted">
          {lang === 'km' ? compat.a.km : compat.a.en} · {lang === 'km' ? compat.b.km : compat.b.en}
        </div>
        <div className="my-3 gradient-text text-[72px] font-extrabold leading-none">{num(compat.score, lang)}%</div>
        <p className={`text-base font-semibold text-ink ${lang === 'km' ? 'font-khmer' : ''}`}>{compat.verdict}</p>
        <div className="mt-6 space-y-2">
          <button onClick={onShare} className="btn-primary w-full">
            ✨ {t('share')}
          </button>
          <button onClick={onAgain} className="btn-ghost w-full text-center">
            {t('tryAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}
