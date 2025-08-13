'use client';

import { useUser } from '../context/UserContext';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

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
    <>
      <Sidebar onNavigate={() => {}} currentPage={'Home'} />
      <div style={{ marginLeft: 275, minHeight: '100vh' }}>
        {children}
        {modal}
      </div>
    </>
  );
} 