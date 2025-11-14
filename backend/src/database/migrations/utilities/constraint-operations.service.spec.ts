import { QueryInterface, Sequelize, Transaction } from 'sequelize';
import {
  addForeignKeyConstraint,
  addCheckConstraint,
  removeConstraintSafely,
  addUniqueConstraint,
  replaceConstraint,
  checkConstraintExists,
  createOptimizedIndex,
  dropIndexSafely,
  createCompositeIndex,
  createUniqueIndex,
  recreateIndex,
  checkIndexExists,
  analyzeIndexUsage,
  ForeignKeyConstraint,
  IndexDefinition,
} from './constraint-operations.service';

describe('Constraint Operations Service', () => {
  let mockQueryInterface: jest.Mocked<QueryInterface>;
  let mockSequelize: jest.Mocked<Sequelize>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockTransaction = {} as jest.Mocked<Transaction>;

    mockSequelize = {
      getDialect: jest.fn().mockReturnValue('postgres'),
      query: jest.fn().mockResolvedValue([[{ exists: true }]]),
    } as unknown as jest.Mocked<Sequelize>;

    mockQueryInterface = {
      sequelize: mockSequelize,
      addConstraint: jest.fn().mockResolvedValue(undefined),
      removeIndex: jest.fn().mockResolvedValue(undefined),
      addIndex: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueryInterface>;
  });

  describe('addForeignKeyConstraint', () => {
    const constraint: ForeignKeyConstraint = {
      fields: ['userId'],
      name: 'orders_user_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    };

    it('should add foreign key constraint', async () => {
      await addForeignKeyConstraint(mockQueryInterface, 'Orders', constraint);

      expect(mockQueryInterface.addConstraint).toHaveBeenCalledWith(
        'Orders',
        expect.objectContaining({
          fields: ['userId'],
          type: 'foreign key',
          name: 'orders_user_fkey',
        })
      );
    });

    it('should use default actions if not specified', async () => {
      const simpleConstraint = {
        fields: ['userId'],
        name: 'fk_user',
        references: { table: 'Users', field: 'id' },
      };

      await addForeignKeyConstraint(
        mockQueryInterface,
        'Orders',
        simpleConstraint as ForeignKeyConstraint
      );

      expect(mockQueryInterface.addConstraint).toHaveBeenCalledWith(
        'Orders',
        expect.objectContaining({
          onDelete: 'NO ACTION',
          onUpdate: 'NO ACTION',
        })
      );
    });
  });

  describe('addCheckConstraint', () => {
    it('should add check constraint', async () => {
      await addCheckConstraint(
        mockQueryInterface,
        'Products',
        'price_positive',
        'price > 0'
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE'),
        expect.any(Object)
      );
    });
  });

  describe('removeConstraintSafely', () => {
    it('should remove constraint if exists', async () => {
      await removeConstraintSafely(mockQueryInterface, 'Orders', 'fk_user');

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('DROP CONSTRAINT'),
        expect.any(Object)
      );
    });

    it('should skip if constraint does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      await removeConstraintSafely(
        mockQueryInterface,
        'Orders',
        'nonexistent',
        { ifExists: true }
      );

      expect(mockSequelize.query).toHaveBeenCalledTimes(1); // Only check query
    });

    it('should cascade if requested', async () => {
      await removeConstraintSafely(
        mockQueryInterface,
        'Orders',
        'fk_user',
        { cascade: true }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('CASCADE'),
        expect.any(Object)
      );
    });
  });

  describe('addUniqueConstraint', () => {
    it('should add unique constraint', async () => {
      await addUniqueConstraint(
        mockQueryInterface,
        'UserRoles',
        ['userId', 'roleId'],
        'user_roles_unique'
      );

      expect(mockQueryInterface.addConstraint).toHaveBeenCalledWith(
        'UserRoles',
        expect.objectContaining({
          fields: ['userId', 'roleId'],
          type: 'unique',
          name: 'user_roles_unique',
        })
      );
    });
  });

  describe('checkConstraintExists', () => {
    it('should return true if constraint exists (postgres)', async () => {
      const exists = await checkConstraintExists(
        mockQueryInterface,
        'Orders',
        'fk_user'
      );

      expect(exists).toBe(true);
    });

    it('should return false if constraint does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      const exists = await checkConstraintExists(
        mockQueryInterface,
        'Orders',
        'nonexistent'
      );

      expect(exists).toBe(false);
    });

    it('should handle MySQL dialect', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('mysql');
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 1 }]]);

      const exists = await checkConstraintExists(
        mockQueryInterface,
        'Orders',
        'fk_user'
      );

      expect(exists).toBe(true);
    });
  });

  describe('createOptimizedIndex', () => {
    const indexDef: IndexDefinition = {
      name: 'users_email_idx',
      fields: ['email'],
      unique: true,
    };

    it('should create index', async () => {
      await createOptimizedIndex(mockQueryInterface, 'Users', indexDef);

      expect(mockQueryInterface.addIndex).toHaveBeenCalledWith(
        'Users',
        ['email'],
        expect.objectContaining({ name: 'users_email_idx', unique: true })
      );
    });

    it('should create concurrent index for postgres', async () => {
      const concurrentDef = { ...indexDef, concurrently: true };

      await createOptimizedIndex(mockQueryInterface, 'Users', concurrentDef);

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('CONCURRENTLY'),
        expect.any(Object)
      );
    });
  });

  describe('dropIndexSafely', () => {
    it('should drop index if exists', async () => {
      await dropIndexSafely(mockQueryInterface, 'Users', 'users_email_idx');

      expect(mockQueryInterface.removeIndex).toHaveBeenCalledWith(
        'Users',
        'users_email_idx',
        expect.any(Object)
      );
    });

    it('should skip if index does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      await dropIndexSafely(
        mockQueryInterface,
        'Users',
        'nonexistent',
        { ifExists: true }
      );

      expect(mockQueryInterface.removeIndex).not.toHaveBeenCalled();
    });

    it('should drop concurrently for postgres', async () => {
      await dropIndexSafely(
        mockQueryInterface,
        'Users',
        'users_email_idx',
        { concurrently: true }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('CONCURRENTLY'),
        expect.any(Object)
      );
    });
  });

  describe('createCompositeIndex', () => {
    it('should create composite index', async () => {
      await createCompositeIndex(
        mockQueryInterface,
        'Orders',
        [
          { name: 'userId', order: 'ASC' },
          { name: 'createdAt', order: 'DESC' },
        ],
        'orders_user_created_idx'
      );

      expect(mockQueryInterface.addIndex).toHaveBeenCalled();
    });
  });

  describe('createUniqueIndex', () => {
    it('should create unique index', async () => {
      await createUniqueIndex(
        mockQueryInterface,
        'Users',
        ['email'],
        'users_email_unique'
      );

      expect(mockQueryInterface.addIndex).toHaveBeenCalledWith(
        'Users',
        ['email'],
        expect.objectContaining({ unique: true })
      );
    });
  });

  describe('recreateIndex', () => {
    it('should drop and recreate index', async () => {
      const indexDef: IndexDefinition = {
        fields: ['name'],
        unique: false,
      };

      await recreateIndex(
        mockQueryInterface,
        'Users',
        'users_name_idx',
        indexDef
      );

      expect(mockQueryInterface.removeIndex).toHaveBeenCalled();
      expect(mockQueryInterface.addIndex).toHaveBeenCalled();
    });
  });

  describe('checkIndexExists', () => {
    it('should return true if index exists', async () => {
      const exists = await checkIndexExists(
        mockQueryInterface,
        'Users',
        'users_email_idx'
      );

      expect(exists).toBe(true);
    });

    it('should return false if index does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      const exists = await checkIndexExists(
        mockQueryInterface,
        'Users',
        'nonexistent'
      );

      expect(exists).toBe(false);
    });
  });

  describe('analyzeIndexUsage', () => {
    it('should analyze indexes for postgres', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([
        [
          {
            name: 'users_email_idx',
            columns: ['email'],
            unique: true,
            size: '8192 bytes',
            usage: 100,
          },
        ],
      ]);

      const analysis = await analyzeIndexUsage(mockQueryInterface, 'Users');

      expect(analysis.indexes).toHaveLength(1);
      expect(analysis.recommendations).toBeDefined();
    });

    it('should recommend dropping unused indexes', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([
        [
          {
            name: 'unused_idx',
            columns: ['field'],
            unique: false,
            size: '8192 bytes',
            usage: 0,
          },
        ],
      ]);

      const analysis = await analyzeIndexUsage(mockQueryInterface, 'Users');

      expect(analysis.recommendations).toContain(
        expect.stringContaining('unused index')
      );
    });

    it('should handle MySQL dialect', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('mysql');
      mockSequelize.query = jest.fn().mockResolvedValue([
        [
          {
            name: 'users_email_idx',
            columns: 'email,name',
            unique: true,
          },
        ],
      ]);

      const analysis = await analyzeIndexUsage(mockQueryInterface, 'Users');

      expect(analysis.indexes).toHaveLength(1);
      expect(analysis.indexes[0].columns).toEqual(['email', 'name']);
    });
  });
});
