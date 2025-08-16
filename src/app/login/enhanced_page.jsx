'use client';

import { useRouter } from 'next/navigation';
import AuthModal from '../../components/Auth/AuthModal';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  return (
    <AuthModal onClose={() => router.push('/')} />
  );
}