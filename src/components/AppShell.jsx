'use client';

import { useUser } from '../context/UserContext';
import Sidebar from './Sidebar';

export default function AppShell({ children, modal }) {
  const { user } = useUser();

  if (!user) {
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