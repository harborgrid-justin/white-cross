/**
 * Form Persistence Module
 *
 * Automatic form state persistence with HIPAA-compliant data handling.
 *
 * @module hooks/utilities/formPersistence
 * @category State Management - Form State
 */

export * from './types';
export * from './storage';
export * from './hook';
export { useFormPersistence as default } from './hook';
