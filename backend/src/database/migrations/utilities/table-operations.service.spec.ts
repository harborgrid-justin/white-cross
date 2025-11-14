import { QueryInterface, Sequelize, DataTypes, Transaction } from 'sequelize';
import {
  createTableWithDefaults,
  safeAlterTable,
  dropTableSafely,
  renameTableWithDependencies,
  checkTableExists,
  getTableRowCount,
  createTableBackup,
  restoreTableFromBackup,
  compareTableStructures,
  TableCreationOptions,
} from './table-operations.service';

describe('Table Operations Service', () => {
  let mockQueryInterface: jest.Mocked<QueryInterface>;
  let mockSequelize: jest.Mocked<Sequelize>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Transaction>;

    mockSequelize = {
      getDialect: jest.fn().mockReturnValue('postgres'),
      query: jest.fn().mockResolvedValue([[{ exists: true, count: 0 }]]),
      transaction: jest.fn().mockResolvedValue(mockTransaction),
    } as unknown as jest.Mocked<Sequelize>;

    mockQueryInterface = {
      sequelize: mockSequelize,
      createTable: jest.fn().mockResolvedValue(undefined),
      dropTable: jest.fn().mockResolvedValue(undefined),
      renameTable: jest.fn().mockResolvedValue(undefined),
      addIndex: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueryInterface>;
  });

  describe('createTableWithDefaults', () => {
    const attributes = {
      name: { type: DataTypes.STRING(50), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false },
    };

    it('should create table with defaults', async () => {
      await createTableWithDefaults(mockQueryInterface, 'Users', attributes);

      expect(mockQueryInterface.createTable).toHaveBeenCalledWith(
        'Users',
        expect.objectContaining({
          name: expect.any(Object),
          email: expect.any(Object),
        }),
        expect.any(Object)
      );
    });

    it('should add timestamps if enabled', async () => {
      const options: TableCreationOptions = { timestamps: true };

      await createTableWithDefaults(
        mockQueryInterface,
        'Users',
        attributes,
        options
      );

      expect(mockQueryInterface.createTable).toHaveBeenCalled();
    });

    it('should add deletedAt for paranoid mode', async () => {
      const options: TableCreationOptions = { paranoid: true };

      await createTableWithDefaults(
        mockQueryInterface,
        'Users',
        attributes,
        options
      );

      const tableAttributes = mockQueryInterface.createTable.mock.calls[0][1];
      expect(tableAttributes).toHaveProperty('deletedAt');
    });

    it('should create indexes', async () => {
      const options: TableCreationOptions = {
        indexes: [
          { fields: ['email'], unique: true },
          { fields: ['name'] },
        ],
      };

      await createTableWithDefaults(
        mockQueryInterface,
        'Users',
        attributes,
        options
      );

      expect(mockQueryInterface.addIndex).toHaveBeenCalledTimes(2);
    });
  });

  describe('safeAlterTable', () => {
    it('should execute alterations in transaction', async () => {
      const alterations = jest.fn().mockResolvedValue(undefined);

      await safeAlterTable(mockQueryInterface, 'Users', alterations);

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(alterations).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      const alterations = jest
        .fn()
        .mockRejectedValue(new Error('Alteration failed'));

      await expect(
        safeAlterTable(mockQueryInterface, 'Users', alterations)
      ).rejects.toThrow('Alteration failed');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should use provided transaction', async () => {
      const alterations = jest.fn().mockResolvedValue(undefined);

      await safeAlterTable(
        mockQueryInterface,
        'Users',
        alterations,
        mockTransaction
      );

      expect(alterations).toHaveBeenCalledWith(mockQueryInterface, mockTransaction);
    });
  });

  describe('dropTableSafely', () => {
    it('should drop table if exists', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: true }]]);

      await dropTableSafely(mockQueryInterface, 'Users');

      expect(mockQueryInterface.dropTable).toHaveBeenCalledWith(
        'Users',
        expect.any(Object)
      );
    });

    it('should skip drop if table does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      await dropTableSafely(mockQueryInterface, 'Users', { ifExists: true });

      expect(mockQueryInterface.dropTable).not.toHaveBeenCalled();
    });

    it('should cascade drop if requested', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: true }]]);

      await dropTableSafely(mockQueryInterface, 'Users', { cascade: true });

      expect(mockQueryInterface.dropTable).toHaveBeenCalledWith(
        'Users',
        expect.objectContaining({ cascade: true })
      );
    });
  });

  describe('renameTableWithDependencies', () => {
    it('should rename table', async () => {
      await renameTableWithDependencies(
        mockQueryInterface,
        'old_users',
        'users'
      );

      expect(mockQueryInterface.renameTable).toHaveBeenCalledWith(
        'old_users',
        'users',
        expect.any(Object)
      );
    });

    it('should update sequences for PostgreSQL', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([
          [{ sequence_name: 'old_users_id_seq' }],
        ])
        .mockResolvedValueOnce(undefined);

      await renameTableWithDependencies(
        mockQueryInterface,
        'old_users',
        'users'
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER SEQUENCE'),
        expect.any(Object)
      );
    });
  });

  describe('checkTableExists', () => {
    it('should return true if table exists (postgres)', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: true }]]);

      const exists = await checkTableExists(mockQueryInterface, 'Users');

      expect(exists).toBe(true);
    });

    it('should return false if table does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      const exists = await checkTableExists(mockQueryInterface, 'NonExistent');

      expect(exists).toBe(false);
    });

    it('should handle MySQL dialect', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('mysql');
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 1 }]]);

      const exists = await checkTableExists(mockQueryInterface, 'Users');

      expect(exists).toBe(true);
    });
  });

  describe('getTableRowCount', () => {
    it('should get row count', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 42 }]]);

      const count = await getTableRowCount(mockQueryInterface, 'Users');

      expect(count).toBe(42);
    });

    it('should apply where clause', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 10 }]]);

      const count = await getTableRowCount(
        mockQueryInterface,
        'Users',
        "status = 'active'"
      );

      expect(count).toBe(10);
      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE')
      );
    });
  });

  describe('createTableBackup', () => {
    it('should create backup with data', async () => {
      await createTableBackup(mockQueryInterface, 'Users', 'Users_backup');

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE'),
        expect.any(Object)
      );
    });

    it('should create structure-only backup', async () => {
      await createTableBackup(
        mockQueryInterface,
        'Users',
        'Users_backup',
        { includeData: false }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE 1=0'),
        expect.any(Object)
      );
    });

    it('should apply where clause to backup', async () => {
      await createTableBackup(
        mockQueryInterface,
        'Users',
        'Users_backup',
        { where: "created_at > '2023-01-01'" }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.any(Object)
      );
    });
  });

  describe('restoreTableFromBackup', () => {
    it('should restore table from backup', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce([[{ count: 10 }]])
        .mockResolvedValueOnce([[{ count: 10 }]]);

      await restoreTableFromBackup(
        mockQueryInterface,
        'Users',
        'Users_backup'
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE'),
        expect.any(Object)
      );
      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO'),
        expect.any(Object)
      );
    });

    it('should verify row counts', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce([[{ count: 10 }]])
        .mockResolvedValueOnce([[{ count: 5 }]]);

      await expect(
        restoreTableFromBackup(
          mockQueryInterface,
          'Users',
          'Users_backup',
          { verify: true }
        )
      ).rejects.toThrow('row count mismatch');
    });

    it('should skip truncate if requested', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce([[{ count: 10 }]])
        .mockResolvedValueOnce([[{ count: 10 }]]);

      await restoreTableFromBackup(
        mockQueryInterface,
        'Users',
        'Users_backup',
        { truncateFirst: false }
      );

      expect(mockSequelize.query).not.toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE'),
        expect.any(Object)
      );
    });
  });

  describe('compareTableStructures', () => {
    it('should detect identical structures', async () => {
      const columns = [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO' },
        { column_name: 'name', data_type: 'text', is_nullable: 'YES' },
      ];

      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([columns])
        .mockResolvedValueOnce([columns]);

      const result = await compareTableStructures(
        mockQueryInterface,
        'Users',
        'Users_backup'
      );

      expect(result.identical).toBe(true);
      expect(result.differences).toHaveLength(0);
    });

    it('should detect column count differences', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([
          [{ column_name: 'id', data_type: 'integer', is_nullable: 'NO' }],
        ])
        .mockResolvedValueOnce([
          [{ column_name: 'id', data_type: 'integer', is_nullable: 'NO' }],
          [{ column_name: 'name', data_type: 'text', is_nullable: 'YES' }],
        ]);

      const result = await compareTableStructures(
        mockQueryInterface,
        'Users',
        'Users_backup'
      );

      expect(result.identical).toBe(false);
      expect(result.differences).toContain(expect.stringContaining('Column count'));
    });

    it('should detect type differences', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([
          [{ column_name: 'id', data_type: 'integer', is_nullable: 'NO' }],
        ])
        .mockResolvedValueOnce([
          [{ column_name: 'id', data_type: 'bigint', is_nullable: 'NO' }],
        ]);

      const result = await compareTableStructures(
        mockQueryInterface,
        'Users',
        'Users_backup'
      );

      expect(result.identical).toBe(false);
      expect(result.differences).toContain(expect.stringContaining('type mismatch'));
    });

    it('should detect nullable differences', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([
          [{ column_name: 'name', data_type: 'text', is_nullable: 'NO' }],
        ])
        .mockResolvedValueOnce([
          [{ column_name: 'name', data_type: 'text', is_nullable: 'YES' }],
        ]);

      const result = await compareTableStructures(
        mockQueryInterface,
        'Users',
        'Users_backup'
      );

      expect(result.identical).toBe(false);
      expect(result.differences).toContain(
        expect.stringContaining('nullable mismatch')
      );
    });

    it('should detect missing columns', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([
          [{ column_name: 'id', data_type: 'integer', is_nullable: 'NO' }],
          [{ column_name: 'name', data_type: 'text', is_nullable: 'YES' }],
        ])
        .mockResolvedValueOnce([
          [{ column_name: 'id', data_type: 'integer', is_nullable: 'NO' }],
        ]);

      const result = await compareTableStructures(
        mockQueryInterface,
        'Users',
        'Users_backup'
      );

      expect(result.identical).toBe(false);
      expect(result.differences).toContain(
        expect.stringContaining("exists in Users but not in")
      );
    });
  });
});
