import { User } from '../database/models/core/User';
import { Student } from '../database/models/core/Student';
import { BaseService } from '../database/services/BaseService';
import { Op } from 'sequelize';

class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  async getUsers(filters: any = {}) {
    const where = this.buildWhereClause(filters);

    return await User.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'nurseManagedStudents',
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getUserById(id: string) {
    return await this.findById(id, {
      include: [
        {
          model: Student,
          as: 'nurseManagedStudents',
        },
      ],
    });
  }

  async createUser(data: any) {
    return await this.create(data);
  }

  async updateUser(id: string, data: any) {
    return await this.update(id, data);
  }

  async deleteUser(id: string) {
    return await this.delete(id);
  }

  async getUsersByRole(role: string) {
    return await User.findAll({
      where: { role, isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
  }

  async searchUsers(searchTerm: string) {
    return await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
        ],
        isActive: true,
      },
      limit: 50,
    });
  }
}

export const userService = new UserService();
