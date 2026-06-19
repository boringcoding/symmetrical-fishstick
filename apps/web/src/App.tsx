import { useEffect, useState } from 'react';
import type { Insights, Lang, Profile } from './types';
import { api } from './api';
import { store } from './store';
import { makeT } from './i18n';
import { Starfield } from './components/Starfield';
import { Onboarding, LangToggle } from './components/Onboarding';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { ProfileView } from './components/ProfileView';

type Tab = 'today' | 'calendar' | 'profile';

export function App() {
  const [lang, setLang] = useState<Lang>((store.getLang() as Lang) || 'en');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [booting, setBooting] = useState(true);
  const [tab, setTab] = useState<Tab>('today');
  const [date, setDate] = useState<string | undefined>(undefined);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const t = makeT(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    store.setLang(lang);
  }, [lang]);

  // Load saved profile on boot.
  useEffect(() => {
    const id = store.getProfileId();
    if (!id) {
      setBooting(false);
      return;
    }
    api
      .getProfile(id)
      .then((p) => {
        setProfile(p);
        setLang((p.language as Lang) || lang);
      })
      .catch(() => store.clearProfile())
      .finally(() => setBooting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch insights whenever profile/date changes and we're on the today tab.
  useEffect(() => {
    if (!profile) return;
    setLoadingInsights(true);
    api
      .insights(profile.id, date)
      .then(setInsights)
      .finally(() => setLoadingInsights(false));
  }, [profile, date]);

  const onboardDone = (p: Profile) => {
    store.setProfileId(p.id);
    setProfile(p);
    setTab('today');
  };

  const signOut = () => {
    store.clearProfile();
    setProfile(null);
    setInsights(null);
    setDate(undefined);
    setTab('today');
  };

  const selectDay = (d: string) => {
    setDate(d);
    setTab('today');
  };

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/50">
        <Starfield />
        {t('loading')}
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <Starfield />
        <Onboarding lang={lang} onLang={setLang} onDone={onboardDone} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="mx-auto max-w-xl px-4 pt-6">
        {/* Header */}
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌙</span>
            <div>
              <div className="gradient-text font-sans text-xl font-extrabold leading-none tracking-tight">
                {t('appName')}
              </div>
              <div className="text-[11px] text-muted">{t('tagline')}</div>
            </div>
          </div>
          <LangToggle
            lang={lang}
            onLang={(l) => {
              setLang(l);
              if (profile) api.updateProfile(profile.id, { language: l }).catch(() => {});
            }}
          />
        </header>

        {/* Content */}
        <main className={lang === 'km' ? 'font-khmer' : ''}>
          {tab === 'today' &&
            (loadingInsights || !insights ? (
              <div className="py-24 text-center text-white/50">{t('loading')}</div>
            ) : (
              <>
                {date && (
                  <button
                    onClick={() => setDate(undefined)}
                    className="btn-ghost mb-3 text-xs"
                  >
                    ↩ {t('today')}
                  </button>
                )}
                <TodayView insights={insights} lang={lang} />
              </>
            ))}
          {tab === 'calendar' && (
            <CalendarView profile={profile} lang={lang} onSelectDay={selectDay} />
          )}
          {tab === 'profile' && (
            <ProfileView
              profile={profile}
              lang={lang}
              onSaved={(p) => {
                setProfile(p);
                setLang((p.language as Lang) || lang);
              }}
              onSignOut={signOut}
            />
          )}
        </main>
      </div>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-night-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl">
          {(
            [
              ['today', '🌙', t('today')],
              ['calendar', '🗓️', t('calendar')],
              ['profile', '👤', t('profile')],
            ] as [Tab, string, string][]
          ).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'today') setDate(undefined);
                setTab(key);
              }}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition ${
                tab === key ? 'text-ink' : 'text-muted'
              }`}
            >
              {tab === key && (
                <span className="absolute top-0 h-0.5 w-10 rounded-full bg-gradient-to-r from-aurora-violet to-aurora-cyan" />
              )}
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
