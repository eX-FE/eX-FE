'use client';

import { useState } from 'react';
import HomePage from './oneComponent';
import ExplorePage from './ExplorePage';
import NotificationsPage from './NotificationsPage';
import MessagesPage from './MessagesPage';
import CommunitiesPage from './CommunitiesPage';
import SearchBar from './SearchBar';

export default function LayoutContent() {
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
    <div>
      {renderPage()}
      {currentPage === 'Home' && <SearchBar />}
    </div>
  );
} 