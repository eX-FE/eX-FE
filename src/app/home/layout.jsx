"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import Sidebar from "../../components/Sidebar";

export default function HomeLayout({ children }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '275px 1fr', minHeight: '100vh' }}>
      <Sidebar onNavigate={() => {}} currentPage={'Home'} />
      <div>
        {children}
      </div>
    </div>
  );
} 