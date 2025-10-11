import { Model, ModelStatic, Transaction, Op, WhereOptions, FindOptions, Attributes, CreationAttributes } from 'sequelize';
import sequelize from '../models';
import { logger } from '../../utils/logger';

export abstract class BaseService<M extends Model> {
  protected model: ModelStatic<M>;
  protected modelName: string;

  constructor(model: ModelStatic<M>) {
    this.model = model;
    this.modelName = model.name;
  }

  async findById(id: string | number, options: Omit<FindOptions<Attributes<M>>, 'where'> = {}): Promise<M | null> {
    try {
      const record = await this.model.findByPk(id, options);
      if (record && this.isPHI()) {
        await this.auditAccess('READ', id, 'findById');
      }
      return record;
    } catch (error) {
      logger.error(`Error finding ${this.modelName} by ID:`, error);
      throw error;
    }
  }

  async findOne(options: FindOptions<Attributes<M>>): Promise<M | null> {
    try {
      const record = await this.model.findOne(options);
      if (record && this.isPHI()) {
        await this.auditAccess('READ', (record as any).id, 'findOne');
      }
      return record;
    } catch (error) {
      logger.error(`Error finding ${this.modelName}:`, error);
      throw error;
    }
  }

  async findAll(options: FindOptions<Attributes<M>> = {}): Promise<M[]> {
    try {
      const records = await this.model.findAll(options);
      if (records.length > 0 && this.isPHI()) {
        await this.auditAccess('READ', `multiple (${records.length})`, 'findAll');
      }
      return records;
    } catch (error) {
      logger.error(`Error finding all ${this.modelName}:`, error);
      throw error;
    }
  }

  async findAndCountAll(options: FindOptions<Attributes<M>> = {}): Promise<{ rows: M[]; count: number }> {
    try {
      const result = await this.model.findAndCountAll(options);
      if (result.rows.length > 0 && this.isPHI()) {
        await this.auditAccess('READ', `paginated (${result.count} total)`, 'findAndCountAll');
      }
      return result;
    } catch (error) {
      logger.error(`Error finding and counting ${this.modelName}:`, error);
      throw error;
    }
  }

  async create(data: CreationAttributes<M>, options: { transaction?: Transaction } = {}): Promise<M> {
    try {
      const record = await this.model.create(data as any, options);
      if (this.isPHI()) {
        await this.auditAccess('CREATE', (record as any).id, 'create');
      }
      logger.info(`${this.modelName} created: ${(record as any).id}`);
      return record;
    } catch (error) {
      logger.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async update(id: string | number, data: Partial<Attributes<M>>, options: { transaction?: Transaction } = {}): Promise<M> {
    try {
      const record = await this.findById(id);
      if (!record) {
        throw new Error(`${this.modelName} not found`);
      }
      await record.update(data as any, options);
      if (this.isPHI()) {
        await this.auditAccess('UPDATE', id, 'update', data);
      }
      logger.info(`${this.modelName} updated: ${id}`);
      return record;
    } catch (error) {
      logger.error(`Error updating ${this.modelName}:`, error);
      throw error;
    }
  }

  async delete(id: string | number, options: { transaction?: Transaction; force?: boolean } = {}): Promise<boolean> {
    try {
      const record = await this.findById(id);
      if (!record) {
        throw new Error(`${this.modelName} not found`);
      }
      if ('isActive' in record && !options.force) {
        await record.update({ isActive: false } as any, options);
      } else {
        await record.destroy(options);
      }
      if (this.isPHI()) {
        await this.auditAccess('DELETE', id, 'delete');
      }
      logger.info(`${this.modelName} deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }

  async count(options: Omit<FindOptions<Attributes<M>>, 'attributes'> = {}): Promise<number> {
    try {
      return await this.model.count(options);
    } catch (error) {
      logger.error(`Error counting ${this.modelName}:`, error);
      throw error;
    }
  }

  async bulkCreate(records: CreationAttributes<M>[], options: { transaction?: Transaction } = {}): Promise<M[]> {
    try {
      const created = await this.model.bulkCreate(records as any[], options);
      if (this.isPHI()) {
        await this.auditAccess('CREATE', `bulk (${created.length})`, 'bulkCreate');
      }
      logger.info(`${this.modelName} bulk created: ${created.length} records`);
      return created;
    } catch (error) {
      logger.error(`Error bulk creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async executeTransaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await sequelize.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Transaction failed for ${this.modelName}:`, error);
      throw error;
    }
  }

  protected isPHI(): boolean {
    const phiModels = ['Student', 'HealthRecord', 'Allergy', 'Medication', 'MedicationLog', 'Appointment', 'IncidentReport'];
    return phiModels.includes(this.modelName);
  }

  protected async auditAccess(
    action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    entityId: string | number,
    method: string,
    changes?: any
  ): Promise<void> {
    try {
      logger.info('PHI Access Audit', {
        timestamp: new Date().toISOString(),
        modelName: this.modelName,
        action,
        entityId,
        method,
        changes: changes ? JSON.stringify(changes).substring(0, 200) : undefined,
      });
    } catch (error) {
      logger.error('Error creating audit log:', error);
    }
  }

  protected buildWhereClause(filters: any): WhereOptions<Attributes<M>> {
    const where: any = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const operatorValue = value as any;
        if ('contains' in operatorValue) {
          where[key] = { [Op.iLike]: `%${operatorValue.contains}%` };
        } else if ('gt' in operatorValue) {
          where[key] = { [Op.gt]: operatorValue.gt };
        } else if ('gte' in operatorValue) {
          where[key] = { [Op.gte]: operatorValue.gte };
        } else if ('lt' in operatorValue) {
          where[key] = { [Op.lt]: operatorValue.lt };
        } else if ('lte' in operatorValue) {
          where[key] = { [Op.lte]: operatorValue.lte };
        } else if ('in' in operatorValue) {
          where[key] = { [Op.in]: operatorValue.in };
        }
      } else {
        where[key] = value;
      }
    }
    return where;
  }

  protected convertOrderBy(orderBy: any): any[] {
    if (!orderBy) return [];
    if (Array.isArray(orderBy)) {
      return orderBy.flatMap((o) => this.convertOrderBy(o));
    }
    const orders: any[] = [];
    for (const [field, direction] of Object.entries(orderBy)) {
      if (typeof direction === 'string') {
        orders.push([field, direction.toUpperCase()]);
      }
    }
    return orders;
  }
}

export default BaseService;
