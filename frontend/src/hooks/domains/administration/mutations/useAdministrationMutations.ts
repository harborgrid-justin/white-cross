import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ADMINISTRATION_QUERY_KEYS,
  AdminUser,
  Department,
  SystemSetting,
  SystemConfiguration,
  AdminNotification,
  invalidateAdministrationQueries,
  invalidateUserQueries,
  invalidateDepartmentQueries,
  invalidateSettingsQueries,
  invalidateAuditLogQueries,
  invalidateNotificationQueries,
} from '../config';

// Mock API functions (replace with actual API calls)
const mockAdministrationAPI = {
  // User management mutations
  createUser: async (data: Partial<AdminUser>): Promise<AdminUser> => {
    return {} as AdminUser;
  },
  updateUser: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    return {} as AdminUser;
  },
  deleteUser: async (id: string): Promise<void> => {},
  activateUser: async (id: string): Promise<AdminUser> => {
    return {} as AdminUser;
  },
  deactivateUser: async (id: string): Promise<AdminUser> => {
    return {} as AdminUser;
  },
  resetUserPassword: async (id: string): Promise<void> => {},
  assignUserRoles: async (userId: string, roleIds: string[]): Promise<void> => {},
  
  // Department management mutations
  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    return {} as Department;
  },
  updateDepartment: async (id: string, data: Partial<Department>): Promise<Department> => {
    return {} as Department;
  },
  deleteDepartment: async (id: string): Promise<void> => {},
  assignDepartmentManager: async (deptId: string, managerId: string): Promise<Department> => {
    return {} as Department;
  },
  addDepartmentStaff: async (deptId: string, userId: string, position: string): Promise<void> => {},
  removeDepartmentStaff: async (deptId: string, userId: string): Promise<void> => {},
  
  // Settings management mutations
  updateSetting: async (key: string, value: any): Promise<SystemSetting> => {
    return {} as SystemSetting;
  },
  createSetting: async (data: Partial<SystemSetting>): Promise<SystemSetting> => {
    return {} as SystemSetting;
  },
  deleteSetting: async (key: string): Promise<void> => {},
  
  // System configuration mutations
  updateSystemConfiguration: async (module: string, settings: Partial<SystemConfiguration>): Promise<SystemConfiguration> => {
    return {} as SystemConfiguration;
  },
  enableSystemModule: async (module: string): Promise<SystemConfiguration> => {
    return {} as SystemConfiguration;
  },
  disableSystemModule: async (module: string): Promise<SystemConfiguration> => {
    return {} as SystemConfiguration;
  },
  
  // Notification mutations
  createNotification: async (data: Partial<AdminNotification>): Promise<AdminNotification> => {
    return {} as AdminNotification;
  },
  updateNotification: async (id: string, data: Partial<AdminNotification>): Promise<AdminNotification> => {
    return {} as AdminNotification;
  },
  deleteNotification: async (id: string): Promise<void> => {},
  sendNotification: async (id: string): Promise<AdminNotification> => {
    return {} as AdminNotification;
  },
  markNotificationAsRead: async (id: string, userId: string): Promise<void> => {},
  
  // Bulk operations
  bulkUpdateUsers: async (userIds: string[], updates: Partial<AdminUser>): Promise<AdminUser[]> => {
    return [];
  },
  bulkDeleteUsers: async (userIds: string[]): Promise<void> => {},
  bulkSendNotifications: async (notificationIds: string[]): Promise<void> => {},
};

// User Management Mutations
export const useCreateUser = (
  options?: UseMutationOptions<AdminUser, Error, Partial<AdminUser>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.createUser,
    onSuccess: (data) => {
      invalidateUserQueries(queryClient);
      invalidateAdministrationQueries(queryClient);
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create user');
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<AdminUser, Error, { id: string; data: Partial<AdminUser> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => mockAdministrationAPI.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.userDetails(variables.id), data);
      invalidateUserQueries(queryClient);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user');
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.deleteUser,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.userDetails(id) });
      invalidateUserQueries(queryClient);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete user');
    },
    ...options,
  });
};

export const useActivateUser = (
  options?: UseMutationOptions<AdminUser, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.activateUser,
    onSuccess: (data, id) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.userDetails(id), data);
      invalidateUserQueries(queryClient);
      toast.success('User activated successfully');
    },
    onError: (error) => {
      toast.error('Failed to activate user');
    },
    ...options,
  });
};

export const useDeactivateUser = (
  options?: UseMutationOptions<AdminUser, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.deactivateUser,
    onSuccess: (data, id) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.userDetails(id), data);
      invalidateUserQueries(queryClient);
      toast.success('User deactivated successfully');
    },
    onError: (error) => {
      toast.error('Failed to deactivate user');
    },
    ...options,
  });
};

