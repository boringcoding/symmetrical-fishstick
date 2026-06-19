import { useState } from 'react';
import type { Category, Lang, Profile } from '../types';
import { api } from '../api';
import { CITIES } from '../cities';
import { CATEGORY_ICON, CATEGORY_LABEL, makeT } from '../i18n';
import { MoonOrb } from './MoonOrb';
import { DateWheel, formatHumanDate } from './DateWheel';
import { GoogleSignIn, googleEnabled } from './GoogleSignIn';

const CATEGORIES: Category[] = ['haircut', 'garden', 'health', 'finance', 'love'];

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  onDone: (p: Profile) => void;
  onGoogle: (idToken: string) => void;
}

export function Onboarding({ lang, onLang, onDone, onGoogle }: Props) {
  const t = makeT(lang);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [pickDate, setPickDate] = useState(false);
  const [cityIdx, setCityIdx] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cats, setCats] = useState<Category[]>(['health', 'love']);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const toggle = (c: Category) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const useLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) =>
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    );
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
      <div className="glass animate-fadeup rounded-[28px] p-6 sm:p-8">
        <div className="mb-5 flex items-start justify-between">
          <div className="-ml-2 -mt-2 animate-float">
            <MoonOrb illumination={62} waxing size={120} />
          </div>
          <LangToggle lang={lang} onLang={onLang} />
        </div>

        <h1 className="font-sans text-[34px] font-extrabold leading-[1.05] tracking-tight">
          <span className="gradient-text animate-sheen">{t('welcome')}</span>
        </h1>
        <p className="mt-2 text-sm text-muted">{t('onboardIntro')}</p>

        {googleEnabled && (
          <div className="mt-5">
            <GoogleSignIn onCredential={onGoogle} />
            <div className="my-4 flex items-center gap-3 text-xs text-muted/70">
              <span className="h-px flex-1 bg-white/10" />
              {lang === 'km' ? 'ឬ' : 'or'}
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        )}

        <div className="mt-2 space-y-5">
          <Field label={t('yourName')}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="input"
            />
          </Field>

          <Field label={t('birthDate')} hint={t('birthHint')}>
            <button type="button" onClick={() => setPickDate(true)} className="field-btn">
              <span className={birthDate ? 'text-ink' : 'text-muted/70'}>
                {birthDate ? formatHumanDate(birthDate, lang) : t('pickDate')}
              </span>
              <span className="text-lg">🗓️</span>
            </button>
          </Field>

          <Field label={t('city')}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={cityIdx}
                  onChange={(e) => {
                    setCityIdx(Number(e.target.value));
                    setCoords(null);
                  }}
                  className="input appearance-none pr-10"
                >
                  {CITIES.map((c, i) => (
                    <option key={c.name} value={i} className="bg-night-800">
                      {lang === 'km' ? `${c.km} · ${c.name}` : c.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                  ▾
                </span>
              </div>
              <button type="button" onClick={useLocation} className="btn-ghost whitespace-nowrap">
                📍
              </button>
            </div>
            {coords && (
              <p className="mt-1.5 text-xs text-aurora-cyan/80">
                {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
              </p>
            )}
          </Field>

          <Field label={t('interests')} hint={t('interestsHint')}>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggle(c)}
                  className={`chip ${cats.includes(c) ? 'chip-on' : ''}`}
                >
                  <span>{CATEGORY_ICON[c]}</span>
                  {CATEGORY_LABEL[lang][c]}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

        <button onClick={submit} disabled={busy} className="btn-primary mt-7 w-full">
          {busy ? '…' : t('begin')}
        </button>
      </div>

      <DateWheel
        open={pickDate}
        lang={lang}
        value={birthDate || '1998-01-01'}
        title={t('birthDate')}
        confirmLabel={t('save')}
        onClose={() => setPickDate(false)}
        onConfirm={(d) => {
          setBirthDate(d);
          setPickDate(false);
        }}
      />
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
      <div className="mb-2 text-sm font-medium text-ink/80">{label}</div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted/80">{hint}</p>}
    </label>
  );
}

export function LangToggle({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  return (
    <div className="flex overflow-hidden rounded-full border border-white/12 bg-white/5 p-0.5 text-xs">
      {(['en', 'km'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onLang(l)}
          className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
            lang === l ? 'bg-gradient-to-r from-aurora-violet to-aurora-cyan text-night-950' : 'text-muted hover:text-ink'
          }`}
        >
          {l === 'en' ? 'EN' : 'ខ្មែរ'}
        </button>
      ))}
    </div>
  );
}
