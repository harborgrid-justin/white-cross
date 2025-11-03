/**
 * @fileoverview Health Record Type Definitions
 * @module health-record/interfaces
 * @description Type definitions for health record module
 */

import { Request } from 'express';

/**
 * Extended Request interface with user and session information
 */
export interface HealthRecordRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
    permissions?: string[];
  };
  sessionID?: string;
  correlationId?: string;
}

/**
 * Health Record Type Enumeration
 */
export enum HealthRecordType {
  CHECKUP = 'CHECKUP',
  ILLNESS = 'ILLNESS',
  INJURY = 'INJURY',
  VACCINATION = 'VACCINATION',
  MEDICATION = 'MEDICATION',
  ALLERGY = 'ALLERGY',
  OTHER = 'OTHER'
}

/**
 * Health Record Operation Types
 */
export type HealthRecordOperation = 
  | 'READ_HEALTH_RECORD'
  | 'CREATE_HEALTH_RECORD'
  | 'UPDATE_HEALTH_RECORD'
  | 'DELETE_HEALTH_RECORD'
  | 'GET_HEALTH_SUMMARY'
  | 'EXPORT_HEALTH_DATA'
  | 'IMPORT_HEALTH_DATA'
  | 'SEARCH_HEALTH_RECORDS'
  | 'GET_ALLERGY_DATA'
  | 'POST_ALLERGY_DATA'
  | 'PATCH_ALLERGY_DATA'
  | 'DELETE_ALLERGY_DATA'
  | 'GET_VACCINATION_DATA'
  | 'POST_VACCINATION_DATA'
  | 'PATCH_VACCINATION_DATA'
  | 'DELETE_VACCINATION_DATA'
  | 'GET_CHRONIC_CONDITION_DATA'
  | 'POST_CHRONIC_CONDITION_DATA'
  | 'PATCH_CHRONIC_CONDITION_DATA'
  | 'DELETE_CHRONIC_CONDITION_DATA'
  | 'GET_VITAL_SIGNS_DATA'
  | 'POST_VITAL_SIGNS_DATA'
  | 'UNKNOWN_OPERATION';

/**
 * Compliance levels for HIPAA classification
 */
export type ComplianceLevel = 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI';

/**
 * PHI Data Types
 */
export type PHIDataType = 
  | 'HEALTH_RECORDS'
  | 'ALLERGIES'
  | 'VACCINATIONS'
  | 'CHRONIC_CONDITIONS'
  | 'VITAL_SIGNS'
  | 'COMPREHENSIVE_SUMMARY'
  | 'GENERAL_PHI';

/**
 * Security incident severity levels
 */
export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Rate limiting configuration for health records
 */
export interface HealthRecordRateLimitConfig {
  phiReadLimit: number;          // PHI read operations per window
  phiWriteLimit: number;         // PHI write operations per window
  exportLimit: number;           // Export operations per window
  searchLimit: number;           // Search operations per window
  windowMs: number;              // Time window in milliseconds
  blockDuration: number;         // Block duration after limit exceeded
}

/**
 * Cache configuration for health records
 */
export interface HealthRecordCacheConfig {
  phiTTL: number;               // TTL for PHI data (seconds)
  aggregateTTL: number;         // TTL for aggregate data (seconds)
  maxEntries: number;           // Maximum cache entries
  encryptKeys: boolean;         // Whether to encrypt cache keys
  complianceMode: boolean;      // HIPAA compliance mode
}

/**
 * Health record metrics
 */
export interface HealthRecordMetrics {
  phiAccesses: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsDeleted: number;
  searchOperations: number;
  exportOperations: number;
  securityIncidents: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
}
