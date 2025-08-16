'use client';

import styles from './Sidebar.module.css';
import { useState } from 'react';
import React from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar({ onNavigate, currentPage }) {
  const { user } = useUser();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = React.useRef(null);
  const rowBtnRef = React.useRef(null);

  const menuItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Explore', icon: 'search' },
    { name: 'Notifications', icon: 'bell' },
    { name: 'Messages', icon: 'mail' },
    { name: 'Profile', icon: 'profile' },
    { name: 'More', icon: 'more' }
  ];

  const getIcon = (iconName, isActive = false) => {
    const iconProps = {
      className: `${styles.icon} ${isActive ? styles.activeIcon : ''}`,
      viewBox: "0 0 24 24"
    };

    switch (iconName) {
      case 'home':
        return (
          <svg {...iconProps}>
            <path d="M12 1.696L6 6.8V19h3v-6h6v6h3V6.8l-6-5.104zm0-1.696l8 6.5V21h-7v-6H11v6H4V6.5l8-6.5z" fill={isActive ? '#1d9bf0' : 'currentColor'} />
          </svg>
        );
      case 'search':
        return (
          <svg {...iconProps}>
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" fill="currentColor" />
          </svg>
        );
      case 'bell':
        return (
          <svg {...iconProps}>
            <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.234l-1.141-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z" fill="currentColor" />
          </svg>
        );
      case 'mail':
        return (
          <svg {...iconProps}>
            <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v.511l8.5 5.677 8.5-5.677v-.511c0-.276-.224-.5-.5-.5h-15zm15 2.5l-8.5 5.677-8.5-5.677v11c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-11z" fill="currentColor" />
          </svg>
        );
      case 'grok':
        return (
          <svg {...iconProps}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
          </svg>
        );
      case 'communities':
        return (
          <svg {...iconProps}>
            <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004zm4.5-9.5c0 2.485-2.016 4.5-4.5 4.5S3.001 12.902 3.001 10.417c0-2.485 2.016-4.5 4.5-4.5s4.5 2.015 4.5 4.5zm-2 0c0-1.381-1.119-2.5-2.5-2.5s-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5zm16.5 9.5L26.472 21h-7l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.001 5.917c0-2.485 2.016-4.5 4.5-4.5s4.5 2.015 4.5 4.5c0 2.485-2.016 4.5-4.5 4.5s-4.5-2.015-4.5-4.5z" fill="currentColor" />
          </svg>
        );
      case 'profile':
        return (
          <svg {...iconProps}>
            <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0-2C8.686 2 6 4.686 6 8s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" fill="currentColor" />
          </svg>
        );
      case 'more':
        return (
          <svg {...iconProps}>
            <circle cx="5" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="19" cy="12" r="2" fill="currentColor" />
          </svg>
        );
      default:
        return null;
    }
  };

  const hasAvatar = !!(user?.avatarUrl && user.avatarUrl.trim().length > 0);

  // Close tooltip when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleDocClick(e) {
      if (!showMenu) return;
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      const inButton = rowBtnRef.current && rowBtnRef.current.contains(e.target);
      if (!inMenu && !inButton) setShowMenu(false);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setShowMenu(false);
    }
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showMenu]);

  return (
    <div className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => onNavigate && onNavigate('Home')}>
        <svg viewBox="0 0 24 24" className={styles.logoIcon}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
        </svg>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`${styles.navItem} ${currentPage === item.name ? styles.active : ''}`}
            onClick={() => {
              if (item.name === 'Profile') {
                router.push('/profile');
                return;
              }
              if (item.name === 'Explore') {
                router.push('/explore');
                return;
              }
              if (item.name === 'Notifications') {
                router.push('/notifications');
                return;
              }
              if (onNavigate) onNavigate(item.name);
            }}
          >
            {getIcon(item.icon, currentPage === item.name)}
            <span className={styles.navText}>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Main Post Button */}
      <button className={styles.mainPostBtn}>
        <span className={styles.postBtnText}>Post</span>
      </button>

      {/* User Profile - whole row opens tooltip */}
      <div className={styles.userProfile}>
        <button ref={rowBtnRef} className={styles.userProfileBtn} onClick={() => setShowMenu(v => !v)} aria-label="Account menu">
          <div className={styles.userAvatar}>
            {hasAvatar ? (
              <img src={user.avatarUrl} alt="avatar" />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#6b7280">
                  <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                </svg>
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || ''}</div>
            <div className={styles.userHandle}>{user?.username ? `@${user.username}` : ''}</div>
          </div>
          <span className={styles.ellipsis} aria-hidden>...</span>
        </button>
        {showMenu && (
          <div ref={menuRef} className={styles.userMenu} role="menu">
            <button className={styles.userMenuItem} onClick={() => router.push('/login')}>Add an existing account</button>
            <button className={styles.userMenuItem} onClick={() => router.push('/logout')}>Log out @{user?.username || ''}</button>
          </div>
        )}
      </div>
    </div>
  );
}
