/**
 * Reports Page
 */

'use client';

import React from 'react';

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Reports & Analytics
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-black dark:text-white">
          This is the Reports page. Analytics and reporting functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}
