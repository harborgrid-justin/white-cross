/**
 * User Controller
 * REST API endpoints for user management
 *
 * @security All endpoints should be protected by authentication guards in production
 */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AdminResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserChangePasswordDto } from './dto/change-password.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserListResponseDto } from './dto/user-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserStatisticsDto } from './dto/user-statistics.dto';
import { UserRole } from './enums';

import { BaseController } from '@/common/base';
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get paginated list of users with filters
   */
  @Get()
  @ApiOperation({
    summary: 'Get paginated user list',
    description:
      'Retrieve users with optional filtering by search term, role, and active status',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: UserListResponseDto,
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUsers(@Query() filters: UserFiltersDto) {
    return this.userService.getUsers(filters);
  }

  /**
   * Get user statistics
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get user statistics',
    description:
      'Retrieve comprehensive user statistics including counts by role and activity',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: UserStatisticsDto,
  })
  async getUserStatistics() {
    return this.userService.getUserStatistics();
  }

  /**
   * Get available nurses
   */
  @Get('nurses/available')
  @ApiOperation({
    summary: 'Get available nurses',
    description: 'Retrieve all active nurses with their current student counts',
  })
  @ApiResponse({
    status: 200,
    description: 'Nurses retrieved successfully',
    type: [UserResponseDto],
  })
  async getAvailableNurses() {
    return this.userService.getAvailableNurses();
  }

  /**
   * Get users by role
   */
  @Get('role/:role')
  @ApiOperation({
    summary: 'Get users by role',
    description: 'Retrieve all active users with a specific role',
  })
  @ApiParam({
    name: 'role',
    enum: UserRole,
    description: 'User role to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async getUsersByRole(@Param('role') role: UserRole) {
    return this.userService.getUsersByRole(role);
  }

  /**
   * Get user by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a single user by their UUID',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  /**
   * Create new user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user with email, password, and role',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * Update user
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user information (partial update supported)',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  /**
   * Change user password
   */
  @Post(':id/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description:
      'Change user password with current password verification (user-initiated)',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: UserChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  /**
   * Reset user password (admin function)
   */
  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset user password (admin)',
    description:
      'Reset user password without current password verification (admin function)',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: AdminResetPasswordDto,
  ) {
    return this.userService.resetUserPassword(id, resetPasswordDto.newPassword);
  }

  /**
   * Reactivate user
   */
  @Post(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reactivate user',
    description: 'Reactivate a previously deactivated user',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User reactivated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async reactivateUser(@Param('id') id: string) {
    return this.userService.reactivateUser(id);
  }

  /**
   * Deactivate user (soft delete)
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate user',
    description: 'Deactivate user (soft delete - maintains data for audit)',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(id);
  }
}
