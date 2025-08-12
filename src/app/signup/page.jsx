"use client";

import { useState } from "react";
import '../login/login.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupFirstStepPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  function handleNext(e) {
    e.preventDefault();
    // Store in sessionStorage for the next step
    try {
      sessionStorage.setItem('signup_name', name.trim());
      sessionStorage.setItem('signup_email', email.trim());
      sessionStorage.setItem('signup_dob_month', month);
      sessionStorage.setItem('signup_dob_day', day);
      sessionStorage.setItem('signup_dob_year', year);
    } catch {}
    router.push('/signup/create');
  }

  const months = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => String(currentYear - i));

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button aria-label="Close" className="modal-close" onClick={() => router.push('/')}>×</button>
        <div className="modal-content signup-flow" style={{ width: '75%' }}>
          <div className="modal-logo" aria-hidden>
            <Image className="modal-logo-light" src="/x-logo-white.png" alt="X" width={26} height={26} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>
          <h1 className="modal-title" style={{ textAlign: 'left' }}>Create your account</h1>

          <form onSubmit={handleNext} className="login-form signup-first" style={{ gap: 16 }}>
            <div className="form-group">
              <input
                className="modal-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                className="modal-input"
                type="email"
                placeholder="Email"
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

            <button className="primary-btn" type="submit">
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 