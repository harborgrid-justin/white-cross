'use client';

/**
 * WF-COMMANDPALETTE-001 | CommandPalette.tsx - Command Palette Component
 * Purpose: Global command search with keyboard shortcuts
 * Upstream: Design system | Dependencies: React, Headless UI, Tailwind CSS
 * Downstream: Global application navigation, quick actions
 * Related: Combobox, DropdownMenu, Modal
 * Exports: CommandPalette, CommandGroup, Command | Key Features: Fuzzy search, keyboard shortcuts, groups, recent commands, accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Cmd+K → Type query → Filter commands → Select command → Execute action
 * LLM Context: Command palette component for White Cross healthcare platform
 */

import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { cn } from '@/lib/utils';

/**
 * Command type
 */
export interface Command {
  /** Unique command ID */
  id: string;
  /** Command label */
  label: string;
  /** Command description */
  description?: string;
  /** Command icon */
  icon?: React.ReactNode;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Command keywords for search */
  keywords?: string[];
  /** Command group */
  group?: string;
  /** Command action */
  onSelect: () => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Command group type
 */
export interface CommandGroup {
  /** Group ID */
  id: string;
  /** Group label */
  label: string;
  /** Commands in this group */
  commands: Command[];
}

/**
 * Props for the CommandPalette component.
 */
export interface CommandPaletteProps {
  /** Whether command palette is open */
  open: boolean;
  /** Callback when command palette should close */
  onClose: () => void;
  /** Command groups */
  groups: CommandGroup[];
  /** Placeholder text */
  placeholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Show recent commands */
  showRecent?: boolean;
  /** Recent command IDs */
  recentCommandIds?: string[];
  /** Callback when recent commands change */
  onRecentChange?: (commandIds: string[]) => void;
  /** Additional class name */
  className?: string;
}

/**
 * Simple fuzzy search function
 */
const fuzzySearch = (query: string, text: string, keywords: string[] = []): boolean => {
  if (!query) return true;

  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Exact match
  if (lowerText.includes(lowerQuery)) return true;

  // Keyword match
  if (keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))) return true;

  // Fuzzy match: check if all query characters appear in order
  let textIndex = 0;
  for (let i = 0; i < lowerQuery.length; i++) {
    textIndex = lowerText.indexOf(lowerQuery[i], textIndex);
    if (textIndex === -1) return false;
    textIndex++;
  }

  return true;
};

