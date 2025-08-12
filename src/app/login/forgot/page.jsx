"use client";

import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '../../../components/Auth/ForgotPasswordModal';

export default function ForgotPasswordPage() {
  const router = useRouter();
  return <ForgotPasswordModal onClose={() => router.push('/')} />;
} 