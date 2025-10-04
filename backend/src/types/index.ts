import { User as PrismaUser, UserRole } from '@prisma/client';

export interface User extends PrismaUser {
  role: UserRole;
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
