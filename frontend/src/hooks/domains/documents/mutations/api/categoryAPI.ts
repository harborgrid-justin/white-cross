// Category API functions
import { DocumentCategory } from '../../config';
import { CreateCategoryInput, UpdateCategoryInput } from '../types';

export const categoryAPI = {
  createCategory: async (data: CreateCategoryInput): Promise<DocumentCategory> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      id: 'new-category-id',
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      color: data.color || '#007bff',
      icon: data.icon || 'folder',
      path: data.parentId ? `/parent/${data.name}` : `/${data.name}`,
      isActive: true
    };
  },

  updateCategory: async (data: UpdateCategoryInput): Promise<DocumentCategory> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: data.id,
      name: data.name || 'Updated Category',
      description: data.description,
      color: data.color || '#007bff',
      icon: data.icon || 'folder',
      path: `/${data.name || 'updated-category'}`,
      isActive: data.isActive !== undefined ? data.isActive : true
    };
  },

  deleteCategory: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
  },
};
