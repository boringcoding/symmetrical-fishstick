import type { Insights, MoonDay, Profile } from './types';
import type { TelegramUser } from './components/TelegramLogin';

export interface AuthResult {
  profile: Profile | null;
  prefill: { name: string | null; username: string | null; avatarUrl: string | null } | null;
}

// In production the static site is served separately from the API, so the API
// base URL is injected at build time via VITE_API_URL. In dev we proxy /api.
// Accept a bare hostname (e.g. Render's fromService host) and add the scheme.
function resolveBase(): string {
  let raw = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/$/, '');
  if (raw && !/^https?:\/\//.test(raw)) raw = `https://${raw}`;
  return raw;
}
const BASE = resolveBase();

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface CreateProfileInput {
  name: string;
  birthDate?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  tzOffsetMin?: number;
  language?: string;
  categories?: string[];
}

export const api = {
  createProfile: (input: CreateProfileInput) =>
    http<Profile>('/api/profiles', { method: 'POST', body: JSON.stringify(input) }),

  updateProfile: (id: string, input: Partial<CreateProfileInput>) =>
    http<Profile>(`/api/profiles/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),

  getProfile: (id: string) => http<Profile>(`/api/profiles/${id}`),

  insights: (profileId: string, date?: string) =>
    http<Insights>(`/api/insights/${profileId}${date ? `?date=${date}` : ''}`),

  telegramLogin: (user: TelegramUser, linkProfileId?: string) =>
    http<AuthResult>('/api/auth/telegram', {
      method: 'POST',
      body: JSON.stringify({ ...user, linkProfileId }),
    }),

  moonDay: (date: string, lat?: number, lng?: number, tz?: number) => {
    const params = new URLSearchParams({ date });
    if (lat != null) params.set('lat', String(lat));
    if (lng != null) params.set('lng', String(lng));
    if (tz != null) params.set('tz', String(tz));
    return http<MoonDay>(`/api/moon/day?${params.toString()}`);
  },

  month: (year: number, month: number, lat?: number, lng?: number, tz?: number) => {
    const params = new URLSearchParams({ year: String(year), month: String(month) });
    if (lat != null) params.set('lat', String(lat));
    if (lng != null) params.set('lng', String(lng));
    if (tz != null) params.set('tz', String(tz));
    return http<MoonDay[]>(`/api/moon/month?${params.toString()}`);
  },
};
