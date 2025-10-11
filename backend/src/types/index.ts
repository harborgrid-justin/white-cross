// User Role Enum
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  COUNSELOR = 'COUNSELOR',
  TEACHER = 'TEACHER',
  READ_ONLY = 'READ_ONLY'
}

// Configuration Enums
export enum ConfigCategory {
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  NOTIFICATION = 'NOTIFICATION',
  APPOINTMENT = 'APPOINTMENT',
  MEDICATION = 'MEDICATION',
  REPORTING = 'REPORTING',
  INTEGRATION = 'INTEGRATION',
  UI = 'UI',
  COMPLIANCE = 'COMPLIANCE'
}

export enum ConfigValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ENUM = 'ENUM',
  DATE = 'DATE'
}

export enum ConfigScope {
  SYSTEM = 'SYSTEM',
  DISTRICT = 'DISTRICT',
  SCHOOL = 'SCHOOL',
  USER = 'USER'
}

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

// Extend Express Request type for authenticated user
declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
