'use client';

import { useState } from 'react';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Verified', 'Mentions'];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        
        <button className={styles.settingsBtn}>
          <svg viewBox="0 0 24 24" className={styles.settingsIcon}>
            <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.34 1.46c.24 1.01-.19 2.06-1.05 2.64l-1.47.98v.78l1.47.98c.86.58 1.29 1.63 1.05 2.64l-.34 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.19-2.06 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.86-.58-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Nothing to see here — yet</h2>
          <p className={styles.emptyDescription}>
            From likes to reposts and a whole lot more, this is where all the action happens.
          </p>
        </div>
      </div>
    </div>
  );
}
