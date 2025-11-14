"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const user_filters_dto_1 = require("./dto/user-filters.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const user_response_dto_2 = require("./dto/user-response.dto");
const user_statistics_dto_1 = require("./dto/user-statistics.dto");
const enums_1 = require("./enums");
const base_1 = require("../../common/base");
let UserController = class UserController extends base_1.BaseController {
    userService;
    constructor(userService) {
        super();
        this.userService = userService;
    }
    async getUsers(filters) {
        return this.userService.getUsers(filters);
    }
    async getUserStatistics() {
        return this.userService.getUserStatistics();
    }
    async getAvailableNurses() {
        return this.userService.getAvailableNurses();
    }
    async getUsersByRole(role) {
        return this.userService.getUsersByRole(role);
    }
    async getUserById(id) {
        return this.userService.getUserById(id);
    }
    async createUser(createUserDto) {
        return this.userService.createUser(createUserDto);
    }
    async updateUser(id, updateUserDto) {
        return this.userService.updateUser(id, updateUserDto);
    }
    async changePassword(id, changePasswordDto) {
        return this.userService.changePassword(id, changePasswordDto);
    }
    async resetPassword(id, resetPasswordDto) {
        return this.userService.resetUserPassword(id, resetPasswordDto.newPassword);
    }
    async reactivateUser(id) {
        return this.userService.reactivateUser(id);
    }
    async deactivateUser(id) {
        return this.userService.deactivateUser(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get paginated list of users with filters", summary: 'Get paginated user list',
        description: 'Retrieve users with optional filtering by search term, role, and active status' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users retrieved successfully',
        type: user_response_dto_1.UserListResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, enum: enums_1.UserRole }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_filters_dto_1.UserFiltersDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get user statistics", summary: 'Get user statistics',
        description: 'Retrieve comprehensive user statistics including counts by role and activity' }),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        type: user_statistics_dto_1.UserStatisticsDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/user-statistics.dto").UserStatisticsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get available nurses", summary: 'Get available nurses',
        description: 'Retrieve all active nurses with their current student counts' }),
    (0, common_1.Get)('nurses/available'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Nurses retrieved successfully',
        type: [user_response_dto_2.UserResponseDto],
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAvailableNurses", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get users by role", summary: 'Get users by role',
        description: 'Retrieve all active users with a specific role' }),
    (0, common_1.Get)('role/:role'),
    (0, swagger_1.ApiParam)({
        name: 'role',
        enum: enums_1.UserRole,
        description: 'User role to filter by',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users retrieved successfully',
        type: [user_response_dto_2.UserResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsersByRole", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get user by ID", summary: 'Get user by ID',
        description: 'Retrieve a single user by their UUID' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User retrieved successfully',
        type: user_response_dto_2.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create new user", summary: 'Create new user',
        description: 'Create a new user with email, password, and role' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created successfully',
        type: user_response_dto_2.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update user", summary: 'Update user',
        description: 'Update user information (partial update supported)' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User updated successfully',
        type: user_response_dto_2.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already in use' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update user password", summary: 'Update user password',
        description: 'Update user password with current password verification (user-initiated)' }),
    (0, common_1.Patch)(':id/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Current password incorrect' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.UserChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Reset user password (admin function)", summary: 'Reset user password (admin)',
        description: 'Reset user password without current password verification (admin function)' }),
    (0, common_1.Post)(':id/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.AdminResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Reactivate user", summary: 'Reactivate user',
        description: 'Reactivate a previously deactivated user' }),
    (0, common_1.Post)(':id/reactivate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User reactivated successfully',
        type: user_response_dto_2.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "reactivateUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Deactivate user (soft delete)", summary: 'Deactivate user',
        description: 'Deactivate user (soft delete - maintains data for audit)' }),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User deactivated successfully',
        type: user_response_dto_2.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deactivateUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map