/**
 * Students Domain - Central Export Hub
 * 
 * Enterprise hook architecture for student management with PHI compliance
 * and educational data privacy protections.
 */

// Configuration exports
export * from './config';

// Query Hooks - using barrel exports for flexibility
export * from './queries/useStudentsList';
export * from './queries/useStudentDetails';  
export * from './queries/useStudents';

// Mutation Hooks
export * from './mutations/useStudentMutations';
export * from './mutations/useOptimisticStudents';
export * from './mutations/useStudentManagement';