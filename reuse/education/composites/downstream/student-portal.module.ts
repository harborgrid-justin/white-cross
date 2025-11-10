/**
 * LOC: EDU-COMP-DOWNSTREAM-MODULE-012
 * File: /reuse/education/composites/downstream/student-portal.module.ts
 *
 * Purpose: Student Portal Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { StudentPortalController } from './student-portal-controller';
import { StudentPortalControllersCompositeService } from './student-portal-service';

// ============================================================================
// SECURITY: Authentication & Authorization
// ============================================================================
// SECURITY: Import authentication and authorization
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';
import { PermissionsGuard } from './security/guards/permissions.guard';
import { Roles } from './security/decorators/roles.decorator';
import { RequirePermissions } from './security/decorators/permissions.decorator';

@Module({
  controllers: [StudentPortalController],
  providers: [
    StudentPortalControllersCompositeService,
    Logger,
  ],
  exports: [StudentPortalControllersCompositeService],
})
export class StudentPortalModule {}
