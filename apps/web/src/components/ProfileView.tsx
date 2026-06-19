import { useState } from 'react';
import type { Category, Lang, Profile } from '../types';
import { api } from '../api';
import { CITIES } from '../cities';
import { CATEGORY_ICON, CATEGORY_LABEL, makeT } from '../i18n';
import { DateWheel, formatHumanDate } from './DateWheel';
import { TelegramLogin, telegramEnabled, type TelegramUser } from './TelegramLogin';

const CATEGORIES: Category[] = ['haircut', 'garden', 'health', 'finance', 'love'];

interface Props {
  profile: Profile;
  lang: Lang;
  onSaved: (p: Profile) => void;
  onSignOut: () => void;
  onTelegram: (user: TelegramUser) => void;
}

export function ProfileView({ profile, lang, onSaved, onSignOut, onTelegram }: Props) {
  const t = makeT(lang);
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? '');
  const [pickDate, setPickDate] = useState(false);
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
    <div className="space-y-4 pb-28">
      {telegramEnabled && (
        <div className="glass rounded-[24px] p-5">
          {profile.authSub ? (
            <div className="flex items-center gap-3">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-10 w-10 rounded-full" />
              ) : (
                <span className="text-2xl">✅</span>
              )}
              <div>
                <div className="text-sm font-semibold text-moonglow">{t('signedIn')}</div>
                <div className="text-xs text-muted">
                  {profile.username ? `@${profile.username}` : 'Telegram'}
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-muted">{t('syncHint')}</p>
              <TelegramLogin onAuth={onTelegram} />
            </>
          )}
        </div>
      )}

      <div className="glass rounded-[24px] p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          {t('edit')}
        </h2>
        <div className="space-y-5">
          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink/80">{t('yourName')}</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>

          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink/80">{t('birthDate')}</div>
            <button type="button" onClick={() => setPickDate(true)} className="field-btn">
              <span className={birthDate ? 'text-ink' : 'text-muted/70'}>
                {birthDate ? formatHumanDate(birthDate, lang) : t('pickDate')}
              </span>
              <span className="text-lg">🗓️</span>
            </button>
          </label>

          <label className="block">
            <div className="mb-2 text-sm font-medium text-ink/80">{t('city')}</div>
            <div className="relative">
              <select
                value={cityIdx}
                onChange={(e) => setCityIdx(Number(e.target.value))}
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
          </label>

          <div>
            <div className="mb-2 text-sm font-medium text-ink/80">{t('interests')}</div>
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
