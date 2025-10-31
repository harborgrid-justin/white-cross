'use client';

/**
 * WF-DROPDOWNMENU-001 | DropdownMenu.tsx - Dropdown Menu Component
 * Purpose: Accessible dropdown menu with keyboard navigation
 * Upstream: Design system | Dependencies: React, Headless UI, Tailwind CSS
 * Downstream: Action menus, user menu, context menus
 * Related: Popover, CommandPalette
 * Exports: DropdownMenu, DropdownMenuItem, DropdownMenuDivider | Key Features: Keyboard navigation, groups, icons, accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Click trigger → Show menu → Navigate with keyboard → Select item
 * LLM Context: Dropdown menu component for White Cross healthcare platform
 */

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

/**
 * Menu item variant type
 */
export type MenuItemVariant = 'default' | 'danger';

/**
 * Props for the DropdownMenu component.
 */
export interface DropdownMenuProps {
  /** Trigger button content */
  trigger: React.ReactNode;
  /** Menu items (children) */
  children: React.ReactNode;
  /** Align menu to left or right */
  align?: 'left' | 'right';
  /** Additional class name for trigger button */
  triggerClassName?: string;
  /** Additional class name for menu items container */
  menuClassName?: string;
  /** Additional class name for wrapper */
  className?: string;
}

/**
 * Props for the DropdownMenuItem component.
 */
export interface DropdownMenuItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Keyboard shortcut to display */
  shortcut?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Variant style */
  variant?: MenuItemVariant;
  /** Additional class name */
  className?: string;
}

/**
 * Props for the DropdownMenuDivider component.
 */
export interface DropdownMenuDividerProps {
  /** Additional class name */
  className?: string;
}

/**
 * Variant styles for menu items
 */
const itemVariants: Record<MenuItemVariant, string> = {
  default: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  danger: 'text-danger-700 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20',
};

