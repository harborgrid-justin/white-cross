/**
 * Migration: Add Encryption Fields to Messages Table
 *
 * Adds E2E encryption support fields to the messages table:
 * - isEncrypted: Boolean flag indicating if message content is encrypted
 * - encryptionMetadata: JSONB field storing encryption metadata (algorithm, IV, authTag, keyId)
 * - encryptionVersion: String field for encryption version tracking
 *
 * This migration supports the E2E encryption integration completed in the
 * message queue processors.
 */

'use strict';

module.exports = {
  /**
   * Apply migration - Add encryption fields
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Add isEncrypted column
      await queryInterface.addColumn(
        'messages',
        'is_encrypted',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Whether the message content is encrypted (E2E encryption)',
        },
        { transaction }
      );

      // 2. Add encryptionMetadata column
      await queryInterface.addColumn(
        'messages',
        'encryption_metadata',
        {
          type: Sequelize.JSONB,
          allowNull: true,
          comment: 'Encryption metadata including algorithm, IV, auth tag, and key ID',
        },
        { transaction }
      );

      // 3. Add encryptionVersion column
      await queryInterface.addColumn(
        'messages',
        'encryption_version',
        {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'Encryption version for backward compatibility (e.g., "1.0.0")',
        },
        { transaction }
      );

      // 4. Add index on isEncrypted for query optimization
      await queryInterface.addIndex(
        'messages',
        ['is_encrypted'],
        {
          name: 'messages_is_encrypted_idx',
          transaction,
        }
      );

      // 5. Add composite index on conversationId and isEncrypted
      await queryInterface.addIndex(
        'messages',
        ['conversation_id', 'is_encrypted'],
        {
          name: 'messages_conversation_encrypted_idx',
          transaction,
        }
      );

      await transaction.commit();

      console.log('✅ Successfully added encryption fields to messages table');
      console.log('   - is_encrypted (BOOLEAN)');
      console.log('   - encryption_metadata (JSONB)');
      console.log('   - encryption_version (STRING)');
      console.log('   - Index: messages_is_encrypted_idx');
      console.log('   - Index: messages_conversation_encrypted_idx');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed:', error.message);
      throw error;
    }
  },

  /**
   * Revert migration - Remove encryption fields
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes first
      await queryInterface.removeIndex(
        'messages',
        'messages_conversation_encrypted_idx',
        { transaction }
      );

      await queryInterface.removeIndex(
        'messages',
        'messages_is_encrypted_idx',
        { transaction }
      );

      // Remove columns
      await queryInterface.removeColumn('messages', 'encryption_version', { transaction });
      await queryInterface.removeColumn('messages', 'encryption_metadata', { transaction });
      await queryInterface.removeColumn('messages', 'is_encrypted', { transaction });

      await transaction.commit();

      console.log('✅ Successfully removed encryption fields from messages table');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error.message);
      throw error;
    }
  },
};
