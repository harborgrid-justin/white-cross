/**
 * ACCESS CONTROL CONTROLLER UNIT TESTS
 * Test suite for RBAC, security incidents, and IP restrictions controller
 */

import { AccessControlController } from '../core/controllers/accessControl.controller';
import { AccessControlService } from '../../../services/accessControl';

// Mock dependencies
jest.mock('../../../services/accessControl');

describe('AccessControlController', () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    // Setup mock request
    mockRequest = {
      query: {},
      params: {},
      payload: {},
      auth: {
        credentials: {
          userId: 'admin-123',
          email: 'admin@example.com',
          role: 'ADMIN'
        }
      }
    };

    // Setup mock response toolkit
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  /**
   * ROLES MANAGEMENT TESTS
   */

  describe('getRoles', () => {
    it('should return all roles', async () => {
      // Arrange
      (AccessControlService.getRoles as jest.Mock).mockResolvedValue([
        { id: '1', name: 'ADMIN', description: 'System administrator' },
        { id: '2', name: 'NURSE', description: 'School nurse' }
      ]);

      // Act
      await AccessControlController.getRoles(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getRoles).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          roles: expect.arrayContaining([
            expect.objectContaining({ name: 'ADMIN' }),
            expect.objectContaining({ name: 'NURSE' })
          ])
        }
      });
    });
  });

  describe('createRole', () => {
    it('should create new role', async () => {
      // Arrange
      mockRequest.payload = {
        name: 'COUNSELOR',
        description: 'School counselor'
      };

      (AccessControlService.createRole as jest.Mock).mockResolvedValue({
        id: 'role-123',
        name: 'COUNSELOR',
        description: 'School counselor'
      });

      // Act
      await AccessControlController.createRole(mockRequest, mockH);

      // Assert
      expect(AccessControlService.createRole).toHaveBeenCalledWith(mockRequest.payload);
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          role: expect.objectContaining({ name: 'COUNSELOR' })
        }
      });
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('updateRole', () => {
    it('should update role', async () => {
      // Arrange
      mockRequest.params = { id: 'role-123' };
      mockRequest.payload = {
        description: 'Updated description'
      };

      (AccessControlService.updateRole as jest.Mock).mockResolvedValue({
        id: 'role-123',
        name: 'COUNSELOR',
        description: 'Updated description'
      });

      // Act
      await AccessControlController.updateRole(mockRequest, mockH);

      // Assert
      expect(AccessControlService.updateRole).toHaveBeenCalledWith('role-123', mockRequest.payload);
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          role: expect.objectContaining({ description: 'Updated description' })
        }
      });
    });
  });

  describe('deleteRole', () => {
    it('should delete role', async () => {
      // Arrange
      mockRequest.params = { id: 'role-123' };

      (AccessControlService.deleteRole as jest.Mock).mockResolvedValue(undefined);

      // Act
      await AccessControlController.deleteRole(mockRequest, mockH);

      // Assert
      expect(AccessControlService.deleteRole).toHaveBeenCalledWith('role-123');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          message: 'Role deleted successfully'
        }
      });
    });
  });

  /**
   * PERMISSIONS MANAGEMENT TESTS
   */

  describe('getPermissions', () => {
    it('should return all permissions', async () => {
      // Arrange
      (AccessControlService.getPermissions as jest.Mock).mockResolvedValue([
        { id: '1', resource: 'users', action: 'create' },
        { id: '2', resource: 'medications', action: 'read' }
      ]);

      // Act
      await AccessControlController.getPermissions(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getPermissions).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          permissions: expect.arrayContaining([
            expect.objectContaining({ resource: 'users' })
          ])
        }
      });
    });
  });

  describe('createPermission', () => {
    it('should create new permission', async () => {
      // Arrange
      mockRequest.payload = {
        resource: 'students',
        action: 'update',
        description: 'Update student records'
      };

      (AccessControlService.createPermission as jest.Mock).mockResolvedValue({
        id: 'perm-123',
        resource: 'students',
        action: 'update'
      });

      // Act
      await AccessControlController.createPermission(mockRequest, mockH);

      // Assert
      expect(AccessControlService.createPermission).toHaveBeenCalledWith(mockRequest.payload);
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  /**
   * ROLE-PERMISSION ASSIGNMENTS TESTS
   */

  describe('assignPermissionToRole', () => {
    it('should assign permission to role', async () => {
      // Arrange
      mockRequest.params = {
        roleId: 'role-123',
        permissionId: 'perm-456'
      };

      (AccessControlService.assignPermissionToRole as jest.Mock).mockResolvedValue({
        roleId: 'role-123',
        permissionId: 'perm-456'
      });

      // Act
      await AccessControlController.assignPermissionToRole(mockRequest, mockH);

      // Assert
      expect(AccessControlService.assignPermissionToRole).toHaveBeenCalledWith('role-123', 'perm-456');
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('removePermissionFromRole', () => {
    it('should remove permission from role', async () => {
      // Arrange
      mockRequest.params = {
        roleId: 'role-123',
        permissionId: 'perm-456'
      };

      (AccessControlService.removePermissionFromRole as jest.Mock).mockResolvedValue(undefined);

      // Act
      await AccessControlController.removePermissionFromRole(mockRequest, mockH);

      // Assert
      expect(AccessControlService.removePermissionFromRole).toHaveBeenCalledWith('role-123', 'perm-456');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          message: 'Permission removed from role'
        }
      });
    });
  });

  /**
   * USER-ROLE ASSIGNMENTS TESTS
   */

  describe('assignRoleToUser', () => {
    it('should assign role to user', async () => {
      // Arrange
      mockRequest.params = {
        userId: 'user-123',
        roleId: 'role-456'
      };

      (AccessControlService.assignRoleToUser as jest.Mock).mockResolvedValue({
        userId: 'user-123',
        roleId: 'role-456'
      });

      // Act
      await AccessControlController.assignRoleToUser(mockRequest, mockH);

      // Assert
      expect(AccessControlService.assignRoleToUser).toHaveBeenCalledWith('user-123', 'role-456');
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('removeRoleFromUser', () => {
    it('should remove role from user', async () => {
      // Arrange
      mockRequest.params = {
        userId: 'user-123',
        roleId: 'role-456'
      };

      (AccessControlService.removeRoleFromUser as jest.Mock).mockResolvedValue(undefined);

      // Act
      await AccessControlController.removeRoleFromUser(mockRequest, mockH);

      // Assert
      expect(AccessControlService.removeRoleFromUser).toHaveBeenCalledWith('user-123', 'role-456');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          message: 'Role removed from user'
        }
      });
    });
  });

  /**
   * USER PERMISSIONS TESTS
   */

  describe('getUserPermissions', () => {
    it('should return user permissions', async () => {
      // Arrange
      mockRequest.params = { userId: 'user-123' };

      (AccessControlService.getUserPermissions as jest.Mock).mockResolvedValue({
        permissions: [
          { resource: 'students', action: 'read' },
          { resource: 'medications', action: 'create' }
        ]
      });

      // Act
      await AccessControlController.getUserPermissions(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getUserPermissions).toHaveBeenCalledWith('user-123');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          permissions: expect.any(Array)
        })
      });
    });
  });

  describe('checkPermission', () => {
    it('should check user permission and return true when user has permission', async () => {
      // Arrange
      mockRequest.params = { userId: 'user-123' };
      mockRequest.query = {
        resource: 'students',
        action: 'read'
      };

      (AccessControlService.checkPermission as jest.Mock).mockResolvedValue(true);

      // Act
      await AccessControlController.checkPermission(mockRequest, mockH);

      // Assert
      expect(AccessControlService.checkPermission).toHaveBeenCalledWith('user-123', 'students', 'read');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          hasPermission: true
        }
      });
    });

    it('should check user permission and return false when user lacks permission', async () => {
      // Arrange
      mockRequest.params = { userId: 'user-123' };
      mockRequest.query = {
        resource: 'users',
        action: 'delete'
      };

      (AccessControlService.checkPermission as jest.Mock).mockResolvedValue(false);

      // Act
      await AccessControlController.checkPermission(mockRequest, mockH);

      // Assert
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          hasPermission: false
        }
      });
    });
  });

  /**
   * SESSION MANAGEMENT TESTS
   */

  describe('getUserSessions', () => {
    it('should return user sessions', async () => {
      // Arrange
      mockRequest.params = { userId: 'user-123' };

      (AccessControlService.getUserSessions as jest.Mock).mockResolvedValue([
        { token: 'token1', createdAt: '2025-10-21', ipAddress: '192.168.1.1' },
        { token: 'token2', createdAt: '2025-10-20', ipAddress: '192.168.1.2' }
      ]);

      // Act
      await AccessControlController.getUserSessions(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getUserSessions).toHaveBeenCalledWith('user-123');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          sessions: expect.arrayContaining([
            expect.objectContaining({ token: 'token1' })
          ])
        }
      });
    });
  });

  describe('deleteSession', () => {
    it('should delete session', async () => {
      // Arrange
      mockRequest.params = { token: 'token-to-delete' };

      (AccessControlService.deleteSession as jest.Mock).mockResolvedValue(undefined);

      // Act
      await AccessControlController.deleteSession(mockRequest, mockH);

      // Assert
      expect(AccessControlService.deleteSession).toHaveBeenCalledWith('token-to-delete');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          message: 'Session deleted'
        }
      });
    });
  });

  describe('deleteAllUserSessions', () => {
    it('should delete all user sessions', async () => {
      // Arrange
      mockRequest.params = { userId: 'user-123' };

      (AccessControlService.deleteAllUserSessions as jest.Mock).mockResolvedValue({
        deletedCount: 3,
        message: 'All sessions deleted'
      });

      // Act
      await AccessControlController.deleteAllUserSessions(mockRequest, mockH);

      // Assert
      expect(AccessControlService.deleteAllUserSessions).toHaveBeenCalledWith('user-123');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          deletedCount: 3
        })
      });
    });
  });

  /**
   * SECURITY INCIDENTS TESTS
   */

  describe('getSecurityIncidents', () => {
    it('should return paginated security incidents', async () => {
      // Arrange
      mockRequest.query = {
        page: '1',
        limit: '20',
        type: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH'
      };

      (AccessControlService.getSecurityIncidents as jest.Mock).mockResolvedValue({
        incidents: [
          { id: '1', type: 'UNAUTHORIZED_ACCESS', severity: 'HIGH' },
          { id: '2', type: 'UNAUTHORIZED_ACCESS', severity: 'HIGH' }
        ],
        total: 25
      });

      // Act
      await AccessControlController.getSecurityIncidents(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getSecurityIncidents).toHaveBeenCalledWith(
        1,
        20,
        expect.objectContaining({
          type: 'UNAUTHORIZED_ACCESS',
          severity: 'HIGH'
        })
      );
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
        pagination: {
          page: 1,
          limit: 20,
          total: 25,
          totalPages: 2
        }
      });
    });
  });

  describe('createSecurityIncident', () => {
    it('should create security incident with current user as detector', async () => {
      // Arrange
      mockRequest.payload = {
        type: 'BRUTE_FORCE',
        severity: 'CRITICAL',
        description: 'Multiple failed login attempts detected',
        ipAddress: '192.168.1.100'
      };

      (AccessControlService.createSecurityIncident as jest.Mock).mockResolvedValue({
        id: 'incident-123',
        type: 'BRUTE_FORCE',
        severity: 'CRITICAL',
        detectedBy: 'admin-123'
      });

      // Act
      await AccessControlController.createSecurityIncident(mockRequest, mockH);

      // Assert
      expect(AccessControlService.createSecurityIncident).toHaveBeenCalledWith({
        ...mockRequest.payload,
        detectedBy: 'admin-123'
      });
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('updateSecurityIncident', () => {
    it('should update security incident', async () => {
      // Arrange
      mockRequest.params = { id: 'incident-123' };
      mockRequest.payload = {
        status: 'RESOLVED',
        notes: 'False positive - legitimate user'
      };

      (AccessControlService.updateSecurityIncident as jest.Mock).mockResolvedValue({
        id: 'incident-123',
        status: 'RESOLVED',
        notes: 'False positive - legitimate user'
      });

      // Act
      await AccessControlController.updateSecurityIncident(mockRequest, mockH);

      // Assert
      expect(AccessControlService.updateSecurityIncident).toHaveBeenCalledWith(
        'incident-123',
        mockRequest.payload
      );
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          incident: expect.objectContaining({ status: 'RESOLVED' })
        }
      });
    });
  });

  /**
   * IP RESTRICTIONS TESTS
   */

  describe('getIpRestrictions', () => {
    it('should return all IP restrictions', async () => {
      // Arrange
      (AccessControlService.getIpRestrictions as jest.Mock).mockResolvedValue([
        { id: '1', ipAddress: '192.168.1.0/24', type: 'ALLOW' },
        { id: '2', ipAddress: '10.0.0.1', type: 'DENY' }
      ]);

      // Act
      await AccessControlController.getIpRestrictions(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getIpRestrictions).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          restrictions: expect.arrayContaining([
            expect.objectContaining({ type: 'ALLOW' })
          ])
        }
      });
    });
  });

  describe('addIpRestriction', () => {
    it('should add IP restriction with current user as creator', async () => {
      // Arrange
      mockRequest.payload = {
        ipAddress: '192.168.1.100',
        type: 'DENY',
        description: 'Suspicious activity from this IP'
      };

      (AccessControlService.addIpRestriction as jest.Mock).mockResolvedValue({
        id: 'restriction-123',
        ipAddress: '192.168.1.100',
        type: 'DENY',
        createdBy: 'admin-123'
      });

      // Act
      await AccessControlController.addIpRestriction(mockRequest, mockH);

      // Assert
      expect(AccessControlService.addIpRestriction).toHaveBeenCalledWith({
        ...mockRequest.payload,
        createdBy: 'admin-123'
      });
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });

  describe('removeIpRestriction', () => {
    it('should remove IP restriction', async () => {
      // Arrange
      mockRequest.params = { id: 'restriction-123' };

      (AccessControlService.removeIpRestriction as jest.Mock).mockResolvedValue(undefined);

      // Act
      await AccessControlController.removeIpRestriction(mockRequest, mockH);

      // Assert
      expect(AccessControlService.removeIpRestriction).toHaveBeenCalledWith('restriction-123');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          message: 'IP restriction removed'
        }
      });
    });
  });

  /**
   * STATISTICS & UTILITIES TESTS
   */

  describe('getSecurityStatistics', () => {
    it('should return security statistics', async () => {
      // Arrange
      (AccessControlService.getSecurityStatistics as jest.Mock).mockResolvedValue({
        totalRoles: 10,
        totalPermissions: 50,
        totalIncidents: 25,
        activeSessions: 150,
        ipRestrictions: 5
      });

      // Act
      await AccessControlController.getSecurityStatistics(mockRequest, mockH);

      // Assert
      expect(AccessControlService.getSecurityStatistics).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          totalRoles: 10,
          totalPermissions: 50
        })
      });
    });
  });

  describe('initializeDefaultRoles', () => {
    it('should initialize default roles', async () => {
      // Arrange
      (AccessControlService.initializeDefaultRoles as jest.Mock).mockResolvedValue(undefined);

      // Act
      await AccessControlController.initializeDefaultRoles(mockRequest, mockH);

      // Assert
      expect(AccessControlService.initializeDefaultRoles).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: {
          message: 'Default roles initialized'
        }
      });
    });
  });
});
