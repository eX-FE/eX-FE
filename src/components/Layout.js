'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import HomePage from './oneComponent';
import ExplorePage from './ExplorePage';
import NotificationsPage from './NotificationsPage';
import MessagesPage from './MessagesPage';
import CommunitiesPage from './CommunitiesPage';
import SearchBar from './SearchBar';
import styles from './Layout.module.css';

export default function Layout() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch (currentPage) {
      case 'Explore':
        return <ExplorePage />;
      case 'Notifications':
        return <NotificationsPage />;
      case 'Messages':
        return <MessagesPage />;
      case 'Communities':
        return <CommunitiesPage onNavigate={setCurrentPage} />;
      case 'Home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className={styles.mainContent}>
        {renderPage()}
      </div>
      {currentPage === 'Home' && <SearchBar />}
    </div>
  );
}
