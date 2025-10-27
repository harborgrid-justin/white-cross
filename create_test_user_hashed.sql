-- Create test user with properly hashed password
-- Password: password123
-- Hashed with bcrypt

-- First, delete existing test user if it exists
DELETE FROM users WHERE email = 'nurse@test.com';

-- Create user with bcrypt-hashed password (password123)
INSERT INTO users (
    id,
    email, 
    password,
    "firstName",
    "lastName",
    role,
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'nurse@test.com',
    '$2b$12$LQv3c1yqBwlVHpPiOCJAEOvOtfDAMWC0G.SA.JOVOqxzb90Faw1/u', -- bcrypt hash for 'password123'
    'Test',
    'Nurse',
    'NURSE',
    true,
    NOW(),
    NOW()
);

SELECT * FROM users WHERE email = 'nurse@test.com';