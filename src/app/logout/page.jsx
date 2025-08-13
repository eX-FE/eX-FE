"use client";

import { useRouter } from 'next/navigation';
import LogoutModal from '../../components/Auth/LogoutModal';

export default function LogoutPage() {
  const router = useRouter();
  return <LogoutModal onClose={() => router.back()} />;
} 