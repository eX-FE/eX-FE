"use client";

import { useRouter } from 'next/navigation';
import SignupFlowModal from '../../../components/Auth/SignupFlowModal';

export default function SignupFlowPage() {
  const router = useRouter();
  return <SignupFlowModal onClose={() => router.push('/')} />;
} 