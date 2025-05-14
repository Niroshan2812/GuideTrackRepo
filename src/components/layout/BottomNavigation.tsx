"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ListChecksIcon, SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/categories', label: 'Categories', icon: ListChecksIcon },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg md:hidden">
      <div className="container mx-auto grid grid-cols-3 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-3 text-sm hover:bg-accent hover:text-accent-foreground',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-6 w-6 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
