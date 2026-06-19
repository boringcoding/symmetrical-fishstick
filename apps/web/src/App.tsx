import { useEffect, useMemo, useRef, useState } from 'react';
import type { Insights, Lang, Profile } from './types';
import { api } from './api';
import { store } from './store';
import { makeT } from './i18n';
import { Starfield } from './components/Starfield';
import { Onboarding, LangToggle } from './components/Onboarding';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { ProfileView } from './components/ProfileView';
import { ShareView } from './components/ShareView';
import type { TelegramUser } from './components/TelegramLogin';

type Tab = 'today' | 'calendar' | 'profile';

export function App() {
  const [lang, setLang] = useState<Lang>((store.getLang() as Lang) || 'en');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [booting, setBooting] = useState(true);
  const [tab, setTab] = useState<Tab>('today');
  const [date, setDate] = useState<string | undefined>(undefined);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const pendingUser = useRef<TelegramUser | null>(null);

  const t = makeT(lang);

  // Public share link (?share=YYYY-MM-DD&lat&lng&tz)
  const shareParams = useMemo(() => {
    const u = new URLSearchParams(location.search);
    const d = u.get('share');
    if (!d) return null;
    const num = (k: string) => (u.get(k) != null ? Number(u.get(k)) : undefined);
    return { date: d, lat: num('lat'), lng: num('lng'), tz: num('tz') };
  }, []);
  const [showShare, setShowShare] = useState(!!shareParams);

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

  // Fetch insights whenever profile/date changes.
  useEffect(() => {
    if (!profile) return;
    setLoadingInsights(true);
    api
      .insights(profile.id, date)
      .then(setInsights)
      .finally(() => setLoadingInsights(false));
  }, [profile, date]);

  const adoptProfile = (p: Profile) => {
    store.setProfileId(p.id);
    setProfile(p);
    setLang((p.language as Lang) || lang);
    setTab('today');
  };

  const onboardDone = async (p: Profile) => {
    adoptProfile(p);
    // Link the just-created profile to the Telegram account if signed in first.
    if (pendingUser.current) {
      try {
        const r = await api.telegramLogin(pendingUser.current, p.id);
        if (r.profile) setProfile(r.profile);
      } catch {
        /* ignore link failure */
      }
      pendingUser.current = null;
    }
  };

  const handleTelegram = async (user: TelegramUser) => {
    try {
      const r = await api.telegramLogin(user, store.getProfileId() ?? undefined);
      if (r.profile) {
        adoptProfile(r.profile);
        setShowShare(false);
      } else {
        // New user — keep the auth and let them complete onboarding, then link.
        pendingUser.current = user;
        setShowShare(false);
      }
    } catch {
      /* ignore */
    }
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

  const leaveShare = () => {
    setShowShare(false);
    history.replaceState(null, '', location.pathname);
  };

  if (showShare && shareParams) {
    return (
      <ShareView
        date={shareParams.date}
        lat={shareParams.lat}
        lng={shareParams.lng}
        tz={shareParams.tz}
        lang={lang}
        onLang={setLang}
        onMakeYours={leaveShare}
      />
    );
  }

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        <Starfield />
        {t('loading')}
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <Starfield />
        <Onboarding lang={lang} onLang={setLang} onDone={onboardDone} onTelegram={handleTelegram} />
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
              <div className="py-24 text-center text-muted">{t('loading')}</div>
            ) : (
              <>
                {date && (
                  <button onClick={() => setDate(undefined)} className="btn-ghost mb-3 text-xs">
                    ↩ {t('today')}
                  </button>
                )}
                <TodayView insights={insights} lang={lang} profile={profile} />
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
              onTelegram={handleTelegram}
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
