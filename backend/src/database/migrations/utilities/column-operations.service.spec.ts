import { QueryInterface, Sequelize, DataTypes, Transaction } from 'sequelize';
import {
  addColumnWithDefaults,
  removeColumnSafely,
  modifyColumnType,
  renameColumnUniversal,
  checkColumnExists,
  addColumnZeroDowntime,
  removeColumnZeroDowntime,
  renameColumnExpandContract,
  modifyColumnTypeZeroDowntime,
  backfillMissingData,
  ColumnDefinition,
  ColumnModificationOptions,
} from './column-operations.service';

describe('Column Operations Service', () => {
  let mockQueryInterface: jest.Mocked<QueryInterface>;
  let mockSequelize: jest.Mocked<Sequelize>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockTransaction = {} as jest.Mocked<Transaction>;

    mockSequelize = {
      getDialect: jest.fn().mockReturnValue('postgres'),
      query: jest.fn().mockResolvedValue([[{ count: 0 }]]),
      transaction: jest.fn().mockResolvedValue(mockTransaction),
    } as unknown as jest.Mocked<Sequelize>;

    mockQueryInterface = {
      sequelize: mockSequelize,
      addColumn: jest.fn().mockResolvedValue(undefined),
      removeColumn: jest.fn().mockResolvedValue(undefined),
      changeColumn: jest.fn().mockResolvedValue(undefined),
      renameColumn: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<QueryInterface>;
  });

  describe('addColumnWithDefaults', () => {
    const columnDefinition: ColumnDefinition = {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'default',
    };

    it('should add column as nullable first', async () => {
      await addColumnWithDefaults(
        mockQueryInterface,
        'Users',
        'status',
        columnDefinition
      );

      expect(mockQueryInterface.addColumn).toHaveBeenCalledWith(
        'Users',
        'status',
        expect.objectContaining({ allowNull: true }),
        expect.any(Object)
      );
    });

    it('should populate default values', async () => {
      await addColumnWithDefaults(
        mockQueryInterface,
        'Users',
        'status',
        columnDefinition,
        { populateDefault: true }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        expect.objectContaining({
          replacements: { defaultValue: 'default' },
        })
      );
    });

    it('should make column non-nullable after population', async () => {
      await addColumnWithDefaults(
        mockQueryInterface,
        'Users',
        'status',
        columnDefinition
      );

      expect(mockQueryInterface.changeColumn).toHaveBeenCalledWith(
        'Users',
        'status',
        columnDefinition,
        expect.any(Object)
      );
    });

    it('should validate data after adding column', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 5 }]]);

      await expect(
        addColumnWithDefaults(
          mockQueryInterface,
          'Users',
          'status',
          columnDefinition,
          { validate: true }
        )
      ).rejects.toThrow('NULL values but is NOT NULL');
    });

    it('should skip population if populateDefault is false', async () => {
      await addColumnWithDefaults(
        mockQueryInterface,
        'Users',
        'status',
        columnDefinition,
        { populateDefault: false }
      );

      expect(mockSequelize.query).not.toHaveBeenCalled();
    });

    it('should handle MySQL dialect', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('mysql');

      await addColumnWithDefaults(
        mockQueryInterface,
        'Users',
        'status',
        columnDefinition
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('`Users`'),
        expect.any(Object)
      );
    });
  });

  describe('removeColumnSafely', () => {
    it('should remove column if exists', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: true }]]);

      await removeColumnSafely(mockQueryInterface, 'Users', 'oldColumn');

      expect(mockQueryInterface.removeColumn).toHaveBeenCalledWith(
        'Users',
        'oldColumn',
        expect.any(Object)
      );
    });

    it('should skip removal if column does not exist', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      await removeColumnSafely(mockQueryInterface, 'Users', 'nonExistent', {
        ifExists: true,
      });

      expect(mockQueryInterface.removeColumn).not.toHaveBeenCalled();
    });

    it('should create backup before removal', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: true }]]);

      await removeColumnSafely(mockQueryInterface, 'Users', 'oldColumn', {
        backup: true,
        backupTable: 'Users_backup',
      });

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE'),
        expect.any(Object)
      );
    });
  });

  describe('modifyColumnType', () => {
    const newDefinition: ColumnDefinition = {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    };

    it('should modify column type using temp column approach', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('postgres');
      const options: ColumnModificationOptions = { tempColumn: true };

      await modifyColumnType(
        mockQueryInterface,
        'Orders',
        'amount',
        newDefinition,
        options
      );

      expect(mockQueryInterface.addColumn).toHaveBeenCalledWith(
        'Orders',
        'amount_temp',
        newDefinition,
        expect.any(Object)
      );
      expect(mockQueryInterface.removeColumn).toHaveBeenCalledWith(
        'Orders',
        'amount',
        expect.any(Object)
      );
      expect(mockQueryInterface.renameColumn).toHaveBeenCalledWith(
        'Orders',
        'amount_temp',
        'amount',
        expect.any(Object)
      );
    });

    it('should use direct modification for non-postgres', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('mysql');

      await modifyColumnType(
        mockQueryInterface,
        'Orders',
        'amount',
        newDefinition,
        { tempColumn: false }
      );

      expect(mockQueryInterface.changeColumn).toHaveBeenCalledWith(
        'Orders',
        'amount',
        newDefinition,
        expect.any(Object)
      );
    });

    it('should apply cast expression during conversion', async () => {
      const options: ColumnModificationOptions = {
        castUsing: 'amount::numeric',
        tempColumn: true,
      };

      await modifyColumnType(
        mockQueryInterface,
        'Orders',
        'amount',
        newDefinition,
        options
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('amount::numeric'),
        expect.any(Object)
      );
    });
  });

  describe('renameColumnUniversal', () => {
    it('should rename column', async () => {
      await renameColumnUniversal(
        mockQueryInterface,
        'Users',
        'userName',
        'username'
      );

      expect(mockQueryInterface.renameColumn).toHaveBeenCalledWith(
        'Users',
        'userName',
        'username',
        expect.any(Object)
      );
    });

    it('should work with transaction', async () => {
      await renameColumnUniversal(
        mockQueryInterface,
        'Users',
        'userName',
        'username',
        mockTransaction
      );

      expect(mockQueryInterface.renameColumn).toHaveBeenCalledWith(
        'Users',
        'userName',
        'username',
        { transaction: mockTransaction }
      );
    });
  });

  describe('checkColumnExists', () => {
    it('should return true when column exists (postgres)', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('postgres');
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: true }]]);

      const exists = await checkColumnExists(mockQueryInterface, 'Users', 'email');

      expect(exists).toBe(true);
    });

    it('should return false when column does not exist (postgres)', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('postgres');
      mockSequelize.query = jest.fn().mockResolvedValue([[{ exists: false }]]);

      const exists = await checkColumnExists(
        mockQueryInterface,
        'Users',
        'nonExistent'
      );

      expect(exists).toBe(false);
    });

    it('should handle MySQL dialect', async () => {
      mockSequelize.getDialect = jest.fn().mockReturnValue('mysql');
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 1 }]]);

      const exists = await checkColumnExists(mockQueryInterface, 'Users', 'email');

      expect(exists).toBe(true);
    });
  });

  describe('addColumnZeroDowntime', () => {
    const definition: ColumnDefinition = {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'active',
    };

    it('should add column in phases', async () => {
      await addColumnZeroDowntime(mockQueryInterface, 'Users', 'status', definition);

      // Phase 1: Add as nullable
      expect(mockQueryInterface.addColumn).toHaveBeenCalledWith(
        'Users',
        'status',
        expect.objectContaining({ allowNull: true })
      );

      // Phase 3: Make non-nullable
      expect(mockQueryInterface.changeColumn).toHaveBeenCalledWith(
        'Users',
        'status',
        definition
      );
    });

    it('should use custom populate function', async () => {
      const customPopulate = jest.fn().mockResolvedValue(undefined);

      await addColumnZeroDowntime(
        mockQueryInterface,
        'Users',
        'status',
        definition,
        { populateFunction: customPopulate }
      );

      expect(customPopulate).toHaveBeenCalledWith(mockQueryInterface);
    });

    it('should skip making non-nullable if allowNull is true', async () => {
      const nullableDefinition = { ...definition, allowNull: true };

      await addColumnZeroDowntime(
        mockQueryInterface,
        'Users',
        'status',
        nullableDefinition
      );

      expect(mockQueryInterface.changeColumn).not.toHaveBeenCalled();
    });
  });

  describe('removeColumnZeroDowntime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should remove column after verification', async () => {
      const promise = removeColumnZeroDowntime(
        mockQueryInterface,
        'Users',
        'oldColumn',
        { verifyUnused: true, waitPeriod: 1000 }
      );

      jest.advanceTimersByTime(1000);

      await promise;

      expect(mockQueryInterface.removeColumn).toHaveBeenCalledWith('Users', 'oldColumn');
    });

    it('should remove immediately if verification disabled', async () => {
      await removeColumnZeroDowntime(mockQueryInterface, 'Users', 'oldColumn', {
        verifyUnused: false,
      });

      expect(mockQueryInterface.removeColumn).toHaveBeenCalledWith('Users', 'oldColumn');
    });
  });

  describe('backfillMissingData', () => {
    it('should backfill with default value', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[{ count: 10 }]]);

      const result = await backfillMissingData(
        mockQueryInterface,
        'Users',
        'status',
        'default',
        { defaultValue: 'active' }
      );

      expect(result.rowsUpdated).toBe(10);
      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        expect.objectContaining({ replacements: { defaultValue: 'active' } })
      );
    });

    it('should backfill with derived expression', async () => {
      mockSequelize.query = jest.fn().mockResolvedValue([[]]);

      await backfillMissingData(
        mockQueryInterface,
        'Users',
        'fullName',
        'derived',
        { expression: "firstName || ' ' || lastName" }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining("firstName || ' ' || lastName"),
        undefined
      );
    });

    it('should backfill with lookup', async () => {
      await backfillMissingData(
        mockQueryInterface,
        'Users',
        'roleId',
        'lookup',
        {
          lookupTable: 'Roles',
          lookupKey: 'id',
          lookupValue: 'defaultRoleId',
        }
      );

      expect(mockSequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM "Roles"'),
        undefined
      );
    });

    it('should backfill with custom function', async () => {
      mockSequelize.query = jest
        .fn()
        .mockResolvedValueOnce([
          [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
          ],
        ])
        .mockResolvedValue(undefined);

      const customFn = jest.fn().mockImplementation((row: { name: string }) => {
        return row.name.toUpperCase();
      });

      const result = await backfillMissingData(
        mockQueryInterface,
        'Users',
        'upperName',
        'function',
        { customFunction: customFn }
      );

      expect(customFn).toHaveBeenCalledTimes(2);
      expect(result.rowsUpdated).toBe(2);
    });

    it('should throw error if custom function not provided for function strategy', async () => {
      await expect(
        backfillMissingData(mockQueryInterface, 'Users', 'field', 'function', {})
      ).rejects.toThrow('Custom function required');
    });
  });
});
