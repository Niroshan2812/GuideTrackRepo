"use client";

import type { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming this hook exists

export default function AppLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
      {isMobile && <BottomNavigation />}
    </div>
  );
}
