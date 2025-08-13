'use client';

import { useState } from 'react';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you');
  const [postText, setPostText] = useState('');

  return (
    <div className={styles.container}>
      {/* Mobile header for smaller screens */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileUserAvatar}>
          <div className={styles.mobileAvatarPlaceholder}></div>
        </div>
        <div className={styles.mobileLogo}>
          <svg viewBox="0 0 24 24" className={styles.mobileLogoIcon}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Header with tabs */}
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'for-you' ? styles.active : ''}`}
            onClick={() => setActiveTab('for-you')}
          >
            For you
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'following' ? styles.active : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>
      </div>

      {/* Post composer */}
      <div className={styles.composer}>
        <div className={styles.avatar}>
          <div className={styles.avatarPlaceholder}></div>
        </div>
        <div className={styles.composerContent}>
          <textarea
            className={styles.textArea}
            placeholder="What's happening?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={3}
          />
          <div className={styles.composerActions}>
            <div className={styles.actionButtons}>
              <button className={styles.actionBtn} title="Media">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} title="GIF">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13z"/>
                  <path d="M18 9l-.003 6h-1.997l.003-2.25h-1.5v-1.5h1.5V9H18zm-3-1.5v-1.5h1.5v1.5H15zM6.5 9H8v1.5H6.5v3H8V15H5V9h1.5zm2.5 0h2v1.5H9V15H7.5V9z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} title="Poll">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM6 17c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM6 11c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2z"/>
                  <path d="M10 7h8v2h-8V7zM10 15h8v2h-8v-2zM10 11h8v2h-8v-2z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} title="Emoji">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                  <circle cx="8.5" cy="10.5" r="1.5"/>
                  <circle cx="15.5" cy="10.5" r="1.5"/>
                  <path d="M8.4 16.5c.6 1.2 1.9 2 3.6 2s3-.8 3.6-2H8.4z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} title="Schedule">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M6 4h12v2H6V4zM4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8H4zm2 12V10h12v10H6zm6-5.5l4 2.5-4 2.5v-5z"/>
                </svg>
              </button>
              <button className={styles.actionBtn} title="Location">
                <svg viewBox="0 0 24 24" className={styles.icon}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </button>
            </div>
            <button 
              className={`${styles.postBtn} ${postText.trim() ? styles.active : ''}`}
              disabled={!postText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Feed content */}
      <div className={styles.feed}>
        {activeTab === 'for-you' && (
          <div className={styles.feedContent}>
            <div className={styles.emptyState}>
              <h3>Welcome to X!</h3>
              <p>This is the best place to see what's happening in your world.</p>
            </div>
          </div>
        )}
        {activeTab === 'following' && (
          <div className={styles.feedContent}>
            <div className={styles.emptyState}>
              <h3>Following</h3>
              <p>Posts from people you follow will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}