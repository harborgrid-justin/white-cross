/**
 * WC-RTE-DEV-001 | Development API Routes
 * Purpose: Development-only endpoints for testing and debugging
 * Note: These endpoints should only be enabled in development environments
 */

import { ServerRoute } from '@hapi/hapi';
import { User } from '../database/models/core/User';
import { ENVIRONMENT } from '../constants';

// Get all users with test credentials for development
const getDevUsersHandler = async (request: any, h: any) => {
  try {
    // Only allow in development environment
    if (ENVIRONMENT.NODE_ENV === 'production') {
      return h.response({
        success: false,
        error: { message: 'This endpoint is only available in development' }
      }).code(403);
    }

    // Fetch all active users
    const users = await User.findAll({
      where: { isActive: true },
      attributes: ['id', 'email', 'firstName', 'lastName', 'role'],
      order: [['role', 'ASC'], ['firstName', 'ASC']]
    });

    // Map users to include test credentials based on email
    const usersWithCredentials = users.map((user: any) => {
      const userObj = user.toJSON();
      
      // Determine password based on email patterns from seeders
      let password = 'Password123!';
      if (userObj.email.includes('nurse@school.edu')) {
        password = 'NursePassword123!';
      } else if (userObj.email.includes('admin@school.edu')) {
        password = 'AdminPassword123!';
      } else if (userObj.email.includes('readonly@school.edu')) {
        password = 'ReadOnlyPassword123!';
      } else if (userObj.email.includes('counselor@school.edu')) {
        password = 'CounselorPassword123!';
      } else if (userObj.email.includes('@whitecross.health') || userObj.email.includes('@unifiedschools.edu') || userObj.email.includes('@centralhigh.edu') || userObj.email.includes('elementary.edu') || userObj.email.includes('middle.edu') || userObj.email.includes('high.edu')) {
        password = 'AdminPassword123!';
      }

      return {
        ...userObj,
        password, // Include test password for development
        displayName: `${userObj.firstName} ${userObj.lastName} (${userObj.role})`
      };
    });

    return h.response({
      success: true,
      data: { users: usersWithCredentials }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define development routes for Hapi
export const devRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/dev/users',
    handler: getDevUsersHandler,
    options: {
      auth: false, // No authentication required for development
      tags: ['api', 'Development'],
      description: 'Get all users with test credentials (development only)',
      notes: 'Returns a list of all active users with their test passwords. Only available in development environment.'
    }
  }
];
