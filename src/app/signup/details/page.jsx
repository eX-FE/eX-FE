"use client";

import { useRouter } from 'next/navigation';
import SignupFlowModal from '../../../components/Auth/SignupFlowModal';
import { SignupProvider } from '../../../context/SignupContext';

export default function SignupDetailsPage() {
  const router = useRouter();
  return (
    <SignupProvider>
      <SignupFlowModal onClose={() => router.push('/')} />
    </SignupProvider>
  );
} 