/**
 * CommandPalette component for global command search.
 *
 * A keyboard-driven command palette for quick navigation and actions.
 * Inspired by tools like Spotlight, VS Code command palette, and Linear.
 *
 * **Features:**
 * - Keyboard shortcut to open (Cmd+K / Ctrl+K)
 * - Fuzzy search filtering
 * - Command groups
 * - Recent commands tracking
 * - Keyboard navigation (Arrow keys, Enter)
 * - Command shortcuts display
 * - Icons and descriptions
 * - Dark mode support
 * - Full accessibility
 *
 * **Accessibility:**
 * - ARIA attributes handled by Headless UI
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Focus management
 * - Screen reader announcements
 * - Modal overlay with focus trap
 *
 * @component
 * @param {CommandPaletteProps} props - CommandPalette component props
 * @returns {JSX.Element} Rendered command palette
 *
 * @example
 * ```tsx
 * // Basic command palette
 * const [open, setOpen] = useState(false);
 *
 * // Listen for Cmd+K
 * useEffect(() => {
 *   const down = (e: KeyboardEvent) => {
 *     if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
 *       e.preventDefault();
 *       setOpen(true);
 *     }
 *   };
 *   document.addEventListener('keydown', down);
 *   return () => document.removeEventListener('keydown', down);
 * }, []);
 *
 * const groups: CommandGroup[] = [
 *   {
 *     id: 'navigation',
 *     label: 'Navigation',
 *     commands: [
 *       {
 *         id: 'go-students',
 *         label: 'Go to Students',
 *         icon: <UsersIcon />,
 *         shortcut: 'G → S',
 *         onSelect: () => router.push('/students')
 *       },
 *       {
 *         id: 'go-medications',
 *         label: 'Go to Medications',
 *         icon: <PillIcon />,
 *         shortcut: 'G → M',
 *         onSelect: () => router.push('/medications')
 *       }
 *     ]
 *   },
 *   {
 *     id: 'actions',
 *     label: 'Actions',
 *     commands: [
 *       {
 *         id: 'new-student',
 *         label: 'Add New Student',
 *         icon: <PlusIcon />,
 *         shortcut: 'N → S',
 *         onSelect: () => openNewStudentModal()
 *       }
 *     ]
 *   }
 * ];
 *
 * <CommandPalette
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   groups={groups}
 *   showRecent
 * />
 *
 * // With recent commands tracking
 * const [recentCommands, setRecentCommands] = useState<string[]>([]);
 *
 * <CommandPalette
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   groups={groups}
 *   showRecent
 *   recentCommandIds={recentCommands}
 *   onRecentChange={setRecentCommands}
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Quick navigation (Students, Medications, Appointments)
 * - Search patients by name or ID
 * - Quick actions (Add Student, Schedule Appointment, Record Medication)
 * - Settings and preferences access
 * - Report generation shortcuts
 * - Emergency contacts quick access
 * - Medical code lookup
 *
 * **Keyboard Shortcuts**:
 * - Cmd+K or Ctrl+K to open
 * - Arrow Up/Down to navigate
 * - Enter to select command
 * - Escape to close
 *
 * @see {@link Command} for command structure
 * @see {@link CommandGroup} for group structure
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  groups,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No commands found',
  showRecent = false,
  recentCommandIds = [],
  onRecentChange,
  className,
}) => {
  const [query, setQuery] = useState('');

  // Reset query when opening
  useEffect(() => {
    if (open) {
      setQuery('');
    }
  }, [open]);

  // Flatten all commands
  const allCommands = groups.flatMap(group =>
    group.commands.map(cmd => ({ ...cmd, group: group.label }))
  );

  // Filter commands based on query
  const filteredCommands = query === ''
    ? allCommands
    : allCommands.filter(cmd =>
        fuzzySearch(query, cmd.label, cmd.keywords) ||
        (cmd.description && fuzzySearch(query, cmd.description, cmd.keywords))
      );

  // Group filtered commands
  const filteredGroups = groups.map(group => ({
    ...group,
    commands: group.commands.filter(cmd =>
      filteredCommands.some(fc => fc.id === cmd.id)
    ),
  })).filter(group => group.commands.length > 0);

  // Recent commands
  const recentCommands = showRecent && query === ''
    ? allCommands.filter(cmd => recentCommandIds.includes(cmd.id))
    : [];

  const handleSelect = (command: Command) => {
    // Track recent command
    if (showRecent && onRecentChange) {
      const newRecent = [command.id, ...recentCommandIds.filter(id => id !== command.id)].slice(0, 5);
      onRecentChange(newRecent);
    }

    // Execute command
    command.onSelect();

    // Close palette
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={(command: Command) => handleSelect(command)}>
                {/* Search Input */}
                <div className="relative">
                  <svg
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 sm:text-sm outline-none"
                    placeholder={placeholder}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {/* Commands List */}
                {(filteredCommands.length > 0 || recentCommands.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-96 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700"
                  >
                    {/* Recent Commands */}
                    {recentCommands.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Recent
                        </div>
                        {recentCommands.map((command) => (
                          <Combobox.Option
                            key={command.id}
                            value={command}
                            disabled={command.disabled}
                            className={({ active, disabled }) =>
                              cn(
                                'flex cursor-pointer select-none items-center gap-3 px-3 py-2 mx-2 rounded-md',
                                active && !disabled && 'bg-primary-600 text-white',
                                !active && !disabled && 'text-gray-900 dark:text-gray-100',
                                disabled && 'cursor-not-allowed opacity-50'
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                {command.icon && (
                                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    {command.icon}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{command.label}</div>
                                  {command.description && (
                                    <div
                                      className={cn(
                                        'text-xs truncate',
                                        active ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                                      )}
                                    >
                                      {command.description}
                                    </div>
                                  )}
                                </div>
                                {command.shortcut && (
                                  <span
                                    className={cn(
                                      'flex-shrink-0 text-xs px-2 py-0.5 rounded border',
                                      active
                                        ? 'border-white/30 text-white/90'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                                    )}
                                  >
                                    {command.shortcut}
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </div>
                    )}

                    {/* Grouped Commands */}
                    {filteredGroups.map((group, groupIndex) => (
                      <div key={group.id} className={cn(groupIndex > 0 && 'mt-2')}>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {group.label}
                        </div>
                        {group.commands.map((command) => (
                          <Combobox.Option
                            key={command.id}
                            value={command}
                            disabled={command.disabled}
                            className={({ active, disabled }) =>
                              cn(
                                'flex cursor-pointer select-none items-center gap-3 px-3 py-2 mx-2 rounded-md',
                                active && !disabled && 'bg-primary-600 text-white',
                                !active && !disabled && 'text-gray-900 dark:text-gray-100',
                                disabled && 'cursor-not-allowed opacity-50'
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                {command.icon && (
                                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    {command.icon}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{command.label}</div>
                                  {command.description && (
                                    <div
                                      className={cn(
                                        'text-xs truncate',
                                        active ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                                      )}
                                    >
                                      {command.description}
                                    </div>
                                  )}
                                </div>
                                {command.shortcut && (
                                  <span
                                    className={cn(
                                      'flex-shrink-0 text-xs px-2 py-0.5 rounded border',
                                      active
                                        ? 'border-white/30 text-white/90'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                                    )}
                                  >
                                    {command.shortcut}
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </div>
                    ))}
                  </Combobox.Options>
                )}

                {/* Empty State */}
                {query !== '' && filteredCommands.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <svg
                      className="mx-auto h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                      {emptyMessage}
                    </p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Try searching for something else
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <kbd className="px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <kbd className="px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <kbd className="px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600">esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

CommandPalette.displayName = 'CommandPalette';

export default CommandPalette;
