import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

export const googleEnabled = !!CLIENT_ID;

interface Props {
  onCredential: (idToken: string) => void;
  text?: 'signin_with' | 'continue_with';
}

export function GoogleSignIn({ onCredential, text = 'continue_with' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    const SCRIPT_ID = 'gsi-client';

    const init = () => {
      if (!window.google?.accounts?.id || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp: { credential: string }) => onCredential(resp.credential),
      });
      ref.current.innerHTML = '';
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text,
        width: 300,
        logo_alignment: 'center',
      });
    };

    if (document.getElementById(SCRIPT_ID)) {
      init();
    } else {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.id = SCRIPT_ID;
      s.onload = init;
      document.head.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) return null;
  return <div ref={ref} className="flex justify-center" />;
}
