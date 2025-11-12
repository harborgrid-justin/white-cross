/**
 * Type definitions and constants for message search functionality
 */

export interface SearchFilters {
  query: string;
  sender: string;
  recipient: string;
  subject: string;
  dateFrom: string;
  dateTo: string;
  hasAttachments: boolean;
  isStarred: boolean;
  isUnread: boolean;
  priority: 'any' | 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  tags: string[];
  folder: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  lastUsed: string;
}

export interface SearchResult {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  date: string;
  preview: string;
  isStarred: boolean;
  isUnread: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  hasAttachments: boolean;
  category: string;
  tags: string[];
  relevanceScore: number;
}

export interface MessageSearchProps {
  onSearch: (filters: SearchFilters) => Promise<SearchResult[]>;
  onSaveSearch: (name: string, filters: SearchFilters) => void;
  onLoadSearch: (savedSearch: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onResultClick: (messageId: string) => void;
  savedSearches: SavedSearch[];
  availableTags: string[];
  availableCategories: string[];
  availableFolders: string[];
  initialQuery?: string;
  className?: string;
}

export const defaultFilters: SearchFilters = {
  query: '',
  sender: '',
  recipient: '',
  subject: '',
  dateFrom: '',
  dateTo: '',
  hasAttachments: false,
  isStarred: false,
  isUnread: false,
  priority: 'any',
  category: '',
  tags: [],
  folder: ''
};

export const priorityOptions = [
  { value: 'any', label: 'Any Priority' },
  { value: 'low', label: 'Low Priority' },
  { value: 'normal', label: 'Normal Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent Priority' },
] as const;
