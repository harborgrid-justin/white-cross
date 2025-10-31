/**
 * Users Slice
 * 
 * Redux slice for managing user entities using the slice factory.
 * Handles CRUD operations for users with role-based access control.
 */

import { createEntitySlice, EntityApiService } from '@/stores/sliceFactory';
import { User, CreateUserData, UpdateUserData, UserFilters } from '@/types/administration';
import { apiActions } from '@/lib/api';

// Create API service adapter for users
const usersApiService: EntityApiService<User, CreateUserData, UpdateUserData> = {
  async getAll(params?: UserFilters) {
    const response = await apiActions.administration.getUsers(params);
    return {
      data: response.data?.users || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    // For now, fetch all and filter - can be optimized with a dedicated endpoint
    const response = await apiActions.administration.getUsers();
    const user = response.data?.users?.find((u: User) => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return { data: user };
  },

  async create(data: CreateUserData) {
    const response = await apiActions.administration.createUser(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateUserData) {
    const response = await apiActions.administration.updateUser(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await apiActions.administration.deleteUser(id);
    return { success: true };
  },
};

// Create the users slice using the factory
const usersSliceFactory = createEntitySlice<User, CreateUserData, UpdateUserData>(
  'users',
  usersApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const usersSlice = usersSliceFactory.slice;
export const usersReducer = usersSlice.reducer;
export const usersActions = usersSliceFactory.actions;
export const usersSelectors = usersSliceFactory.adapter.getSelectors((state: any) => state.users);
export const usersThunks = usersSliceFactory.thunks;

// Export custom selectors
export const selectUsersByRole = (state: any, role: string): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.role === role);
};

export const selectActiveUsers = (state: any): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.isActive);
};

export const selectUsersBySchool = (state: any, schoolId: string): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.schoolId === schoolId);
};

export const selectUsersByDistrict = (state: any, districtId: string): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.districtId === districtId);
};
