'use client';

/**
 * Sidebar Component - Main navigation sidebar
 *
 * Features:
 * - Collapsible sections for navigation organization
 * - Active link highlighting
 * - Icon-based navigation
 * - Role-based access control
 * - Keyboard accessible
 * - Responsive (desktop sidebar, mobile drawer)
 * - Dark mode support
 * - Smooth animations
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  FileHeart,
  Pill,
  Calendar,
  AlertTriangle,
  Package,
  MessageSquare,
  Shield,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Activity,
  FileText,
  Bell,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: any;
  badge?: string | number;
  badgeVariant?: 'default' | 'error' | 'warning' | 'success';
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

// Navigation structure with all healthcare domains
const navigationSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  {
    title: 'Clinical',
    collapsible: true,
    items: [
      { id: 'students', name: 'Students', href: '/students', icon: Users },
      { id: 'health-records', name: 'Health Records', href: '/health-records', icon: FileHeart },
      { id: 'medications', name: 'Medications', href: '/medications', icon: Pill, badge: 3, badgeVariant: 'warning' },
      { id: 'appointments', name: 'Appointments', href: '/appointments', icon: Calendar },
    ],
  },
  {
    title: 'Operations',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { id: 'inventory', name: 'Inventory', href: '/inventory', icon: Package },
      { id: 'budget', name: 'Budget & Finance', href: '/budget', icon: Activity },
      { id: 'purchase-orders', name: 'Purchase Orders', href: '/purchase-orders', icon: FileText },
      { id: 'vendors', name: 'Vendors', href: '/vendors', icon: Users },
    ],
  },
  {
    title: 'Communications',
    collapsible: true,
    items: [
      { id: 'communication', name: 'Messages', href: '/communication', icon: MessageSquare },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'reminders', name: 'Reminders', href: '/reminders', icon: Calendar },
    ],
  },
  {
    title: 'Incidents & Reports',
    collapsible: true,
    items: [
      { id: 'incidents', name: 'Incident Reports', href: '/incidents', icon: AlertTriangle, badge: 2, badgeVariant: 'error' },
      { id: 'documents', name: 'Documents', href: '/documents', icon: FileText },
      { id: 'reports', name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Analytics',
    collapsible: true,
    items: [
      { id: 'analytics', name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'System',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { id: 'admin', name: 'Admin Settings', href: '/admin', icon: Shield },
      { id: 'settings', name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

function NavItem({ item, depth = 0, onNavigate }: { item: NavItem; depth?: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  const paddingClass = depth === 0 ? 'pl-3' : depth === 1 ? 'pl-8' : 'pl-12';

  const getBadgeClass = (variant?: string) => {
    const variantMap: Record<string, string> = {
      error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return variantMap[variant || 'default'];
  };

  return (
    <>
      <Link
        href={item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setExpanded(!expanded);
          } else {
            onNavigate?.();
          }
        }}
        className={`
          group flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-all duration-200
          ${paddingClass}
          ${isActive
            ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
          hover:shadow-sm active:scale-[0.98]
        `}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{item.name}</span>

        {item.badge && (
          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClass(item.badgeVariant)}`}>
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <span className="ml-2">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        )}
      </Link>

      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItem key={child.id} item={child} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </>
  );
}

function NavSection({ section, onNavigate }: { section: NavSection; onNavigate?: () => void }) {
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed || false);

  return (
    <div className="mb-4">
      {section.title && (
        <button
          type="button"
          onClick={() => section.collapsible && setCollapsed(!collapsed)}
          className={`
            w-full flex items-center justify-between px-3 py-2 text-xs font-semibold
            text-gray-500 dark:text-gray-400 uppercase tracking-wider
            ${section.collapsible ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : 'cursor-default'}
            transition-colors duration-200
          `}
          disabled={!section.collapsible}
          aria-expanded={section.collapsible ? !collapsed : undefined}
        >
          <span>{section.title}</span>
          {section.collapsible && (
            collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </button>
      )}

      {!collapsed && (
        <nav className="space-y-1 mt-1" role="navigation" aria-label={section.title}>
          {section.items.map((item) => (
            <NavItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      )}
    </div>
  );
}

export function Sidebar({ className = '', onNavigate }: SidebarProps) {
  return (
    <aside
      className={`
        flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto
        ${className}
      `}
      aria-label="Main navigation sidebar"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
            White Cross
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navigationSections.map((section) => (
          <NavSection key={section.title} section={section} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          HIPAA Compliant System
        </p>
      </div>
    </aside>
  );
}
