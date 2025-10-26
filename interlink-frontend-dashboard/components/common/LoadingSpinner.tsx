/**
 * LoadingSpinner Component
 * Loading indicators for various use cases
 */

'use client';

import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  text,
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

/**
 * PageLoader Component
 * Full-page loading overlay
 */
export interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center bg-white/90 dark:bg-boxdark/90">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

/**
 * ButtonSpinner Component
 * Small spinner for buttons
 */
export function ButtonSpinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent ${className}`}
    ></div>
  );
}

/**
 * SkeletonLoader Component
 * Skeleton loading placeholder
 */
export interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

export function SkeletonLoader({
  count = 1,
  height = 'h-4',
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded bg-gray-2 dark:bg-meta-4 ${height}`}
        ></div>
      ))}
    </div>
  );
}
