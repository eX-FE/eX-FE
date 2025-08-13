"use client";

import { createContext, useContext, useMemo, useState } from "react";

const SignupContext = createContext(null);

export function SignupProvider({ children }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState({ month: "", day: "", year: "" });

  function reset() {
    setName("");
    setEmail("");
    setDob({ month: "", day: "", year: "" });
  }

  const value = useMemo(
    () => ({ name, setName, email, setEmail, dob, setDob, reset }),
    [name, email, dob]
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used within a SignupProvider");
  return ctx;
} 