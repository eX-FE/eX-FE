'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to login since we need authentication
    // Later this can check user context and redirect to user's profile
    router.push('/login');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: 'var(--foreground)'
    }}>
      Redirecting to login...
    </div>
  );
}
