/**
 * Communication Slice
 * 
 * Redux slice for managing communication messages using the slice factory.
 * Handles CRUD operations for messages, notifications, and templates.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { communicationApi } from '../../services/api';

// Message interface
interface Message {
  id: string;
  type: string;
  subject: string;
  content: string;
  recipientType: string;
  recipientIds: string[];
  senderId: string;
  sentAt?: string;
  status: string;
  priority: string;
  templateId?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Message creation data
interface CreateMessageData {
  type: string;
  subject: string;
  content: string;
  recipientType: string;
  recipientIds: string[];
  priority?: string;
  templateId?: string;
  attachments?: string[];
}

// Message update data
interface UpdateMessageData {
  subject?: string;
  content?: string;
  status?: string;
  priority?: string;
}

// Message filters
interface MessageFilters {
  type?: string;
  status?: string;
  senderId?: string;
  recipientType?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Create API service adapter for communication
const communicationApiService: EntityApiService<Message, CreateMessageData, UpdateMessageData> = {
  async getAll(params?: MessageFilters) {
    const response = await communicationApi.getAll(params);
    return {
      data: response.data?.messages || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await communicationApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateMessageData) {
    const response = await communicationApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateMessageData) {
    const response = await communicationApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await communicationApi.delete(id);
    return { success: true };
  },
};

// Create the communication slice using the entity factory
const communicationSliceFactory = createEntitySlice<Message, CreateMessageData, UpdateMessageData>(
  'communication',
  communicationApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const communicationSlice = communicationSliceFactory.slice;
export const communicationReducer = communicationSlice.reducer;
export const communicationActions = communicationSliceFactory.actions;
export const communicationSelectors = communicationSliceFactory.adapter.getSelectors((state: any) => state.communication);
export const communicationThunks = communicationSliceFactory.thunks;

// Export custom selectors
export const selectMessagesByType = (state: any, type: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.type === type);
};

export const selectMessagesByStatus = (state: any, status: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.status === status);
};

export const selectMessagesBySender = (state: any, senderId: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.senderId === senderId);
};

export const selectMessagesByPriority = (state: any, priority: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.priority === priority);
};

export const selectPendingMessages = (state: any): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.status === 'PENDING');
};

export const selectSentMessages = (state: any): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.status === 'SENT');
};

export const selectRecentMessages = (state: any, days: number = 7): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allMessages.filter(message => {
    const messageDate = new Date(message.createdAt);
    return messageDate >= cutoffDate;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
