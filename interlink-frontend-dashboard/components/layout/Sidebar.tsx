/**
 * Sidebar Component
 * Main navigation sidebar for admin dashboard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  TagIcon,
  UserGroupIcon,
  KeyIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: HomeIcon,
  },
  {
    label: 'Brands',
    path: '/admin/brands',
    icon: TagIcon,
    roles: ['ADMIN'],
  },
  {
    label: 'Stores',
    path: '/admin/stores',
    icon: BuildingStorefrontIcon,
    roles: ['ADMIN'],
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: CubeIcon,
    roles: ['ADMIN'],
  },
  {
    label: 'Entitlements',
    path: '/admin/entitlements',
    icon: KeyIcon,
    roles: ['ADMIN'],
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: UserGroupIcon,
    roles: ['ADMIN'],
  },
  {
    label: 'Reports',
    path: '/admin/reports',
    icon: ChartBarIcon,
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: Cog6ToothIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const canAccessMenuItem = (item: MenuItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  };

  const filteredMenuItems = menuItems.filter(canAccessMenuItem);

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-99998 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-99999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gradient-to-b from-gray-900 to-gray-800 duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-xl font-bold text-white">IL</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              Interlink
            </h1>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden"
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {/* Menu Group */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                MENU
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`group relative flex items-center gap-2.5 rounded-lg px-4 py-3 font-medium duration-300 ease-in-out ${
                          active
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer - User Info */}
        {user && (
          <div className="mt-auto border-t border-strokedark px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {user.username || user.email}
                </p>
                <p className="text-xs text-bodydark2">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
