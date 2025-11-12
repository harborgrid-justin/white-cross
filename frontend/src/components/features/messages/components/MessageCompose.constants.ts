import { PriorityOption } from './MessageCompose.types';

export const priorityOptions: PriorityOption[] = [
  { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
  { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
  { value: 'high', label: 'High Priority', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent Priority', color: 'text-red-600' },
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const MIN_SEARCH_LENGTH = 2;
