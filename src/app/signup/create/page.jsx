"use client";

import { useState } from "react";
import '../../login/login.css';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import { useSignup } from '../../../context/SignupContext';
import Image from 'next/image';

export default function CreateAccountPage() {
  const router = useRouter();
  const { register, isLoading } = useUser();
  const { name, email, reset } = useSignup();

  // Store username WITHOUT '@' and render a visual gray prefix instead
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const isDisabled = !(username && username.trim().length > 0) || (password?.length || 0) < 8;

  function handleUsernameChange(e) {
    // Strip any leading '@' the user might type and trim spaces
    const next = (e.target.value || '').replace(/^@+/, '').trimStart();
    setUsername(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isDisabled) return;
    try {
      setError(null);
      if ((password?.length || 0) < 8) {
        setError('Password should be at least 8 characters');
        return;
      }
      const cleanUsername = username.trim();
      const safeName = name?.trim() || cleanUsername;
      const safeEmail = email?.trim() || `${cleanUsername}@example.com`;
      await register({ name: safeName, username: cleanUsername, email: safeEmail, password });
      reset();
      router.push('/profile');
    } catch (err) {
      setError(err?.message || 'Sign up failed');
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="modal-content create-flow" style={{ width: '75%' }}>
          <div className="modal-logo" aria-hidden>
            <Image className="modal-logo-light" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>

          <h1 className="modal-title" style={{ textAlign: 'left' }}>What should we call you?</h1>
          <p className="legal-text" style={{ marginTop: 0, marginBottom: 10 }}>Your @username is unique. You can always change it later.</p>

          <form onSubmit={handleSubmit} className="login-form" style={{ gap: 16 }}>
            <div className="form-group input-wrap">
              <span className="input-prefix">@</span>
              <input
                className="modal-input with-prefix"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <h2 className="section-title" style={{ fontSize: 24, marginTop: 8 }}>You'll need a password</h2>
            <p className="legal-text" style={{ marginTop: -6, marginBottom: 6 }}>Make sure it's 8 characters or more.</p>

            <div className="form-group input-wrap">
              <input
                className="modal-input with-suffix"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-suffix"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? (
                  // eye-off icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-6.06" />
                    <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 3-3 3 3 0 0 0-.42-1.54" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  // eye icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && <div className="error-text">{error}</div>}

            <p className="legal-text" style={{ marginTop: 6 }}>
              By signing up, you agree to the <a className="link" href="#">Terms of Service</a> and <a className="link" href="#">Privacy Policy</a>, including <a className="link" href="#">Cookie Use</a>.
            </p>

            <button className="primary-btn" type="submit" disabled={isDisabled || isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 