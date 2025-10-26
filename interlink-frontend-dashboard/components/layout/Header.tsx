/**
 * Header Component
 * Top navigation bar with user menu and notifications
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

export function Header() {
  const router = useRouter();
  const { toggleSidebar, notifications } = useUIStore();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const unreadCount = notifications.filter((n) => !n.id).length;

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* Left Side - Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar (Hidden on mobile) */}
        <div className="hidden sm:block">
          <div className="relative">
            <button className="absolute left-0 top-1/2 -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-bodydark" />
            </button>

            <input
              type="text"
              placeholder="Type to search..."
              className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
            />
          </div>
        </div>

        {/* Right Side - Notifications & User Menu */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 z-1 h-4 w-4 rounded-full bg-meta-1 text-xs font-medium text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {notificationOpen && (
              <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
                <div className="px-4.5 py-3">
                  <h5 className="text-sm font-medium text-bodydark2">
                    Notifications
                  </h5>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                      >
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-xs text-bodydark">
                            {notification.message}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4.5 py-10 text-center">
                      <p className="text-sm text-bodydark">
                        No notifications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  {user?.username || user?.email}
                </span>
                <span className="block text-xs">{user?.role}</span>
              </span>

              <span className="h-12 w-12 rounded-full">
                <UserCircleIcon className="h-12 w-12 text-bodydark" />
              </span>
            </button>

            {/* User Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-4.5 py-3 border-b border-stroke dark:border-strokedark">
                  <h5 className="text-sm font-medium text-bodydark2">
                    {user?.email}
                  </h5>
                </div>

                <ul className="flex flex-col overflow-y-auto">
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push('/admin/settings');
                      }}
                      className="flex w-full items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                    >
                      <Cog6ToothIcon className="h-5 w-5" />
                      Settings
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
