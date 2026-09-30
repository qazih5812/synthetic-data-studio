'use client';

import { useState, useEffect } from 'react';
import Workspace from '@/components/Workspace';
import Login from '@/components/Login';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('hackdata_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return null; // Avoid hydration mismatch on initial load
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => {
      setIsAuthenticated(true);
      localStorage.setItem('hackdata_auth', 'true');
    }} />;
  }

  return <Workspace onLogout={() => {
    setIsAuthenticated(false);
    localStorage.removeItem('hackdata_auth');
  }} />;
}