/**
 * DropdownMenu component with keyboard navigation and accessibility.
 *
 * A fully accessible dropdown menu built on Headless UI Menu. Provides
 * keyboard navigation, focus management, and screen reader support.
 *
 * **Features:**
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Focus management
 * - Left/right alignment
 * - Menu items with icons
 * - Keyboard shortcuts display
 * - Dividers for grouping
 * - Variant styles (default, danger)
 * - Smooth transitions
 * - Dark mode support
 *
 * **Accessibility:**
 * - ARIA attributes handled by Headless UI
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Focus management on open/close
 * - Role="menu" and role="menuitem"
 * - Screen reader announcements
 *
 * @component
 * @param {DropdownMenuProps} props - DropdownMenu component props
 * @returns {JSX.Element} Rendered dropdown menu with trigger and items
 *
 * @example
 * ```tsx
 * // Basic dropdown menu
 * <DropdownMenu trigger={<button>Actions</button>}>
 *   <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
 *   <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
 *   <DropdownMenuDivider />
 *   <DropdownMenuItem onClick={handleDelete} variant="danger">
 *     Delete
 *   </DropdownMenuItem>
 * </DropdownMenu>
 *
 * // Menu with icons and shortcuts
 * <DropdownMenu
 *   trigger={
 *     <button className="p-2 rounded hover:bg-gray-100">
 *       <MoreVerticalIcon className="w-5 h-5" />
 *     </button>
 *   }
 *   align="right"
 * >
 *   <DropdownMenuItem icon={<EditIcon />} shortcut="⌘E" onClick={handleEdit}>
 *     Edit
 *   </DropdownMenuItem>
 *   <DropdownMenuItem icon={<CopyIcon />} shortcut="⌘D" onClick={handleDuplicate}>
 *     Duplicate
 *   </DropdownMenuItem>
 *   <DropdownMenuDivider />
 *   <DropdownMenuItem icon={<TrashIcon />} variant="danger" onClick={handleDelete}>
 *     Delete
 *   </DropdownMenuItem>
 * </DropdownMenu>
 *
 * // User menu
 * <DropdownMenu
 *   trigger={
 *     <button className="flex items-center space-x-2">
 *       <Avatar src={user.avatar} />
 *       <ChevronDownIcon className="w-4 h-4" />
 *     </button>
 *   }
 *   align="right"
 * >
 *   <DropdownMenuItem icon={<UserIcon />} onClick={handleProfile}>
 *     Profile
 *   </DropdownMenuItem>
 *   <DropdownMenuItem icon={<SettingsIcon />} onClick={handleSettings}>
 *     Settings
 *   </DropdownMenuItem>
 *   <DropdownMenuDivider />
 *   <DropdownMenuItem icon={<LogOutIcon />} onClick={handleLogout}>
 *     Log out
 *   </DropdownMenuItem>
 * </DropdownMenu>
 *
 * // Patient actions menu
 * <DropdownMenu trigger={<button>Patient Actions</button>}>
 *   <DropdownMenuItem onClick={handleViewRecords}>
 *     View Health Records
 *   </DropdownMenuItem>
 *   <DropdownMenuItem onClick={handleScheduleAppointment}>
 *     Schedule Appointment
 *   </DropdownMenuItem>
 *   <DropdownMenuItem onClick={handleSendMessage}>
 *     Send Message
 *   </DropdownMenuItem>
 *   <DropdownMenuDivider />
 *   <DropdownMenuItem onClick={handleEditPatient}>
 *     Edit Patient Info
 *   </DropdownMenuItem>
 * </DropdownMenu>
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Patient action menus (view records, schedule, message)
 * - Medication administration options
 * - Health record actions (edit, delete, export)
 * - User profile menu
 * - Table row actions
 * - Quick access to common tasks
 *
 * **Headless UI**: Uses @headlessui/react Menu for accessibility.
 * Handles keyboard navigation, focus management, and ARIA attributes automatically.
 *
 * @see {@link DropdownMenuItem} for menu item component
 * @see {@link DropdownMenuDivider} for divider component
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = 'left',
  triggerClassName,
  menuClassName,
  className,
}) => {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button
        className={cn(
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md',
          'dark:focus:ring-offset-gray-900',
          triggerClassName
        )}
      >
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 mt-2 w-56',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg',
            'ring-1 ring-black ring-opacity-5',
            'focus:outline-none',
            'divide-y divide-gray-100 dark:divide-gray-700',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            menuClassName
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

/**
 * DropdownMenuItem component for menu items.
 *
 * Individual menu item with optional icon, shortcut display, and variants.
 *
 * @component
 * @param {DropdownMenuItemProps} props - DropdownMenuItem props
 * @returns {JSX.Element} Rendered menu item
 */
export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  icon,
  shortcut,
  disabled = false,
  variant = 'default',
  className,
}) => {
  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          onClick={onClick}
          className={cn(
            'group flex w-full items-center px-4 py-2 text-sm',
            'transition-colors duration-150',
            active && !disabled && itemVariants[variant],
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && !active && 'text-gray-700 dark:text-gray-300',
            className
          )}
          disabled={disabled}
        >
          {icon && (
            <span className="mr-3 flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {icon}
            </span>
          )}
          <span className="flex-1 text-left">{children}</span>
          {shortcut && (
            <span className="ml-3 text-xs text-gray-400 dark:text-gray-500">
              {shortcut}
            </span>
          )}
        </button>
      )}
    </Menu.Item>
  );
};

/**
 * DropdownMenuDivider component for separating menu groups.
 *
 * Visual separator between menu item groups.
 *
 * @component
 * @param {DropdownMenuDividerProps} props - DropdownMenuDivider props
 * @returns {JSX.Element} Rendered divider
 */
export const DropdownMenuDivider: React.FC<DropdownMenuDividerProps> = ({ className }) => {
  return (
    <div
      className={cn('my-1 border-t border-gray-200 dark:border-gray-700', className)}
      role="separator"
      aria-hidden="true"
    />
  );
};

DropdownMenu.displayName = 'DropdownMenu';
DropdownMenuItem.displayName = 'DropdownMenuItem';
DropdownMenuDivider.displayName = 'DropdownMenuDivider';

export default DropdownMenu;
