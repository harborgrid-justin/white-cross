/**
 * Districts Slice
 * 
 * Redux slice for managing district entities using the slice factory.
 * Handles CRUD operations for school districts.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { District, CreateDistrictData, UpdateDistrictData, PaginationParams } from '../../types/administration';
import { administrationApi } from '../../services/api';

// Create API service adapter for districts
const districtsApiService: EntityApiService<District, CreateDistrictData, UpdateDistrictData> = {
  async getAll(params?: PaginationParams) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const response = await administrationApi.getDistricts(page, limit);
    return {
      data: response.data?.districts || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    // For now, fetch all and filter - can be optimized with a dedicated endpoint
    const response = await administrationApi.getDistricts(1, 1000);
    const district = response.data?.districts?.find((d: District) => d.id === id);
    if (!district) {
      throw new Error(`District with id ${id} not found`);
    }
    return { data: district };
  },

  async create(data: CreateDistrictData) {
    const response = await administrationApi.createDistrict(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateDistrictData) {
    const response = await administrationApi.updateDistrict(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await administrationApi.deleteDistrict(id);
    return { success: true };
  },
};

// Create the districts slice using the factory
const districtsSliceFactory = createEntitySlice<District, CreateDistrictData, UpdateDistrictData>(
  'districts',
  districtsApiService,
  {
    enableBulkOperations: false,
  }
);

// Export the slice and its components
export const districtsSlice = districtsSliceFactory.slice;
export const districtsReducer = districtsSlice.reducer;
export const districtsActions = districtsSliceFactory.actions;
export const districtsSelectors = districtsSliceFactory.adapter.getSelectors((state: any) => state.districts);
export const districtsThunks = districtsSliceFactory.thunks;

// Export custom selectors
export const selectActiveDistricts = (state: any): District[] => {
  const allDistricts = districtsSelectors.selectAll(state) as District[];
  return allDistricts.filter(district => district.isActive);
};

export const selectDistrictByCode = (state: any, code: string): District | undefined => {
  const allDistricts = districtsSelectors.selectAll(state) as District[];
  return allDistricts.find(district => district.code === code);
};
