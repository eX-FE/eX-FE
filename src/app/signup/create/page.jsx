"use client";

import { useState } from "react";
import '../../login/login.css';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import Image from 'next/image';

export default function CreateAccountPage() {
  const router = useRouter();
  const { register, isLoading } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isDisabled = !username || (password?.length || 0) < 8;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isDisabled) return;
    try {
      // Minimal data to complete registration; name/email can be refined later in profile
      const name = username;
      const email = `${username}@example.com`;
      await register({ name, username, email, password });
      router.push('/profile');
    } catch (err) {
      // no-op for now
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="modal-content create-flow" style={{ width: '75%' }}>
          <div className="modal-logo" aria-hidden>
            <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>

          <h1 className="modal-title" style={{ textAlign: 'left' }}>What should we call you?</h1>
          <p className="legal-text" style={{ marginTop: 0, marginBottom: 10 }}>Your @username is unique. You can always change it later.</p>

          <form onSubmit={handleSubmit} className="login-form" style={{ gap: 16 }}>
            <div className="form-group">
              <input
                className="modal-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <h2 className="section-title" style={{ fontSize: 24, marginTop: 8 }}>You'll need a password</h2>
            <p className="legal-text" style={{ marginTop: -6, marginBottom: 6 }}>Make sure it's 8 characters or more.</p>

            <div className="form-group">
              <input
                className="modal-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

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