export const useResetUserPassword = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.resetUserPassword,
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error) => {
      toast.error('Failed to reset password');
    },
    ...options,
  });
};

export const useAssignUserRoles = (
  options?: UseMutationOptions<void, Error, { userId: string; roleIds: string[] }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }) => mockAdministrationAPI.assignUserRoles(userId, roleIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.userDetails(variables.userId) });
      queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.userRoles(variables.userId) });
      toast.success('User roles updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign user roles');
    },
    ...options,
  });
};

// Department Management Mutations
export const useCreateDepartment = (
  options?: UseMutationOptions<Department, Error, Partial<Department>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.createDepartment,
    onSuccess: (data) => {
      invalidateDepartmentQueries(queryClient);
      invalidateAdministrationQueries(queryClient);
      toast.success('Department created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create department');
    },
    ...options,
  });
};

export const useUpdateDepartment = (
  options?: UseMutationOptions<Department, Error, { id: string; data: Partial<Department> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => mockAdministrationAPI.updateDepartment(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.departmentDetails(variables.id), data);
      invalidateDepartmentQueries(queryClient);
      toast.success('Department updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update department');
    },
    ...options,
  });
};

export const useDeleteDepartment = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.deleteDepartment,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.departmentDetails(id) });
      invalidateDepartmentQueries(queryClient);
      toast.success('Department deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete department');
    },
    ...options,
  });
};

export const useAssignDepartmentManager = (
  options?: UseMutationOptions<Department, Error, { deptId: string; managerId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deptId, managerId }) => mockAdministrationAPI.assignDepartmentManager(deptId, managerId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.departmentDetails(variables.deptId), data);
      invalidateDepartmentQueries(queryClient);
      toast.success('Department manager assigned successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign department manager');
    },
    ...options,
  });
};

// Settings Management Mutations
export const useUpdateSetting = (
  options?: UseMutationOptions<SystemSetting, Error, { key: string; value: any }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }) => mockAdministrationAPI.updateSetting(key, value),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.settingsDetails(variables.key), data);
      invalidateSettingsQueries(queryClient);
      toast.success('Setting updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update setting');
    },
    ...options,
  });
};

export const useCreateSetting = (
  options?: UseMutationOptions<SystemSetting, Error, Partial<SystemSetting>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.createSetting,
    onSuccess: (data) => {
      invalidateSettingsQueries(queryClient);
      toast.success('Setting created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create setting');
    },
    ...options,
  });
};

export const useDeleteSetting = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.deleteSetting,
    onSuccess: (_, key) => {
      queryClient.removeQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.settingsDetails(key) });
      invalidateSettingsQueries(queryClient);
      toast.success('Setting deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete setting');
    },
    ...options,
  });
};

// System Configuration Mutations
export const useUpdateSystemConfiguration = (
  options?: UseMutationOptions<SystemConfiguration, Error, { module: string; settings: Partial<SystemConfiguration> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ module, settings }) => mockAdministrationAPI.updateSystemConfiguration(module, settings),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.systemConfigDetails(variables.module), data);
      queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.systemConfigList() });
      toast.success('System configuration updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update system configuration');
    },
    ...options,
  });
};

// Notification Mutations
export const useCreateNotification = (
  options?: UseMutationOptions<AdminNotification, Error, Partial<AdminNotification>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.createNotification,
    onSuccess: (data) => {
      invalidateNotificationQueries(queryClient);
      toast.success('Notification created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create notification');
    },
    ...options,
  });
};

export const useUpdateNotification = (
  options?: UseMutationOptions<AdminNotification, Error, { id: string; data: Partial<AdminNotification> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => mockAdministrationAPI.updateNotification(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.notificationDetails(variables.id), data);
      invalidateNotificationQueries(queryClient);
      toast.success('Notification updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update notification');
    },
    ...options,
  });
};

export const useSendNotification = (
  options?: UseMutationOptions<AdminNotification, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.sendNotification,
    onSuccess: (data, id) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.notificationDetails(id), data);
      invalidateNotificationQueries(queryClient);
      toast.success('Notification sent successfully');
    },
    onError: (error) => {
      toast.error('Failed to send notification');
    },
    ...options,
  });
};

// Bulk Operations
export const useBulkUpdateUsers = (
  options?: UseMutationOptions<AdminUser[], Error, { userIds: string[]; updates: Partial<AdminUser> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, updates }) => mockAdministrationAPI.bulkUpdateUsers(userIds, updates),
    onSuccess: () => {
      invalidateUserQueries(queryClient);
      toast.success('Users updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update users');
    },
    ...options,
  });
};

export const useBulkDeleteUsers = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockAdministrationAPI.bulkDeleteUsers,
    onSuccess: () => {
      invalidateUserQueries(queryClient);
      toast.success('Users deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete users');
    },
    ...options,
  });
};
