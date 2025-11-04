/**
 * @fileoverview Admin Sidebar Types - Shared interfaces for sidebar components
 * @module app/(dashboard)/admin/_components/sidebar/types
 * @category Admin - Types
 */

import { LucideIcon } from 'lucide-react';

export interface AdminModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  count?: number;
  status?: 'active' | 'warning' | 'success' | 'error';
  href: string;
}

export interface SystemMetric {
  label: string;
  value: string | number;
  status: 'normal' | 'warning' | 'critical';
  icon: LucideIcon;
  color: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ActivityLogEntry {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description: string;
  icon: LucideIcon;
  timestamp?: string;
}

export interface SystemTool {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
}
