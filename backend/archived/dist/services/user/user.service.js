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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../common/context/request-context.service");
const base_1 = require("../../common/base");
const models_1 = require("../../database/models");
const enums_1 = require("./enums");
const services_1 = require("../../database/services");
let UserService = class UserService extends base_1.BaseService {
    requestContext;
    userModel;
    queryCacheService;
    constructor(requestContext, userModel, queryCacheService) {
        super(requestContext);
        this.requestContext = requestContext;
        this.userModel = userModel;
        this.queryCacheService = queryCacheService;
    }
    async getUsers(filters) {
        try {
            const { page = 1, limit = 20, search, role, isActive } = filters;
            const offset = (page - 1) * limit;
            const whereClause = {};
            if (search) {
                whereClause[sequelize_2.Op.or] = [
                    { firstName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { lastName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { email: { [sequelize_2.Op.iLike]: `%${search}%` } },
                ];
            }
            if (role) {
                whereClause.role = role;
            }
            if (isActive !== undefined) {
                whereClause.isActive = isActive;
            }
            const { rows: users, count: total } = await this.userModel.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                attributes: {
                    exclude: [
                        'password',
                        'passwordResetToken',
                        'passwordResetExpires',
                        'emailVerificationToken',
                        'emailVerificationExpires',
                        'twoFactorSecret',
                    ],
                },
                order: [['createdAt', 'DESC']],
            });
            const safeUsers = users.map((user) => user.toSafeObject());
            return {
                users: safeUsers,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logger.error('Error fetching users:', error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const users = await this.queryCacheService.findWithCache(this.userModel, { where: { id } }, {
                ttl: 300,
                keyPrefix: 'user_id',
                invalidateOn: ['update', 'destroy'],
            });
            if (!users || users.length === 0) {
                throw new common_1.NotFoundException('User not found');
            }
            return users[0].toSafeObject();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error('Error fetching user by ID:', error);
            throw error;
        }
    }
    async createUser(createUserDto) {
        try {
            const existingUser = await this.userModel.findOne({
                where: { email: createUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User already exists with this email');
            }
            const user = await this.userModel.create(createUserDto);
            this.logger.log(`User created: ${user.firstName} ${user.lastName} (${user.email})`);
            return user.toSafeObject();
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error('Error creating user:', error);
            throw error;
        }
    }
    async updateUser(id, updateUserDto) {
        try {
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const emailTaken = await this.userModel.findOne({
                    where: { email: updateUserDto.email },
                });
                if (emailTaken) {
                    throw new common_1.ConflictException('Email address is already in use');
                }
            }
            await user.update(updateUserDto);
            this.logger.log(`User updated: ${user.firstName} ${user.lastName} (${user.email})`);
            return user.toSafeObject();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error('Error updating user:', error);
            throw error;
        }
    }
    async changePassword(id, changePasswordDto) {
        try {
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const isValidPassword = await user.comparePassword(changePasswordDto.currentPassword);
            if (!isValidPassword) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            user.password = changePasswordDto.newPassword;
            await user.save();
            this.logger.log(`Password changed for user: ${user.firstName} ${user.lastName}`);
            return { success: true };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('Error changing password:', error);
            throw error;
        }
    }
    async deactivateUser(id) {
        try {
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            await user.update({ isActive: false });
            this.logger.log(`User deactivated: ${user.firstName} ${user.lastName} (${user.email})`);
            return user.toSafeObject();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error('Error deactivating user:', error);
            throw error;
        }
    }
    async reactivateUser(id) {
        try {
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            await user.update({ isActive: true });
            this.logger.log(`User reactivated: ${user.firstName} ${user.lastName} (${user.email})`);
            return user.toSafeObject();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error('Error reactivating user:', error);
            throw error;
        }
    }
    async getUserStatistics() {
        try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const [total, active, inactive, recentLogins] = await Promise.all([
                this.userModel.count(),
                this.userModel.count({ where: { isActive: true } }),
                this.userModel.count({ where: { isActive: false } }),
                this.userModel.count({
                    where: {
                        lastLogin: {
                            [sequelize_2.Op.gte]: thirtyDaysAgo,
                        },
                    },
                }),
            ]);
            const byRoleResults = await this.userModel.findAll({
                attributes: [
                    'role',
                    [this.userModel.sequelize.fn('COUNT', '*'), 'count'],
                ],
                group: ['role'],
                raw: true,
            });
            const byRole = {};
            byRoleResults.forEach((item) => {
                byRole[item.role] = parseInt(item.count, 10);
            });
            return {
                total,
                active,
                inactive,
                byRole,
                recentLogins,
            };
        }
        catch (error) {
            this.logger.error('Error fetching user statistics:', error);
            throw error;
        }
    }
    async getUsersByRole(role) {
        try {
            const users = await this.queryCacheService.findWithCache(this.userModel, {
                where: {
                    role,
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                attributes: {
                    exclude: [
                        'password',
                        'passwordResetToken',
                        'passwordResetExpires',
                        'emailVerificationToken',
                        'emailVerificationExpires',
                        'twoFactorSecret',
                    ],
                },
            }, {
                ttl: 600,
                keyPrefix: 'user_role',
                invalidateOn: ['create', 'update', 'destroy'],
            });
            return users.map((user) => user.toSafeObject());
        }
        catch (error) {
            this.logger.error('Error fetching users by role:', error);
            throw error;
        }
    }
    async resetUserPassword(id, newPassword) {
        try {
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            user.password = newPassword;
            user.mustChangePassword = true;
            await user.save();
            this.logger.log(`Password reset for user: ${user.firstName} ${user.lastName} (${user.email})`);
            return { success: true };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error('Error resetting user password:', error);
            throw error;
        }
    }
    async getAvailableNurses() {
        try {
            const nurses = await this.userModel.findAll({
                where: {
                    role: enums_1.UserRole.NURSE,
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                attributes: {
                    exclude: [
                        'password',
                        'passwordResetToken',
                        'passwordResetExpires',
                        'emailVerificationToken',
                        'emailVerificationExpires',
                        'twoFactorSecret',
                    ],
                },
            });
            return nurses.map((nurse) => ({
                ...nurse.toSafeObject(),
                currentStudentCount: 0,
            }));
        }
        catch (error) {
            this.logger.error('Error fetching available nurses:', error);
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.User)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, services_1.QueryCacheService])
], UserService);
//# sourceMappingURL=user.service.js.map