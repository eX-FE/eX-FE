'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';

export default function GoogleSignIn({ onSuccess }) {
  const { loginWithGoogle } = useUser();
  const btnRef = useRef(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[GoogleSignIn] NEXT_PUBLIC_GOOGLE_CLIENT_ID:', clientId || '(undefined)');
    }
    if (!clientId) return;

    function ensureScript() {
      return new Promise((resolve) => {
        if (window.google?.accounts?.id) return resolve();
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    let cancelled = false;

    ensureScript().then(() => {
      if (cancelled || !btnRef.current) return;

      // Pick theme based on color scheme
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = isDark ? 'filled_black' : 'outline';

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response?.credential) return;
          try {
            await loginWithGoogle(response.credential);
            if (onSuccess) {
              onSuccess();
            }
          } catch {}
        },
      });

      // Clear container before rendering
      btnRef.current.innerHTML = '';

      const width = btnRef.current.clientWidth || 360;
      window.google.accounts.id.renderButton(btnRef.current, {
        theme,
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width,
        logo_alignment: 'left',
      });
    });

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle]);

  return <div className="oauth-google" ref={btnRef} />;
} 