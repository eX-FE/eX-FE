"use client";

import { useRouter } from 'next/navigation';
import SetupProfileModal from '../../components/Auth/SetupProfileModal';

export default function SetupProfilePage() {
  const router = useRouter();
  return <SetupProfileModal onClose={() => router.back()} />;
} 