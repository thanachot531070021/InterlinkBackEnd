/**
 * Settings Page
 */

'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          System Settings
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-black dark:text-white">
          This is the Settings page. System configuration options will be available here.
        </p>
      </div>
    </div>
  );
}
