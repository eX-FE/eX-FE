'use client';

import '../../app/login/login.css';

export default function UnfollowConfirmModal({ username, onConfirm, onCancel }) {
  return (
    <div className="auth-overlay">
      <div className="auth-modal logout-modal" style={{ maxWidth: 360 }}>
        <div className="modal-content" style={{ width: '100%' }}>
          <h2 className="modal-title" style={{ textAlign: 'left', marginBottom: 8 }}>Unfollow @{username}?</h2>
          <p className="legal-text" style={{ marginTop: 0, marginBottom: 16 }}>
            Their posts will no longer show up in your For You timeline. You can still view their profile, unless their posts are protected.
          </p>

          <button className="primary-btn" type="button" onClick={onConfirm}>
            Unfollow
          </button>

          <button className="secondary-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 