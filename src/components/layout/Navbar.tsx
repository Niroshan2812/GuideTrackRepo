"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { HomeIcon, ListChecksIcon, SettingsIcon, PlusIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/categories', label: 'Categories', icon: <ListChecksIcon className="h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          GuideFlow
        </Link>
        {!isMobile && (
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                asChild
              >
                <Link href={item.href} className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
             <Button variant="default" asChild>
                <Link href="/guides/new" className="flex items-center space-x-2">
                  <PlusIcon className="h-5 w-5" />
                  <span>New Guide</span>
                </Link>
              </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
