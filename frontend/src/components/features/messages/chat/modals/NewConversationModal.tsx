'use client';

/**
 * WF-MSG-011 | NewConversationModal.tsx - New Conversation Modal
 * Purpose: Modal for creating new conversations
 * Dependencies: React, Headless UI, Avatar, lucide-react
 * Features: User search, participant selection, group naming, accessibility
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Avatar } from '@/components/ui/avatar';
import { X, Search, Users, Send, Check } from 'lucide-react';

/**
 * User type for search results.
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
}

/**
 * Props for the NewConversationModal component.
 *
 * @interface NewConversationModalProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {(query: string) => Promise<User[]>} onSearchUsers - Callback to search for users
 * @property {(userIds: string[], isGroup: boolean, groupName?: string) => Promise<void>} onCreateConversation - Callback to create conversation
 * @property {() => void} onClose - Callback when modal is closed
 */
export interface NewConversationModalProps {
  isOpen: boolean;
  onSearchUsers: (query: string) => Promise<User[]>;
  onCreateConversation: (userIds: string[], isGroup: boolean, groupName?: string) => Promise<void>;
  onClose: () => void;
}

/**
 * New conversation modal component.
 *
 * Modal dialog for creating new one-on-one or group conversations.
 * Features user search, multi-select for participants, and optional
 * group name input.
 *
 * **Features:**
 * - Search users by name or email
 * - Multi-select participants
 * - Group name input (for 3+ participants)
 * - Selected participants preview
 * - Create button (disabled until valid)
 * - Loading states
 * - Accessibility with focus trap and ARIA
 * - Dark mode support
 * - Keyboard shortcuts (Escape to close)
 *
 * **Conversation Types:**
 * - 1:1: Single participant selected
 * - Group: 2+ participants selected (requires group name)
 *
 * **Accessibility:**
 * - Focus trap in modal
 * - ARIA labels and roles
 * - Keyboard accessible
 * - Escape to close
 * - Screen reader friendly
 *
 * @component
 * @param {NewConversationModalProps} props - Component props
 * @returns {JSX.Element} Rendered modal
 *
 * @example
 * ```tsx
 * <NewConversationModal
 *   isOpen={isModalOpen}
 *   onSearchUsers={async (query) => {
 *     return await searchUsers(query);
 *   }}
 *   onCreateConversation={async (userIds, isGroup, groupName) => {
 *     await createConversation(userIds, isGroup, groupName);
 *   }}
 *   onClose={() => setIsModalOpen(false)}
 * />
 * ```
 */
export const NewConversationModal = React.memo<NewConversationModalProps>(({
  isOpen,
  onSearchUsers,
  onCreateConversation,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle user search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError(null);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await onSearchUsers(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Check if user is selected
  const isUserSelected = (userId: string) => {
    return selectedUsers.some((u) => u.id === userId);
  };

  // Handle create conversation
  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;

    const isGroup = selectedUsers.length > 1;
    if (isGroup && !groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await onCreateConversation(
        selectedUsers.map((u) => u.id),
        isGroup,
        isGroup ? groupName : undefined
      );
      handleClose();
    } catch (err) {
      setError('Failed to create conversation');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUsers([]);
    setGroupName('');
    setError(null);
    onClose();
  };

  const isGroup = selectedUsers.length > 1;
  const canCreate = selectedUsers.length > 0 && (!isGroup || groupName.trim());

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Conversation
                </Dialog.Title>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-6 py-3 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4 space-y-4">
                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Selected ({selectedUsers.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => toggleUserSelection(user)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Avatar src={user.avatar} alt={user.name} size="xs" shape="circle" />
                          <span>{user.name}</span>
                          <X className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Group Name (for groups) */}
                {isGroup && (
                  <div className="space-y-2">
                    <label htmlFor="group-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Group Name *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="group-name"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                )}

                {/* User Search */}
                <div className="space-y-2">
                  <label htmlFor="user-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add Participants
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="user-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search users by name or email..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg">
                  {isSearching && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    </div>
                  )}

                  {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-600 dark:text-gray-400">No users found</p>
                    </div>
                  )}

                  {!isSearching && searchResults.length === 0 && searchQuery.length < 2 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start typing to search for users
                      </p>
                    </div>
                  )}

                  {!isSearching && searchResults.length > 0 && (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {searchResults.map((user) => {
                        const selected = isUserSelected(user.id);
                        return (
                          <button
                            key={user.id}
                            onClick={() => toggleUserSelection(user)}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <Avatar src={user.avatar} alt={user.name} size="sm" shape="circle" />
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </p>
                              {user.email && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                              )}
                            </div>
                            {selected && (
                              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!canCreate || isCreating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Create
                    </>
                  )}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
});

NewConversationModal.displayName = 'NewConversationModal';

export default NewConversationModal;


