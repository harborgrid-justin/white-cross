/**
 * Hooks Types
 * Main type definitions for hooks
 */

export * from './types/entityTypes';
export * from './shared/types';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}
