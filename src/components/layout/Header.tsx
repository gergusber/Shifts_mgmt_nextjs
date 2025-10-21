'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserSwitcher } from '@/components/UserSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Shifts' },
    { href: '/applications', label: 'My Applications' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-xl font-bold">ShiftRx</span>
          </Link>

          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <UserSwitcher />
      </div>
    </header>
  );
}
