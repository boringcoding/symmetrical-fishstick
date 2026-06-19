import { useState } from 'react';
import type { Category, Lang, Profile } from '../types';
import { api } from '../api';
import { CITIES } from '../cities';
import { CATEGORY_ICON, CATEGORY_LABEL, makeT } from '../i18n';
import { MoonVisual } from './MoonVisual';

const CATEGORIES: Category[] = ['haircut', 'garden', 'health', 'finance', 'love'];

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  onDone: (p: Profile) => void;
}

export function Onboarding({ lang, onLang, onDone }: Props) {
  const t = makeT(lang);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cityIdx, setCityIdx] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cats, setCats] = useState<Category[]>(['health', 'love']);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const toggle = (c: Category) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const useLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const submit = async () => {
    if (!name.trim()) {
      setError(t('required'));
      return;
    }
    setBusy(true);
    setError('');
    const city = CITIES[cityIdx];
    const tzOffsetMin = coords ? -new Date().getTimezoneOffset() : city.tz;
    try {
      const profile = await api.createProfile({
        name: name.trim(),
        birthDate: birthDate || undefined,
        city: coords ? 'My location' : city.name,
        latitude: coords ? coords.lat : city.lat,
        longitude: coords ? coords.lng : city.lng,
        tzOffsetMin,
        language: lang,
        categories: cats,
      });
      onDone(profile);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-10">
      <div className="glass animate-fadeup rounded-3xl p-7 sm:p-9">
        <div className="mb-6 flex items-start justify-between">
          <div className="animate-float">
            <MoonVisual illumination={62} waxing size={84} />
          </div>
          <LangToggle lang={lang} onLang={onLang} />
        </div>

        <h1 className="font-display text-4xl font-semibold text-moon-glow">{t('welcome')}</h1>
        <p className="mt-1 text-sm text-white/60">{t('onboardIntro')}</p>

        <div className="mt-7 space-y-6">
          <Field label={t('yourName')}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="input"
            />
          </Field>

          <Field label={t('birthDate')} hint={t('birthHint')}>
            <input
              type="date"
              value={birthDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input"
            />
          </Field>

          <Field label={t('city')}>
            <div className="flex gap-2">
              <select
                value={cityIdx}
                onChange={(e) => {
                  setCityIdx(Number(e.target.value));
                  setCoords(null);
                }}
                className="input flex-1"
              >
                {CITIES.map((c, i) => (
                  <option key={c.name} value={i}>
                    {lang === 'km' ? `${c.km} · ${c.name}` : c.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={useLocation} className="btn-ghost whitespace-nowrap">
                📍 {t('useLocation')}
              </button>
            </div>
            {coords && (
              <p className="mt-1 text-xs text-gold/80">
                {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
              </p>
            )}
          </Field>

          <Field label={t('interests')} hint={t('interestsHint')}>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = cats.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(c)}
                    className={`chip ${active ? 'chip-on' : ''}`}
                  >
                    <span>{CATEGORY_ICON[c]}</span>
                    {CATEGORY_LABEL[lang][c]}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

        <button onClick={submit} disabled={busy} className="btn-primary mt-7 w-full">
          {busy ? '…' : t('begin')}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium text-white/80">{label}</div>
      {children}
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </label>
  );
}

export function LangToggle({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  return (
    <div className="flex overflow-hidden rounded-full border border-white/15 text-xs">
      {(['en', 'km'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onLang(l)}
          className={`px-3 py-1.5 transition ${
            lang === l ? 'bg-gold text-night-900' : 'text-white/70 hover:text-white'
          }`}
        >
          {l === 'en' ? 'EN' : 'ខ្មែរ'}
        </button>
      ))}
    </div>
  );
}
