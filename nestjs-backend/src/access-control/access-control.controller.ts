import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccessControlService } from './access-control.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionToRoleDto } from './dto/assign-permission-to-role.dto';
import { AssignRoleToUserDto } from './dto/assign-role-to-user.dto';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { CreateIpRestrictionDto } from './dto/create-ip-restriction.dto';
import { CreateSecurityIncidentDto } from './dto/create-security-incident.dto';
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
  constructor(private readonly accessControlService: AccessControlService) {}

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
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleById(@Param('id') id: string) {
    return this.accessControlService.getRoleById(id);
  }

  @Post('roles')
  @Permissions('roles', 'create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or duplicate name' })
  async createRole(@Body() createRoleDto: CreateRoleDto, @Request() req) {
    return this.accessControlService.createRole(createRoleDto, req.user?.id);
  }

  @Patch('roles/:id')
  @Permissions('roles', 'update')
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - cannot modify system roles' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Request() req) {
    return this.accessControlService.updateRole(id, updateRoleDto, req.user?.id);
  }

  @Delete('roles/:id')
  @Permissions('roles', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete system role or role with users' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async deleteRole(@Param('id') id: string, @Request() req) {
    return this.accessControlService.deleteRole(id, req.user?.id);
  }

  // ============================================================================
  // PERMISSION MANAGEMENT
  // ============================================================================

  @Get('permissions')
  @Permissions('permissions', 'read')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  async getPermissions() {
    return this.accessControlService.getPermissions();
  }

  @Post('permissions')
  @Permissions('permissions', 'create')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.accessControlService.createPermission(createPermissionDto);
  }

  @Post('roles/:roleId/permissions')
  @Permissions('roles', 'update')
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiResponse({ status: 201, description: 'Permission assigned successfully' })
  @ApiResponse({ status: 400, description: 'Cannot modify system role or permission already assigned' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Body() dto: AssignPermissionToRoleDto,
    @Request() req,
  ) {
    return this.accessControlService.assignPermissionToRole(roleId, dto.permissionId, req.user?.id);
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @Permissions('roles', 'update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiResponse({ status: 204, description: 'Permission removed successfully' })
  @ApiResponse({ status: 404, description: 'Permission assignment not found' })
  async removePermissionFromRole(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
    return this.accessControlService.removePermissionFromRole(roleId, permissionId);
  }

  // ============================================================================
  // RBAC OPERATIONS (User Role Assignments)
  // ============================================================================

  @Post('users/:userId/roles')
  @Permissions('users', 'manage')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - role already assigned or insufficient privileges',
  })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async assignRoleToUser(
    @Param('userId') userId: string,
    @Body() dto: AssignRoleToUserDto,
    @Request() req,
  ) {
    return this.accessControlService.assignRoleToUser(userId, dto.roleId, req.user?.id);
  }

  @Delete('users/:userId/roles/:roleId')
  @Permissions('users', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 204, description: 'Role removed successfully' })
  @ApiResponse({ status: 404, description: 'Role assignment not found' })
  async removeRoleFromUser(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.accessControlService.removeRoleFromUser(userId, roleId);
  }

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPermissions(@Param('userId') userId: string, @Request() req) {
    // Allow users to view their own permissions, or require permission to view others
    if (userId !== req.user?.id) {
      const hasPermission = await this.accessControlService.checkPermission(
        req.user?.id,
        'users',
        'manage',
      );
      if (!hasPermission) {
        throw new Error('Forbidden');
      }
    }
    return this.accessControlService.getUserPermissions(userId);
  }

  @Post('check-permission')
  @ApiOperation({ summary: 'Check if current user has a specific permission' })
  @ApiResponse({ status: 200, description: 'Permission check result' })
  async checkPermission(@Body() dto: CheckPermissionDto, @Request() req) {
    const hasPermission = await this.accessControlService.checkPermission(
      req.user?.id,
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
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  async getUserSessions(@Param('userId') userId: string, @Request() req) {
    // Allow users to view their own sessions, or require permission to view others
    if (userId !== req.user?.id) {
      const hasPermission = await this.accessControlService.checkPermission(
        req.user?.id,
        'sessions',
        'manage',
      );
      if (!hasPermission) {
        throw new Error('Forbidden');
      }
    }
    return this.accessControlService.getUserSessions(userId);
  }

  @Delete('sessions/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific session' })
  @ApiResponse({ status: 204, description: 'Session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async deleteSession(@Param('token') token: string) {
    return this.accessControlService.deleteSession(token);
  }

  @Delete('sessions/user/:userId/all')
  @Permissions('sessions', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all sessions for a user' })
  @ApiResponse({ status: 204, description: 'All sessions deleted successfully' })
  async deleteAllUserSessions(@Param('userId') userId: string) {
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
  @ApiResponse({ status: 200, description: 'Security incidents retrieved successfully' })
  async getSecurityIncidents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
  ) {
    const filters: any = {};
    if (type) filters.type = type;
    if (severity) filters.severity = severity;
    if (status) filters.status = status;

    return this.accessControlService.getSecurityIncidents(Number(page) || 1, Number(limit) || 20, filters);
  }

  @Post('security/incidents')
  @Permissions('security', 'manage')
  @ApiOperation({ summary: 'Create a security incident' })
  @ApiResponse({ status: 201, description: 'Security incident created successfully' })
  async createSecurityIncident(@Body() dto: CreateSecurityIncidentDto, @Request() req) {
    return this.accessControlService.createSecurityIncident({
      ...dto,
      detectedBy: dto.detectedBy || req.user?.id,
    });
  }

  @Get('security/statistics')
  @Permissions('security', 'read')
  @ApiOperation({ summary: 'Get security statistics' })
  @ApiResponse({ status: 200, description: 'Security statistics retrieved successfully' })
  async getSecurityStatistics() {
    return this.accessControlService.getSecurityStatistics();
  }

  @Get('security/ip-restrictions')
  @Permissions('security', 'manage')
  @ApiOperation({ summary: 'Get all IP restrictions' })
  @ApiResponse({ status: 200, description: 'IP restrictions retrieved successfully' })
  async getIpRestrictions() {
    return this.accessControlService.getIpRestrictions();
  }

  @Post('security/ip-restrictions')
  @Permissions('security', 'manage')
  @ApiOperation({ summary: 'Add an IP restriction' })
  @ApiResponse({ status: 201, description: 'IP restriction added successfully' })
  @ApiResponse({ status: 400, description: 'IP restriction already exists' })
  async addIpRestriction(@Body() dto: CreateIpRestrictionDto, @Request() req) {
    return this.accessControlService.addIpRestriction({
      ...dto,
      createdBy: dto.createdBy || req.user?.id,
    });
  }

  @Delete('security/ip-restrictions/:id')
  @Permissions('security', 'manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an IP restriction' })
  @ApiResponse({ status: 204, description: 'IP restriction removed successfully' })
  @ApiResponse({ status: 404, description: 'IP restriction not found' })
  async removeIpRestriction(@Param('id') id: string) {
    return this.accessControlService.removeIpRestriction(id);
  }

  // ============================================================================
  // SYSTEM INITIALIZATION
  // ============================================================================

  @Post('initialize')
  @Permissions('system', 'configure')
  @ApiOperation({ summary: 'Initialize default roles and permissions' })
  @ApiResponse({ status: 201, description: 'Default roles and permissions initialized' })
  @ApiResponse({ status: 200, description: 'Roles already initialized' })
  async initializeDefaultRoles() {
    await this.accessControlService.initializeDefaultRoles();
    return { message: 'Default roles and permissions initialized successfully' };
  }
}
