/**
 * Organization Domain Hooks
 *
 * Specialized hooks for districts and schools management.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';
import { useAppSelector } from './store-hooks-index';

import {
  districtsActions,
  districtsThunks,
  districtsSelectors,
  selectActiveDistricts,
} from '../slices/districtsSlice';

import {
  schoolsActions,
  schoolsThunks,
  schoolsSelectors,
  selectSchoolsByDistrict,
  selectActiveSchools,
} from '../slices/schoolsSlice';

// =====================
// DISTRICTS HOOKS
// =====================

/**
 * Hook that provides all district actions
 */
export const useDistrictsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(districtsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(districtsThunks.fetchById(id)),
    create: (data: any) => dispatch(districtsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(districtsThunks.update(params)),
    delete: (id: string) => dispatch(districtsThunks.delete(id)),
  };
};

/**
 * Hook to get all districts
 */
export const useDistricts = () => useAppSelector((state) => districtsSelectors.selectAll(state));

/**
 * Hook to get active districts
 */
export const useActiveDistricts = () => useAppSelector((state) => selectActiveDistricts(state));

// =====================
// SCHOOLS HOOKS
// =====================

/**
 * Hook that provides all school actions
 */
export const useSchoolsActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return {
    fetchAll: (params?: any) => dispatch(schoolsThunks.fetchAll(params)),
    fetchById: (id: string) => dispatch(schoolsThunks.fetchById(id)),
    create: (data: any) => dispatch(schoolsThunks.create(data)),
    update: (params: { id: string; data: any }) => dispatch(schoolsThunks.update(params)),
    delete: (id: string) => dispatch(schoolsThunks.delete(id)),
  };
};

/**
 * Hook to get all schools
 */
export const useSchools = () => useAppSelector((state) => schoolsSelectors.selectAll(state));

/**
 * Hook to get schools by district
 */
export const useSchoolsByDistrict = (districtId: string) =>
  useAppSelector((state) => selectSchoolsByDistrict(state, districtId));

/**
 * Hook to get active schools
 */
export const useActiveSchools = () => useAppSelector((state) => selectActiveSchools(state));
