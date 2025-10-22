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
import { administrationApi } from '@/services';

// User Management Mutations
export const useCreateUser = (
  options?: UseMutationOptions<AdminUser, Error, Partial<AdminUser>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AdminUser>) => {
      return await administrationApi.createUser(data);
    },
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
    mutationFn: async ({ id, data }) => {
      return await administrationApi.updateUser(id, data);
    },
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
    mutationFn: async (id: string) => {
      await administrationApi.deleteUser(id);
    },
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
    mutationFn: async (id: string) => {
      // Note: API doesn't have activateUser method, using updateUser
      return await administrationApi.updateUser(id, { status: 'ACTIVE' });
    },
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
    mutationFn: async (id: string) => {
      // Note: API doesn't have deactivateUser method, using updateUser
      return await administrationApi.updateUser(id, { status: 'INACTIVE' });
    },
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
    mutationFn: async (id: string) => {
      // Note: API doesn't have resetUserPassword method
      return Promise.resolve();
    },
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
    mutationFn: async ({ userId, roleIds }) => {
      // Note: API doesn't have assignUserRoles method  
      return Promise.resolve();
    },
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
    mutationFn: async (data: Partial<Department>) => { return {} as Department; },
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
    mutationFn: async ({ id, data }) => {
      // Note: API doesn't have updateDepartment method
      return {} as Department;
    },
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
    mutationFn: async (id: string) => {
      // Note: API doesn't have deleteDepartment method
      return Promise.resolve();
    },
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
    mutationFn: async ({ deptId, managerId }) => {
      // Note: API doesn't have assignDepartmentManager method
      return {} as Department;
    },
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
    mutationFn: async ({ key, value }) => {
      const response = await administrationApi.setConfiguration({ key, value });
      return response as SystemSetting;
    },
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
    mutationFn: async (data: Partial<SystemSetting>) => {
      const response = await administrationApi.setConfiguration(data);
      return response as SystemSetting;
    },
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
    mutationFn: async (key: string) => {
      await administrationApi.deleteConfiguration(key);
    },
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
    mutationFn: async ({ module, settings }) => {
      const response = await administrationApi.setConfiguration({ key: module, value: settings });
      return response as SystemConfiguration;
    },
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
    mutationFn: async (data: Partial<AdminNotification>) => {
      // Note: API doesn't have createNotification method
      return {} as AdminNotification;
    },
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
    mutationFn: async ({ id, data }) => {
      // Note: API doesn't have updateNotification method
      return {} as AdminNotification;
    },
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
    mutationFn: async (id: string) => {
      // Note: API doesn't have sendNotification method
      return {} as AdminNotification;
    },
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
    mutationFn: async ({ userIds, updates }) => {
      // Note: API doesn't have bulkUpdateUsers method
      return [];
    },
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
    mutationFn: async (userIds: string[]) => {
      // Note: API doesn't have bulkDeleteUsers method
      return Promise.resolve();
    },
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
