const PROFILE_KEY = 'luna.profileId';
const LANG_KEY = 'luna.lang';

export const store = {
  getProfileId: (): string | null => localStorage.getItem(PROFILE_KEY),
  setProfileId: (id: string) => localStorage.setItem(PROFILE_KEY, id),
  clearProfile: () => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LANG_KEY);
  },
  getLang: (): string | null => localStorage.getItem(LANG_KEY),
  setLang: (lang: string) => localStorage.setItem(LANG_KEY, lang),
};
