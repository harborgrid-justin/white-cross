require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('sslmode') ? { rejectUnauthorized: false } : false
});

async function addSecurityColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Start transaction
    await client.query('BEGIN');

    // Email verification fields (camelCase to match model)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerificationToken" VARCHAR(255)
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerificationExpires" TIMESTAMP
    `);

    // Password reset fields
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "passwordResetToken" VARCHAR(255)
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "passwordChangedAt" TIMESTAMP
    `);

    // Two-factor authentication fields
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "twoFactorSecret" VARCHAR(255)
    `);

    // Account lockout fields
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "lockoutUntil" TIMESTAMP
    `);

    // Password change tracking
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "lastPasswordChange" TIMESTAMP
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false
    `);

    // Set lastPasswordChange for existing users
    await client.query(`
      UPDATE users SET "lastPasswordChange" = NOW() WHERE "lastPasswordChange" IS NULL
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS users_email_verification_token_idx ON users("emailVerificationToken")
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS users_password_reset_token_idx ON users("passwordResetToken")
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS users_lockout_until_idx ON users("lockoutUntil")
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS users_email_verified_idx ON users("emailVerified")
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS users_two_factor_enabled_idx ON users("twoFactorEnabled")
    `);

    await client.query('COMMIT');
    console.log('✓ Security enhancement columns added successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

addSecurityColumns()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(e => {
    console.error('Failed:', e);
    process.exit(1);
  });
