/**
 * Student Mutation Types
 *
 * Shared types for student mutation operations
 *
 * @module hooks/students/mutations/types
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import type { Student } from '@/types/student.types';

/**
 * Enhanced API error type with healthcare-specific context
 */
export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  response?: any;
  context?: 'validation' | 'authorization' | 'server' | 'network' | 'compliance';
  auditRequired?: boolean;
}

/**
 * Mutation result types with enhanced metadata
 */
export interface StudentMutationResult {
  success: boolean;
  student?: Student;
  message?: string;
  errors?: Record<string, string[]>;
  auditId?: string;
}

export interface BulkMutationResult {
  success: boolean;
  successCount: number;
  failureCount: number;
  results: Array<{
    id: string;
    success: boolean;
    student?: Student;
    error?: string;
  }>;
  auditId?: string;
}

export interface PermanentDeleteResult {
  success: boolean;
  message: string;
  auditId: string;
}
