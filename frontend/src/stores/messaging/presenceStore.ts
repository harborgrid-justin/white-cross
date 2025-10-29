/**
 * Presence Store
 *
 * Zustand store for managing user online/offline presence status
 * Tracks user availability and custom status messages
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserPresence } from './types';

interface PresenceState {
  // Presence data by user ID
  presenceByUserId: Record<string, UserPresence>;

  // Current user's presence
  currentUserPresence: UserPresence | null;

  // Actions
  setPresence: (userId: string, presence: UserPresence) => void;
  updatePresence: (userId: string, updates: Partial<UserPresence>) => void;
  removePresence: (userId: string) => void;
  setMultiplePresences: (presences: UserPresence[]) => void;

  // Current user presence
  setCurrentUserPresence: (presence: UserPresence) => void;
  updateCurrentUserStatus: (
    status: UserPresence['status'],
    customStatus?: string
  ) => void;

  // Getters
  getPresence: (userId: string) => UserPresence | undefined;
  isOnline: (userId: string) => boolean;
  getOnlineUsers: () => UserPresence[];
  getOfflineUsers: () => UserPresence[];

  // Bulk operations
  setUsersOffline: (userIds: string[]) => void;
  clearAll: () => void;
}

export const usePresenceStore = create<PresenceState>()(
  devtools(
    (set, get) => ({
      presenceByUserId: {},
      currentUserPresence: null,

      setPresence: (userId, presence) =>
        set((state) => ({
          presenceByUserId: {
            ...state.presenceByUserId,
            [userId]: presence,
          },
        })),

      updatePresence: (userId, updates) =>
        set((state) => {
          const existing = state.presenceByUserId[userId];
          if (!existing) return state;

          return {
            presenceByUserId: {
              ...state.presenceByUserId,
              [userId]: { ...existing, ...updates },
            },
          };
        }),

      removePresence: (userId) =>
        set((state) => {
          const { [userId]: removed, ...remaining } = state.presenceByUserId;
          return { presenceByUserId: remaining };
        }),

      setMultiplePresences: (presences) =>
        set((state) => {
          const updates: Record<string, UserPresence> = {};
          presences.forEach((presence) => {
            updates[presence.userId] = presence;
          });

          return {
            presenceByUserId: {
              ...state.presenceByUserId,
              ...updates,
            },
          };
        }),

      setCurrentUserPresence: (presence) =>
        set({ currentUserPresence: presence }),

      updateCurrentUserStatus: (status, customStatus) =>
        set((state) => {
          if (!state.currentUserPresence) return state;

          const updated: UserPresence = {
            ...state.currentUserPresence,
            status,
            customStatus: customStatus || state.currentUserPresence.customStatus,
            lastSeen: status === 'offline' ? new Date().toISOString() : undefined,
          };

          return {
            currentUserPresence: updated,
            presenceByUserId: {
              ...state.presenceByUserId,
              [updated.userId]: updated,
            },
          };
        }),

      getPresence: (userId) => {
        return get().presenceByUserId[userId];
      },

      isOnline: (userId) => {
        const presence = get().presenceByUserId[userId];
        return presence?.status === 'online' || presence?.status === 'away';
      },

      getOnlineUsers: () => {
        const state = get();
        return Object.values(state.presenceByUserId).filter(
          (p) => p.status === 'online' || p.status === 'away'
        );
      },

      getOfflineUsers: () => {
        const state = get();
        return Object.values(state.presenceByUserId).filter(
          (p) => p.status === 'offline'
        );
      },

      setUsersOffline: (userIds) =>
        set((state) => {
          const updates: Record<string, UserPresence> = {};

          userIds.forEach((userId) => {
            const existing = state.presenceByUserId[userId];
            if (existing) {
              updates[userId] = {
                ...existing,
                status: 'offline',
                lastSeen: new Date().toISOString(),
              };
            }
          });

          return {
            presenceByUserId: {
              ...state.presenceByUserId,
              ...updates,
            },
          };
        }),

      clearAll: () =>
        set({
          presenceByUserId: {},
          currentUserPresence: null,
        }),
    }),
    { name: 'PresenceStore' }
  )
);
