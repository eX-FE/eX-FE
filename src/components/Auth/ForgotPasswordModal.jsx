'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../app/login/login.css';

export default function ForgotPasswordModal({ onClose }) {
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
            <Image className="modal-logo-light" src="/x-logo-white.png" alt="X" width={26} height={26} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>
          <h1 className="modal-title" style={{ textAlign: 'left' }}>Find your X account</h1>
          <p className="legal-text" style={{ marginTop: 0, marginBottom: 16 }}>
            Enter the email, phone number, or username associated with your account to change your password.
          </p>

          <input
            className="modal-input"
            type="text"
            placeholder="Email, phone number, or username"
          />

          <button className="primary-btn" type="button" style={{ marginTop: 40 }} onClick={() => router.push('/login')}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 