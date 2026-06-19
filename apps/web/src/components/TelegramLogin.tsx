import { useEffect, useRef } from 'react';

const BOT = import.meta.env.VITE_TELEGRAM_BOT ?? '';

export const telegramEnabled = !!BOT;

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface Props {
  onAuth: (user: TelegramUser) => void;
}

export function TelegramLogin({ onAuth }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onAuth);
  cb.current = onAuth;

  useEffect(() => {
    if (!BOT || !ref.current) return;
    (window as any).onTelegramAuth = (user: TelegramUser) => cb.current(user);

    const s = document.createElement('script');
    s.src = 'https://telegram.org/js/telegram-widget.js?22';
    s.async = true;
    s.setAttribute('data-telegram-login', BOT);
    s.setAttribute('data-size', 'large');
    s.setAttribute('data-radius', '20');
    s.setAttribute('data-request-access', 'write');
    s.setAttribute('data-onauth', 'onTelegramAuth(user)');
    ref.current.innerHTML = '';
    ref.current.appendChild(s);
  }, []);

  if (!BOT) return null;
  return <div ref={ref} className="flex justify-center" />;
}
