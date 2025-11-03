'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  role: 'DONOR' | 'NGO' | 'ADMIN';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = {
    DONOR: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/donor/requests', label: 'Browse Requests', icon: '🔍' },
      { href: '/donor/donations', label: 'My Donations', icon: '💝' },
    ],
    NGO: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/ngo/requests', label: 'My Requests', icon: '📋' },
      { href: '/ngo/donations', label: 'Incoming Donations', icon: '📦' },
    ],
    ADMIN: [
      { href: '/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/admin/ngos', label: 'Manage NGOs', icon: '🏢' },
      { href: '/admin/reports', label: 'Reports', icon: '📈' },
    ],
  };

  const roleLinks = links[role] || [];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-gray-50 border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {roleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
