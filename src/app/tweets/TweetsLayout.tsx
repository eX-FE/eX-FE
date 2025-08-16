'use client';

import React from 'react';
import Layout from '../../components/Layout';
import TrendingSidebar from '../../components/TrendingSidebar';
import styles from './TweetsLayout.module.css';

interface TweetsLayoutProps {
  children: React.ReactNode;
}

const TweetsLayout: React.FC<TweetsLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <div className={styles.tweetsContainer}>
        <div className={styles.mainContent}>
          {children}
        </div>
        <div className={styles.sidebarContainer}>
          <TrendingSidebar />
        </div>
      </div>
    </Layout>
  );
};

export default TweetsLayout;
