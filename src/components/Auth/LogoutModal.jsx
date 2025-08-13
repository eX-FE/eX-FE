'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import '../../app/login/login.css';

export default function LogoutModal({ onClose }) {
  const router = useRouter();
  const { logout } = useUser();

  function handleClose() {
    if (onClose) onClose();
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <div className="auth-overlay logout-overlay">
      <div className="auth-modal logout-modal">
        <div className="modal-content" style={{ width: '100%' }}>
          <div className="modal-logo" aria-hidden>
            <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
            <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
          </div>

          <h2 className="modal-title" style={{ textAlign: 'left' }}>Log out of X?</h2>
          <p className="legal-text" style={{ marginTop: 0, marginBottom: 16 }}>
            You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.
          </p>

          <button className="primary-btn" type="button" onClick={handleLogout}>
            Log out
          </button>

          <button className="secondary-btn" type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 