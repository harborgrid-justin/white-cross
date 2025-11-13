/**
 * @fileoverview Common Decorators Barrel Export
 * @module common/decorators
 * @description Central export point for all common decorators
 *
 * Consolidates decorators from multiple locations:
 * - Auth decorators (roles, public, current-user)
 * - Validation decorators (phone, SSN, ICD-10, etc.)
 * - Healthcare decorators (dosage, NPI, MRN)
 * - Access control decorators
 */

// Auth Decorators
export * from './api-validation-decorators.service';
export * from './controller-decorators.service';
export * from './model-decorators.service';
export * from './swagger-decorators.service';
export * from './swagger-parameter-decorators.service';
export * from '../../services/auth/decorators/roles.decorator';
export * from '../../services/auth/decorators/public.decorator';
export * from '../../services/auth/decorators/current-user.decorator';

// Validation Decorators
export * from '../validators/decorators/is-phone.decorator';
export * from '../validators/decorators/is-ssn.decorator';
export * from '../validators/decorators/is-mrn.decorator';
export * from '../validators/decorators/is-npi.decorator';
export * from '../validators/decorators/is-dosage.decorator';
export * from '../validators/decorators/is-icd10.decorator';
export * from '../validators/decorators/sanitize-html.decorator';
