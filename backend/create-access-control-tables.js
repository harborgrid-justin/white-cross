// Create access control tables (roles, permissions, etc.)
require('dotenv').config();
const { sequelize } = require('./dist/database/models');

async function createAccessControlTables() {
  try {
    console.log('Creating access control tables...\n');

    // Create roles table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "roles" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(50) UNIQUE NOT NULL,
        "description" TEXT,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created table: roles');

    // Create permissions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "permissions" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(100) UNIQUE NOT NULL,
        "description" TEXT,
        "resource" VARCHAR(50) NOT NULL,
        "action" VARCHAR(50) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created table: permissions');

    // Create role_permissions junction table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "role_permissions" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "roleId" UUID NOT NULL REFERENCES "roles"(id) ON DELETE CASCADE,
        "permissionId" UUID NOT NULL REFERENCES "permissions"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("roleId", "permissionId")
      );
    `);
    console.log('✅ Created table: role_permissions');

    // Create user_roles junction table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "user_roles" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" VARCHAR(255) NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
        "roleId" UUID NOT NULL REFERENCES "roles"(id) ON DELETE CASCADE,
        "assignedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "assignedBy" VARCHAR(255) REFERENCES "users"(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "roleId")
      );
    `);
    console.log('✅ Created table: user_roles');

    // Insert default roles
    await sequelize.query(`
      INSERT INTO "roles" (name, description)
      VALUES
        ('ADMIN', 'System administrator with full access'),
        ('NURSE', 'School nurse with healthcare access'),
        ('DOCTOR', 'Medical doctor with patient access'),
        ('STAFF', 'School staff with limited access'),
        ('PARENT', 'Parent with student access')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('✅ Inserted default roles');

    // Insert default permissions
    await sequelize.query(`
      INSERT INTO "permissions" (name, resource, action, description)
      VALUES
        ('students.read', 'students', 'read', 'View student information'),
        ('students.write', 'students', 'write', 'Create/update student information'),
        ('students.delete', 'students', 'delete', 'Delete student records'),
        ('medications.read', 'medications', 'read', 'View medications'),
        ('medications.write', 'medications', 'write', 'Manage medications'),
        ('medications.administer', 'medications', 'administer', 'Administer medications'),
        ('health_records.read', 'health_records', 'read', 'View health records'),
        ('health_records.write', 'health_records', 'write', 'Create/update health records'),
        ('users.read', 'users', 'read', 'View user accounts'),
        ('users.write', 'users', 'write', 'Manage user accounts'),
        ('roles.read', 'roles', 'read', 'View roles'),
        ('roles.write', 'roles', 'write', 'Manage roles')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('✅ Inserted default permissions');

    console.log('\n✅ Access control tables created successfully!');
    console.log('\nYou can now use the /api/v1/access-control endpoints\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createAccessControlTables();
