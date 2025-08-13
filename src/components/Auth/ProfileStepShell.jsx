'use client';

import '../../app/login/login.css';

export default function ProfileStepShell({ children, actionLabel, onAction, disabled = false, maxWidth = 525, topControl = null }) {
  return (
    <div className="auth-overlay">
      <div className="auth-modal" style={{ maxWidth }}>
        {topControl}
        <div className="modal-content" style={{ width: '100%' }}>
          {children}
          <button className="primary-btn" type="button" onClick={onAction} disabled={disabled} style={{ marginTop: 16 }}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
} 