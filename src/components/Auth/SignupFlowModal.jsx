'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../../app/login/login.css';

export default function SignupFlowModal({ onClose }) {
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
          <h1 className="modal-title" style={{ textAlign: 'left' }}>Create your account</h1>

          <div className="form-group">
            <label className="form-label" htmlFor="sf-name">Name</label>
            <input id="sf-name" className="modal-input" placeholder="" />
            <div className="input-hint">0 / 50</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sf-contact">Email</label>
            <input id="sf-contact" className="modal-input" placeholder="" />
          </div>

          <div className="section-block">
            <div className="section-title">Date of birth</div>
            <div className="section-subtext">
              This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
            </div>
            <div className="inline-row">
              <select className="modal-input"><option>Month</option></select>
              <select className="modal-input"><option>Day</option></select>
              <select className="modal-input"><option>Year</option></select>
            </div>
          </div>

          <button className="primary-btn" type="button" onClick={() => router.push('/signup/create')}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 