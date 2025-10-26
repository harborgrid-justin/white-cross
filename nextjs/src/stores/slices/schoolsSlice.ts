/**
 * Schools Slice
 * 
 * Redux slice for managing school entities using the slice factory.
 * Handles CRUD operations for schools within districts.
 */

import { createEntitySlice, EntityApiService } from '../sliceFactory';
import { School, CreateSchoolData, UpdateSchoolData, PaginationParams } from '../../types/administration';
import { administrationApi } from '../../services/api';

// Extended params to support district filtering
interface SchoolQueryParams extends PaginationParams {
  districtId?: string;
}

// Create API service adapter for schools
const schoolsApiService: EntityApiService<School, CreateSchoolData, UpdateSchoolData> = {
  async getAll(params?: SchoolQueryParams) {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const districtId = params?.districtId;
    const response = await administrationApi.getSchools(page, limit, districtId);
    return {
      data: response.data?.schools || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    // For now, fetch all and filter - can be optimized with a dedicated endpoint
    const response = await administrationApi.getSchools(1, 1000);
    const school = response.data?.schools?.find((s: School) => s.id === id);
    if (!school) {
      throw new Error(`School with id ${id} not found`);
    }
    return { data: school };
  },

  async create(data: CreateSchoolData) {
    const response = await administrationApi.createSchool(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateSchoolData) {
    const response = await administrationApi.updateSchool(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await administrationApi.deleteSchool(id);
    return { success: true };
  },
};

// Create the schools slice using the factory
const schoolsSliceFactory = createEntitySlice<School, CreateSchoolData, UpdateSchoolData>(
  'schools',
  schoolsApiService,
  {
    enableBulkOperations: false,
  }
);

// Export the slice and its components
export const schoolsSlice = schoolsSliceFactory.slice;
export const schoolsReducer = schoolsSlice.reducer;
export const schoolsActions = schoolsSliceFactory.actions;
export const schoolsSelectors = schoolsSliceFactory.adapter.getSelectors((state: any) => state.schools);
export const schoolsThunks = schoolsSliceFactory.thunks;

// Export custom selectors
export const selectActiveSchools = (state: any): School[] => {
  const allSchools = schoolsSelectors.selectAll(state) as School[];
  return allSchools.filter(school => school.isActive);
};

export const selectSchoolsByDistrict = (state: any, districtId: string): School[] => {
  const allSchools = schoolsSelectors.selectAll(state) as School[];
  return allSchools.filter(school => school.districtId === districtId);
};

export const selectSchoolByCode = (state: any, code: string): School | undefined => {
  const allSchools = schoolsSelectors.selectAll(state) as School[];
  return allSchools.find(school => school.code === code);
};
