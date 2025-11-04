// Comment API functions
import { DocumentComment } from '../../config';
import { CreateCommentInput, UpdateCommentInput } from '../types';

export const commentAPI = {
  createComment: async (data: CreateCommentInput): Promise<DocumentComment> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: 'new-comment-id',
      documentId: data.documentId,
      content: data.content,
      page: data.page,
      position: data.position,
      parentId: data.parentId,
      replies: [],
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false
    };
  },

  updateComment: async (data: UpdateCommentInput): Promise<DocumentComment> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: data.id,
      documentId: 'doc-id',
      content: data.content,
      replies: [],
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: false
    };
  },

  deleteComment: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  resolveComment: async (id: string): Promise<DocumentComment> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      documentId: 'doc-id',
      content: 'Resolved comment',
      replies: [],
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      isResolved: true
    };
  },
};
