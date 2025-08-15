"use client";

import { SignupProvider } from '../../context/SignupContext';

export default function SignupLayout({ children }) {
  return (
    <SignupProvider>
      {children}
    </SignupProvider>
  );
} 