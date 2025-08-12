'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import '../../app/login/login.css';
import GoogleSignIn from './GoogleSignIn';

export default function AuthModal({ onClose }) {
  const router = useRouter();
  const { login, isLoading } = useUser();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email: formData.identifier, password: formData.password });
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  function handleClose() {
    if (onClose) onClose();
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button aria-label="Close" className="modal-close" onClick={handleClose}>
          ×
        </button>
        <div className="modal-content">
          <div className="modal-logo" aria-hidden>
            <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>
          <h1 className="modal-title">Sign in to X</h1>

          <div className="oauth-row">
            <GoogleSignIn />
          </div>

          <button className="oauth-apple" type="button"> Sign in with Apple</button>

          <div className="divider">
            <span>or</span>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <input
              className="modal-input"
              type="text"
              name="identifier"
              placeholder="Phone, email, or username"
              value={formData.identifier}
              onChange={handleInputChange}
              required
            />
            <input
              className="modal-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {error && <div className="error-text" style={{ marginTop: 6 }}>{error}</div>}

            <button className="primary-btn" type="submit" disabled={isLoading}>
              {isLoading ? 'Loading…' : 'Next'}
            </button>
          </form>

          <button className="secondary-btn" type="button" onClick={() => router.push('/flow/password_reset')}>
            Forgot password?
          </button>

          <div className="modal-footer">
            Don't have an account? <a className="link" href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
} 