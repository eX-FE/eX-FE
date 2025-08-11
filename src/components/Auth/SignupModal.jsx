'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../../app/login/login.css';
import GoogleSignIn from './GoogleSignIn';

export default function SignupModal({ onClose }) {
  const router = useRouter();
  function handleClose() {
    if (onClose) onClose();
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button aria-label="Close" className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-content">
          <div className="modal-logo" aria-hidden>
            <Image src="/x-logo.svg" alt="X" width={28} height={28} priority />
          </div>
          <h1 className="modal-title">Join X today</h1>

          <div className="oauth-row">
            <GoogleSignIn />
          </div>

          <button className="oauth-apple" type="button"> Sign up with Apple</button>

          <div className="divider"><span>or</span></div>

          <a href="/signup/create" className="primary-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', lineHeight: '44px' }}>
            Create account
          </a>

          <p className="legal-text">
            By signing up, you agree to the <a className="link" href="#">Terms of Service</a> and <a className="link" href="#">Privacy Policy</a>, including <a className="link" href="#">Cookie Use</a>.
          </p>

          <div className="modal-footer">
            Have an account already? <a className="link" href="/login">Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
} 