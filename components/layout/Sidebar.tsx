'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: 'DONOR' | 'NGO' | 'ADMIN';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const links = {
    DONOR: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/donor/requests', label: 'Browse Requests' },
      { href: '/donor/donations', label: 'My Donations' },
    ],
    NGO: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/ngo/requests', label: 'My Requests' },
      { href: '/ngo/donations', label: 'Incoming Donations' },
    ],
    ADMIN: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/admin/ngos', label: 'Manage NGOs' },
      { href: '/admin/reports', label: 'Reports' },
    ],
  };

  const roleLinks = links[role] || [];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {roleLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
