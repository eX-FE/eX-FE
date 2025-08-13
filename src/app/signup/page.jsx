"use client";

import { useRouter } from 'next/navigation';
import SignupModal from '../../components/Auth/SignupModal';
import '../login/login.css';

export default function SignupPage() {
  const router = useRouter();
  return (
    <SignupModal onClose={() => router.push('/')} />
  );
} 