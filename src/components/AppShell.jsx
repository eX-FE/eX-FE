'use client';

import { useUser } from '../context/UserContext';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import styles from './AppShell.module.css';

export default function AppShell({ children, modal }) {
  const { user } = useUser();
  const pathname = usePathname();

  // Routes that should never have sidebar (auth routes and main page)
  const routesWithoutSidebar = [
    '/',
    '/login', 
    '/signup',
    '/signup/details',
    '/signup/create',
    '/setup_profile',
    '/logout'
  ];

  const shouldShowSidebar = user && !routesWithoutSidebar.includes(pathname);

  if (!shouldShowSidebar) {
    return <>{children}{modal}</>;
  }

  return (
    <div className={styles.container}>
      {/* Left Sidebar - 1/4 of screen */}
      <div className={styles.leftSidebar}>
        <Sidebar onNavigate={() => {}} currentPage={'Home'} />
      </div>
      
      {/* Main Content - 2/4 of screen */}
      <div className={styles.mainContent}>
        {children}
        {modal}
      </div>
      
      {/* Right Sidebar - 1/4 of screen */}
      <div className={styles.rightSidebar}>
        <RightSidebar />
      </div>
    </div>
  );
} 