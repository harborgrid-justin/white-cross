/**
 * LOC: EDU-DOWN-ADVISING-MODULE-001
 * File: /reuse/education/composites/downstream/academic-advising.module.ts
 *
 * Purpose: Academic Advising Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AcademicAdvisingController } from './academic-advising-controller';
import { AcademicAdvisingControllersService } from './academic-advising-service';

// ============================================================================
// SECURITY: Authentication & Authorization
// ============================================================================
// SECURITY: Import authentication and authorization
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';
import { PermissionsGuard } from './security/guards/permissions.guard';
import { Roles } from './security/decorators/roles.decorator';
import { RequirePermissions } from './security/decorators/permissions.decorator';

@Module({
  controllers: [AcademicAdvisingController],
  providers: [
    AcademicAdvisingControllersService,
    Logger,
  ],
  exports: [AcademicAdvisingControllersService],
})
export class AcademicAdvisingModule {}
