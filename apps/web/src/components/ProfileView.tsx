import { useState } from 'react';
import type { Category, Lang, Profile } from '../types';
import { api } from '../api';
import { CITIES } from '../cities';
import { CATEGORY_ICON, CATEGORY_LABEL, makeT } from '../i18n';

const CATEGORIES: Category[] = ['haircut', 'garden', 'health', 'finance', 'love'];

interface Props {
  profile: Profile;
  lang: Lang;
  onSaved: (p: Profile) => void;
  onSignOut: () => void;
}

export function ProfileView({ profile, lang, onSaved, onSignOut }: Props) {
  const t = makeT(lang);
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? '');
  const matchedCity = CITIES.findIndex((c) => c.name === profile.city);
  const [cityIdx, setCityIdx] = useState(matchedCity >= 0 ? matchedCity : 0);
  const [cats, setCats] = useState<Category[]>((profile.categories as Category[]) ?? []);
  const [busy, setBusy] = useState(false);

  const toggle = (c: Category) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const save = async () => {
    setBusy(true);
    const city = CITIES[cityIdx];
    try {
      const updated = await api.updateProfile(profile.id, {
        name: name.trim() || profile.name,
        birthDate: birthDate || undefined,
        city: city.name,
        latitude: city.lat,
        longitude: city.lng,
        tzOffsetMin: city.tz,
        language: lang,
        categories: cats,
      });
      onSaved(updated);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="glass rounded-3xl p-6">
        <h2 className="mb-5 font-display text-2xl text-moon-glow">{t('edit')}</h2>
        <div className="space-y-5">
          <label className="block">
            <div className="mb-1.5 text-sm font-medium text-white/80">{t('yourName')}</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <label className="block">
            <div className="mb-1.5 text-sm font-medium text-white/80">{t('birthDate')}</div>
            <input
              type="date"
              value={birthDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <div className="mb-1.5 text-sm font-medium text-white/80">{t('city')}</div>
            <select
              value={cityIdx}
              onChange={(e) => setCityIdx(Number(e.target.value))}
              className="input"
            >
              {CITIES.map((c, i) => (
                <option key={c.name} value={i}>
                  {lang === 'km' ? `${c.km} · ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </label>
          <div>
            <div className="mb-1.5 text-sm font-medium text-white/80">{t('interests')}</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(c)}
                  className={`chip ${cats.includes(c) ? 'chip-on' : ''}`}
                >
                  <span>{CATEGORY_ICON[c]}</span>
                  {CATEGORY_LABEL[lang][c]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={save} disabled={busy} className="btn-primary mt-6 w-full">
          {busy ? '…' : t('save')}
        </button>
      </div>

      <button
        onClick={onSignOut}
        className="w-full rounded-2xl border border-rose-400/30 px-4 py-3 text-sm text-rose-200/80 transition hover:bg-rose-400/10"
      >
        {t('signOut')}
      </button>
    </div>
  );
}
