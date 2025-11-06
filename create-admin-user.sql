-- Create admin user directly
-- Password: admin123 (hashed with bcrypt)

INSERT INTO users (
    id, 
    email, 
    password, 
    "firstName", 
    "lastName", 
    role, 
    "isActive", 
    "emailVerified", 
    "mustChangePassword", 
    "failedLoginAttempts", 
    "twoFactorEnabled",
    "createdAt", 
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'admin@whitecross.health',
    '$2b$12$LQv3c1yqBwkvHqXp5vFJVuCF8CjOF0OeMwJDgNgJEyPdz2TGqr6w2', -- admin123
    'Admin',
    'User',
    'ADMIN',
    true,
    true,
    false,
    0,
    false,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    role = EXCLUDED.role,
    "isActive" = EXCLUDED."isActive",
    "emailVerified" = EXCLUDED."emailVerified",
    "mustChangePassword" = EXCLUDED."mustChangePassword",
    "failedLoginAttempts" = EXCLUDED."failedLoginAttempts",
    "twoFactorEnabled" = EXCLUDED."twoFactorEnabled",
    "updatedAt" = NOW();

-- Verify the user was created
SELECT id, email, "firstName", "lastName", role, "isActive", "emailVerified" 
FROM users 
WHERE email = 'admin@whitecross.health';