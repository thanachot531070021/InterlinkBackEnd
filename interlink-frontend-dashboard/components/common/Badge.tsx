/**
 * Badge Component
 * Colored badges for status indicators
 */

'use client';

import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'primary'
  | 'secondary';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-meta-5/10 text-meta-5',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-gray-2 text-gray-600 dark:bg-meta-4 dark:text-gray-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * StatusBadge Component
 * Pre-configured badges for common statuses
 */
export interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISCONTINUED';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig: Record<
    StatusBadgeProps['status'],
    { variant: BadgeVariant; label: string }
  > = {
    ACTIVE: { variant: 'success', label: 'Active' },
    INACTIVE: { variant: 'secondary', label: 'Inactive' },
    PENDING: { variant: 'warning', label: 'Pending' },
    SUSPENDED: { variant: 'danger', label: 'Suspended' },
    DISCONTINUED: { variant: 'danger', label: 'Discontinued' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
