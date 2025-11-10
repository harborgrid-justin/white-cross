/**
 * LOC: PERMDEC001
 * File: decorators/permissions.decorator.ts
 * Purpose: Permissions decorator for fine-grained access control
 */

import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../guards/permissions.guard';

/**
 * RequirePermissions decorator
 *
 * Specifies required permissions for accessing an endpoint.
 * User must have ALL specified permissions.
 *
 * @example
 * ```typescript
 * @Post('patients')
 * @RequirePermissions('patients:create', 'phi:access')
 * createPatient(@Body() dto: CreatePatientDto) {
 *   return this.patientsService.create(dto);
 * }
 * ```
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
