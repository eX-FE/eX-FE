"use client";

import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '../../components/Auth/ForgotPasswordModal';

export default function ForgotPage() {
  const router = useRouter();
  return <ForgotPasswordModal onClose={() => router.back()} />;
} 