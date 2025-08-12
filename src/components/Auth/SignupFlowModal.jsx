'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../../app/login/login.css';

export default function SignupFlowModal({ onClose }) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  function handleClose() {
    if (onClose) onClose();
  }

  const isDisabled = !name || !email || !month || !day || !year;

  const months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => String(currentYear - i));

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button aria-label="Close" className="modal-close" onClick={handleClose}>×</button>
        <div className="modal-content signup-flow">
          <div className="modal-logo" aria-hidden>
            <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>
          <h1 className="modal-title" style={{ textAlign: 'left' }}>Create your account</h1>

          <div className="form-group">
            <input
              id="sf-name"
              className="modal-input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              id="sf-email"
              className="modal-input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="section-block">
            <div className="section-title">Date of birth</div>
            <div className="section-subtext">
              This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
            </div>
            <div className="inline-row">
              <select className="modal-input" value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Month</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select className="modal-input" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="">Day</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="modal-input" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <button className="primary-btn" type="button" disabled={isDisabled} onClick={() => router.push('/signup/create')}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 