'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';

interface NavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 sticky top-0 z-50 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            Fund.me
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden lg:block px-3">
                  {user.name} ({user.role})
                </span>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <div className="text-sm text-gray-700 dark:text-gray-300 px-3 py-2 border-b dark:border-gray-700">
                  {user.name} ({user.role})
                </div>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <div className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Dashboard
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <div className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Login
                  </div>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <div className="block px-3 py-2 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Register
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
