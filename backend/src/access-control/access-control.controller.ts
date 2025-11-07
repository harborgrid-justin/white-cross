import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser, SecurityIncidentFilters } from './types';
import type { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AccessControlService } from './access-control.service';
import { PermissionCacheService } from './services/permission-cache.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionToRoleDto } from './dto/assign-permission-to-role.dto';
import { AssignRoleToUserDto } from './dto/assign-role-to-user.dto';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { AccessControlCreateIpRestrictionDto } from './dto/create-ip-restriction.dto';
import { AccessControlCreateIncidentDto } from './dto/create-security-incident.dto';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { Permissions } from './decorators/permissions.decorator';

/**
 * Access Control Controller
 *
 * Provides REST API endpoints for:
 * - Role management
 * - Permission management
 * - User role assignments (RBAC)
 * - Session management
 * - Security incidents and IP restrictions
 */
@ApiTags('Access Control')
@Controller('access-control')
@ApiBearerAuth()
@UseGuards(PermissionsGuard, RolesGuard)
export class AccessControlController {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly cacheService: PermissionCacheService,
  ) {}

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  @Get('roles')
  @Permissions('roles', 'read')
  @ApiOperation({ summary: 'Get all roles with permissions and assignments' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  async getRoles() {
    return this.accessControlService.getRoles();
  }

  @Get('roles/:id')
  @Permissions('roles', 'read')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role UUID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getRoleById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.accessControlService.getRoleById(id);
  }

  @Post('roles')
  @Permissions('roles', 'create')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or duplicate name',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.createRole(
      createRoleDto,
      (req.user as AuthenticatedUser)?.id,
    );
  }

  @Patch('roles/:id')
  @Permissions('roles', 'update')
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiParam({ name: 'id', description: 'Role UUID', type: 'string' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - cannot modify system roles',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateRole(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.updateRole(
      id,
      updateRoleDto,
      (req.user as AuthenticatedUser)?.id,
    );
  }

  @Delete('roles/:id')
  @Permissions('roles', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role UUID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete system role or role with users',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteRole(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.deleteRole(id, (req.user as AuthenticatedUser)?.id);
  }

  // ============================================================================
  // PERMISSION MANAGEMENT
  // ============================================================================

  @Get('permissions')
  @Permissions('permissions', 'read')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
  })
  async getPermissions() {
    return this.accessControlService.getPermissions();
  }

  @Post('permissions')
  @Permissions('permissions', 'create')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.accessControlService.createPermission(createPermissionDto);
  }

  @Post('roles/:roleId/permissions')
  @Permissions('roles', 'update')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiParam({ name: 'roleId', description: 'Role UUID', type: 'string' })
  @ApiBody({ type: AssignPermissionToRoleDto })
  @ApiResponse({ status: 201, description: 'Permission assigned successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot modify system role or permission already assigned',
  })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async assignPermissionToRole(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
    @Body() dto: AssignPermissionToRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.assignPermissionToRole(
      roleId,
      dto.permissionId,
      (req.user as AuthenticatedUser)?.id,
    );
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @Permissions('roles', 'update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiParam({ name: 'roleId', description: 'Role UUID', type: 'string' })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission UUID',
    type: 'string',
  })
  @ApiResponse({ status: 204, description: 'Permission removed successfully' })
  @ApiResponse({ status: 404, description: 'Permission assignment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removePermissionFromRole(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
    @Param('permissionId', new ParseUUIDPipe({ version: '4' }))
    permissionId: string,
  ) {
    return this.accessControlService.removePermissionFromRole(
      roleId,
      permissionId,
    );
  }

  // ============================================================================
  // RBAC OPERATIONS (User Role Assignments)
  // ============================================================================

  @Post('users/:userId/roles')
  @Permissions('users', 'manage')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiParam({ name: 'userId', description: 'User UUID', type: 'string' })
  @ApiBody({ type: AssignRoleToUserDto })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - role already assigned or insufficient privileges',
  })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async assignRoleToUser(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() dto: AssignRoleToUserDto,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.assignRoleToUser(
      userId,
      dto.roleId,
      (req.user as AuthenticatedUser)?.id,
    );
  }

  @Delete('users/:userId/roles/:roleId')
  @Permissions('users', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiParam({ name: 'userId', description: 'User UUID', type: 'string' })
  @ApiParam({ name: 'roleId', description: 'Role UUID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Role removed successfully' })
  @ApiResponse({ status: 404, description: 'Role assignment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removeRoleFromUser(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
  ) {
    return this.accessControlService.removeRoleFromUser(userId, roleId);
  }

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiParam({ name: 'userId', description: 'User UUID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserPermissions(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Request() req: ExpressRequest,
  ) {
    // Allow users to view their own permissions, or require permission to view others
    if (userId !== (req.user as AuthenticatedUser)?.id) {
      const hasPermission = await this.accessControlService.checkPermission(
        (req.user as AuthenticatedUser)?.id,
        'users',
        'manage',
      );
      if (!hasPermission) {
        throw new ForbiddenException(
          'Insufficient permissions to view other users permissions',
        );
      }
    }
    return this.accessControlService.getUserPermissions(userId);
  }

  @Post('check-permission')
  @ApiOperation({ summary: 'Check if current user has a specific permission' })
  @ApiBody({ type: CheckPermissionDto })
  @ApiResponse({ status: 200, description: 'Permission check result' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async checkPermission(
    @Body() dto: CheckPermissionDto,
    @Request() req: ExpressRequest,
  ) {
    const hasPermission = await this.accessControlService.checkPermission(
      (req.user as AuthenticatedUser)?.id,
      dto.resource,
      dto.action,
    );
    return { hasPermission };
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  @Get('sessions/user/:userId')
  @ApiOperation({ summary: 'Get active sessions for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserSessions(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Request() req: ExpressRequest,
  ) {
    // Allow users to view their own sessions, or require permission to view others
    if (userId !== (req.user as AuthenticatedUser)?.id) {
      const hasPermission = await this.accessControlService.checkPermission(
        (req.user as AuthenticatedUser)?.id,
        'sessions',
        'manage',
      );
      if (!hasPermission) {
        throw new ForbiddenException(
          'Insufficient permissions to view other users sessions',
        );
      }
    }
    return this.accessControlService.getUserSessions(userId);
  }

  @Delete('sessions/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific session' })
  @ApiParam({ name: 'token', description: 'Session token', type: 'string' })
  @ApiResponse({ status: 204, description: 'Session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteSession(@Param('token') token: string) {
    return this.accessControlService.deleteSession(token);
  }

  @Delete('sessions/user/:userId/all')
  @Permissions('sessions', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete all sessions for a user' })
  @ApiParam({ name: 'userId', description: 'User UUID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'All sessions deleted successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteAllUserSessions(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.accessControlService.deleteAllUserSessions(userId);
  }

  // ============================================================================
  // SECURITY MANAGEMENT
  // ============================================================================

  @Get('security/incidents')
  @Permissions('security', 'read')
  @ApiOperation({ summary: 'Get security incidents with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({
    status: 200,
    description: 'Security incidents retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSecurityIncidents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
  ) {
    const filters: SecurityIncidentFilters = {};
    if (type) filters.type = type;
    if (severity) filters.severity = severity;
    if (status) filters.status = status;

    return this.accessControlService.getSecurityIncidents(
      Number(page) || 1,
      Number(limit) || 20,
      filters,
    );
  }

  @Post('security/incidents')
  @Permissions('security', 'manage')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a security incident' })
  @ApiBody({ type: AccessControlCreateIncidentDto })
  @ApiResponse({
    status: 201,
    description: 'Security incident created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createSecurityIncident(
    @Body() dto: AccessControlCreateIncidentDto,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.createSecurityIncident({
      ...dto,
      detectedBy: dto.detectedBy || (req.user as AuthenticatedUser)?.id,
    });
  }

  @Get('security/statistics')
  @Permissions('security', 'read')
  @ApiOperation({ summary: 'Get security statistics' })
  @ApiResponse({
    status: 200,
    description: 'Security statistics retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSecurityStatistics() {
    return this.accessControlService.getSecurityStatistics();
  }

  @Get('security/ip-restrictions')
  @Permissions('security', 'manage')
  @ApiOperation({ summary: 'Get all IP restrictions' })
  @ApiResponse({
    status: 200,
    description: 'IP restrictions retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getIpRestrictions() {
    return this.accessControlService.getIpRestrictions();
  }

  @Post('security/ip-restrictions')
  @Permissions('security', 'manage')
  @ApiOperation({ summary: 'Add an IP restriction' })
  @ApiBody({ type: AccessControlCreateIpRestrictionDto })
  @ApiResponse({
    status: 201,
    description: 'IP restriction added successfully',
  })
  @ApiResponse({ status: 400, description: 'IP restriction already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addIpRestriction(
    @Body() dto: AccessControlCreateIpRestrictionDto,
    @Request() req: ExpressRequest,
  ) {
    return this.accessControlService.addIpRestriction({
      ...dto,
      createdBy: dto.createdBy || (req.user as AuthenticatedUser)?.id,
    });
  }

  @Delete('security/ip-restrictions/:id')
  @Permissions('security', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an IP restriction' })
  @ApiParam({ name: 'id', description: 'IP Restriction UUID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'IP restriction removed successfully',
  })
  @ApiResponse({ status: 404, description: 'IP restriction not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removeIpRestriction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.accessControlService.removeIpRestriction(id);
  }

  // ============================================================================
  // SYSTEM INITIALIZATION
  // ============================================================================

  @Post('initialize')
  @Permissions('system', 'configure')
  @ApiOperation({ summary: 'Initialize default roles and permissions' })
  @ApiResponse({
    status: 201,
    description: 'Default roles and permissions initialized',
  })
  @ApiResponse({ status: 200, description: 'Roles already initialized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async initializeDefaultRoles() {
    await this.accessControlService.initializeDefaultRoles();
    return {
      message: 'Default roles and permissions initialized successfully',
    };
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  @Get('cache/statistics')
  @Permissions('system', 'configure')
  @ApiOperation({ summary: 'Get permission cache statistics' })
  @ApiResponse({
    status: 200,
    description: 'Cache statistics retrieved successfully',
  })
  async getCacheStatistics() {
    return this.cacheService.getStatistics();
  }

  @Delete('cache/clear')
  @Permissions('system', 'configure')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear all permission caches' })
  @ApiResponse({ status: 204, description: 'Caches cleared successfully' })
  async clearCache() {
    this.cacheService.clearAll();
    return { message: 'All caches cleared' };
  }

  @Delete('cache/users/:userId')
  @Permissions('users', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cache for specific user' })
  @ApiParam({ name: 'userId', description: 'User UUID', type: 'string' })
  @ApiResponse({ status: 204, description: 'User cache cleared successfully' })
  async clearUserCache(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    this.cacheService.invalidateUserPermissions(userId);
    return { message: 'User cache cleared' };
  }
}
