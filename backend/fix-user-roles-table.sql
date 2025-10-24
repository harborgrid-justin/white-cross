-- Fix user_roles table with correct Sequelize column names
DROP TABLE IF EXISTS user_roles CASCADE;

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "roleId" UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  "assignedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "assignedBy" VARCHAR(255) REFERENCES users(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "roleId")
);

-- Create index for performance
CREATE INDEX user_roles_user_id ON user_roles("userId");
CREATE INDEX user_roles_role_id ON user_roles("roleId");
