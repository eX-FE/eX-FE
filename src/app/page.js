"use client";

import { useState } from 'react';
import Image from 'next/image';
import './login/login.css';
import AuthModal from '../components/Auth/AuthModal';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="landing">
      <div className="landing-left">
        <Image className="landing-logo landing-logo-light" src="/x-logo.svg" alt="X" width={320} height={320} priority />
        <Image className="landing-logo landing-logo-dark" src="/x-logo-white.png" alt="X" width={320} height={320} priority />
      </div>
      <div className="landing-right">
        <div className="landing-title">Happening now</div>
        <div className="landing-subtitle">Join today.</div>

        <div className="landing-body">
          {/* Placeholder Google one-tap row */}
          <div className="oauth-row">
            <div className="oauth-google">Google one-tap (placeholder)</div>
          </div>

          <button className="oauth-apple" type="button"> Sign up with Apple</button>

          <div className="divider"><span>OR</span></div>

          <a className="primary-btn btn-link" href="/signup">Create account</a>

          <div className="landing-already">Already have an account?</div>
          <button className="secondary-btn btn-link" onClick={() => setShowLogin(true)}>Sign in</button>
        </div>
      </div>

      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
