/**
 * Access Control Response Schemas
 * Joi schemas for Swagger documentation of RBAC, security incidents, and IP restrictions
 */

import Joi from 'joi';

/**
 * ============================================================================
 * ROLE MANAGEMENT SCHEMAS
 * ============================================================================
 */

/**
 * Role Object Schema
 */
export const RoleSchema = Joi.object({
  id: Joi.string().uuid().example('550e8400-e29b-41d4-a716-446655440000').description('Role UUID'),
  name: Joi.string().example('School Nurse').description('Role name'),
  description: Joi.string().optional().example('Manages student health records and medications').description('Role description'),
  permissions: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().example('650e8400-e29b-41d4-a716-446655440001').description('Permission UUID'),
      resource: Joi.string().example('medications').description('Resource name'),
      action: Joi.string().example('read').description('Action type'),
      description: Joi.string().optional().example('View medication records').description('Permission description')
    })
  ).optional().description('Assigned permissions'),
  userCount: Joi.number().integer().optional().example(12).description('Number of users with this role'),
  createdAt: Joi.date().iso().example('2025-01-15T10:30:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-01-15T10:30:00Z').description('Last update timestamp')
}).label('Role');

/**
 * Role Response Schemas
 */
export const RolesResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    roles: Joi.array().items(RoleSchema).description('List of roles')
  })
}).label('RolesResponse');

export const RoleResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    role: RoleSchema.description('Role details')
  })
}).label('RoleResponse');

/**
 * ============================================================================
 * PERMISSION MANAGEMENT SCHEMAS
 * ============================================================================
 */

/**
 * Permission Object Schema
 */
export const PermissionSchema = Joi.object({
  id: Joi.string().uuid().example('650e8400-e29b-41d4-a716-446655440001').description('Permission UUID'),
  resource: Joi.string().example('medications').description('Resource name'),
  action: Joi.string().valid('create', 'read', 'update', 'delete', 'list', 'execute').example('read').description('Action type'),
  description: Joi.string().optional().example('View medication records').description('Permission description'),
  createdAt: Joi.date().iso().example('2025-01-15T10:30:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-01-15T10:30:00Z').description('Last update timestamp')
}).label('Permission');

/**
 * Permission Response Schemas
 */
export const PermissionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    permissions: Joi.array().items(PermissionSchema).description('List of permissions')
  })
}).label('PermissionsResponse');

export const PermissionResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    permission: PermissionSchema.description('Permission details')
  })
}).label('PermissionResponse');

/**
 * ============================================================================
 * ROLE-PERMISSION ASSIGNMENT SCHEMAS
 * ============================================================================
 */

/**
 * Role-Permission Object Schema
 */
export const RolePermissionSchema = Joi.object({
  roleId: Joi.string().uuid().example('550e8400-e29b-41d4-a716-446655440000').description('Role UUID'),
  permissionId: Joi.string().uuid().example('650e8400-e29b-41d4-a716-446655440001').description('Permission UUID'),
  roleName: Joi.string().optional().example('School Nurse').description('Role name'),
  permissionResource: Joi.string().optional().example('medications').description('Permission resource'),
  permissionAction: Joi.string().optional().example('read').description('Permission action'),
  assignedAt: Joi.date().iso().example('2025-01-15T10:30:00Z').description('Assignment timestamp')
}).label('RolePermission');

/**
 * Role-Permission Response Schema
 */
export const RolePermissionResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    rolePermission: RolePermissionSchema.description('Role-permission assignment')
  })
}).label('RolePermissionResponse');

/**
 * ============================================================================
 * USER-ROLE ASSIGNMENT SCHEMAS
 * ============================================================================
 */

/**
 * User-Role Object Schema
 */
export const UserRoleSchema = Joi.object({
  userId: Joi.string().uuid().example('750e8400-e29b-41d4-a716-446655440002').description('User UUID'),
  roleId: Joi.string().uuid().example('550e8400-e29b-41d4-a716-446655440000').description('Role UUID'),
  userName: Joi.string().optional().example('Jane Nurse').description('User name'),
  userEmail: Joi.string().email().optional().example('jane.nurse@school.edu').description('User email'),
  roleName: Joi.string().optional().example('School Nurse').description('Role name'),
  assignedAt: Joi.date().iso().example('2025-01-15T10:30:00Z').description('Assignment timestamp')
}).label('UserRole');

/**
 * User-Role Response Schema
 */
export const UserRoleResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    userRole: UserRoleSchema.description('User-role assignment')
  })
}).label('UserRoleResponse');

/**
 * ============================================================================
 * USER PERMISSIONS SCHEMAS
 * ============================================================================
 */

/**
 * User Permissions Response Schema
 */
export const UserPermissionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    userId: Joi.string().uuid().example('750e8400-e29b-41d4-a716-446655440002').description('User UUID'),
    permissions: Joi.array().items(PermissionSchema).description('User permissions (aggregated from roles)'),
    roles: Joi.array().items(RoleSchema).optional().description('User assigned roles')
  })
}).label('UserPermissionsResponse');

/**
 * Permission Check Response Schema
 */
export const PermissionCheckResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    hasPermission: Joi.boolean().example(true).description('Whether user has the permission'),
    resource: Joi.string().example('medications').description('Resource checked'),
    action: Joi.string().example('read').description('Action checked'),
    userId: Joi.string().uuid().example('750e8400-e29b-41d4-a716-446655440002').description('User UUID')
  })
}).label('PermissionCheckResponse');

/**
 * ============================================================================
 * SESSION MANAGEMENT SCHEMAS
 * ============================================================================
 */

/**
 * Session Object Schema
 */
export const SessionSchema = Joi.object({
  token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...').description('Session token (JWT)'),
  userId: Joi.string().uuid().example('750e8400-e29b-41d4-a716-446655440002').description('User UUID'),
  ipAddress: Joi.string().ip().example('192.168.1.100').description('IP address'),
  userAgent: Joi.string().optional().example('Mozilla/5.0...').description('User agent string'),
  device: Joi.string().optional().example('Chrome on Windows').description('Device description'),
  location: Joi.string().optional().example('New York, USA').description('Geographic location (if available)'),
  createdAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Session creation timestamp'),
  lastAccessedAt: Joi.date().iso().example('2025-10-23T14:30:00Z').description('Last access timestamp'),
  expiresAt: Joi.date().iso().example('2025-10-24T10:00:00Z').description('Expiration timestamp'),
  isActive: Joi.boolean().example(true).description('Whether session is active')
}).label('Session');

/**
 * User Sessions Response Schema
 */
export const UserSessionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    sessions: Joi.array().items(SessionSchema).description('Active sessions'),
    totalSessions: Joi.number().integer().example(3).description('Total session count'),
    activeSessions: Joi.number().integer().example(2).description('Active session count')
  })
}).label('UserSessionsResponse');

/**
 * ============================================================================
 * SECURITY INCIDENTS SCHEMAS
 * ============================================================================
 */

/**
 * Security Incident Object Schema
 */
export const SecurityIncidentSchema = Joi.object({
  id: Joi.string().uuid().example('850e8400-e29b-41d4-a716-446655440003').description('Incident UUID'),
  type: Joi.string()
    .valid('UNAUTHORIZED_ACCESS', 'FAILED_LOGIN', 'BRUTE_FORCE', 'IP_BLOCKED', 'SUSPICIOUS_ACTIVITY', 'DATA_BREACH', 'MALWARE', 'PHISHING', 'OTHER')
    .example('FAILED_LOGIN')
    .description('Incident type'),
  severity: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    .example('MEDIUM')
    .description('Severity level'),
  status: Joi.string()
    .valid('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED', 'FALSE_POSITIVE')
    .example('INVESTIGATING')
    .description('Incident status'),
  description: Joi.string().example('Multiple failed login attempts from IP 192.168.1.100').description('Incident description'),
  ipAddress: Joi.string().ip().optional().example('192.168.1.100').description('Associated IP address'),
  userId: Joi.string().uuid().optional().example('750e8400-e29b-41d4-a716-446655440002').description('Associated user ID'),
  userName: Joi.string().optional().example('Jane Nurse').description('Associated user name'),
  detectedBy: Joi.string().uuid().example('950e8400-e29b-41d4-a716-446655440004').description('User who detected incident'),
  detectedByName: Joi.string().optional().example('Security Admin').description('Detector name'),
  notes: Joi.string().optional().example('Investigated - determined to be user error').description('Investigation notes'),
  metadata: Joi.object().optional().description('Additional incident metadata'),
  resolvedAt: Joi.date().iso().optional().example('2025-10-23T15:00:00Z').description('Resolution timestamp'),
  resolvedBy: Joi.string().uuid().optional().example('950e8400-e29b-41d4-a716-446655440004').description('User who resolved incident'),
  resolvedByName: Joi.string().optional().example('Security Admin').description('Resolver name'),
  createdAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T14:30:00Z').description('Last update timestamp')
}).label('SecurityIncident');

/**
 * Security Incidents Response Schemas
 */
export const SecurityIncidentsResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.array().items(SecurityIncidentSchema).description('Security incidents'),
  pagination: Joi.object({
    page: Joi.number().integer().example(1).description('Current page'),
    limit: Joi.number().integer().example(20).description('Items per page'),
    total: Joi.number().integer().example(45).description('Total items'),
    totalPages: Joi.number().integer().example(3).description('Total pages')
  }).description('Pagination metadata')
}).label('SecurityIncidentsResponse');

export const SecurityIncidentResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    incident: SecurityIncidentSchema.description('Security incident details')
  })
}).label('SecurityIncidentResponse');

/**
 * ============================================================================
 * IP RESTRICTIONS SCHEMAS
 * ============================================================================
 */

/**
 * IP Restriction Object Schema
 */
export const IpRestrictionSchema = Joi.object({
  id: Joi.string().uuid().example('150e8400-e29b-41d4-a716-446655440005').description('IP restriction UUID'),
  ipAddress: Joi.string().ip({ cidr: 'optional' }).example('192.168.1.0/24').description('IP address or CIDR range'),
  type: Joi.string().valid('ALLOW', 'DENY').example('DENY').description('Restriction type'),
  description: Joi.string().optional().example('Block suspicious IP range').description('Restriction description'),
  createdBy: Joi.string().uuid().example('950e8400-e29b-41d4-a716-446655440004').description('Creator user ID'),
  createdByName: Joi.string().optional().example('Security Admin').description('Creator name'),
  expiresAt: Joi.date().iso().optional().example('2025-11-23T00:00:00Z').description('Expiration timestamp'),
  isActive: Joi.boolean().example(true).description('Whether restriction is active'),
  hitCount: Joi.number().integer().optional().example(15).description('Number of times rule was triggered'),
  lastHitAt: Joi.date().iso().optional().example('2025-10-23T14:00:00Z').description('Last trigger timestamp'),
  createdAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Last update timestamp')
}).label('IpRestriction');

/**
 * IP Restrictions Response Schemas
 */
export const IpRestrictionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    restrictions: Joi.array().items(IpRestrictionSchema).description('IP restrictions'),
    totalRestrictions: Joi.number().integer().example(12).description('Total restriction count'),
    activeRestrictions: Joi.number().integer().example(10).description('Active restriction count')
  })
}).label('IpRestrictionsResponse');

export const IpRestrictionResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    restriction: IpRestrictionSchema.description('IP restriction details')
  })
}).label('IpRestrictionResponse');

/**
 * ============================================================================
 * SECURITY STATISTICS SCHEMAS
 * ============================================================================
 */

/**
 * Security Statistics Object Schema
 */
export const SecurityStatisticsSchema = Joi.object({
  roles: Joi.object({
    total: Joi.number().integer().example(8).description('Total roles'),
    active: Joi.number().integer().example(7).description('Active roles'),
    mostUsed: Joi.string().example('School Nurse').description('Most used role')
  }).description('Role statistics'),
  permissions: Joi.object({
    total: Joi.number().integer().example(45).description('Total permissions'),
    mostAssigned: Joi.string().example('medications:read').description('Most assigned permission')
  }).description('Permission statistics'),
  incidents: Joi.object({
    total: Joi.number().integer().example(125).description('Total incidents'),
    open: Joi.number().integer().example(5).description('Open incidents'),
    critical: Joi.number().integer().example(2).description('Critical incidents'),
    bySeverity: Joi.object().pattern(Joi.string(), Joi.number()).example({
      LOW: 50,
      MEDIUM: 45,
      HIGH: 25,
      CRITICAL: 5
    }).description('Incidents by severity'),
    byType: Joi.object().pattern(Joi.string(), Joi.number()).example({
      FAILED_LOGIN: 60,
      UNAUTHORIZED_ACCESS: 30,
      SUSPICIOUS_ACTIVITY: 20,
      BRUTE_FORCE: 15
    }).description('Incidents by type')
  }).description('Incident statistics'),
  sessions: Joi.object({
    totalActive: Joi.number().integer().example(145).description('Total active sessions'),
    averagePerUser: Joi.number().example(1.8).description('Average sessions per user'),
    oldestSession: Joi.date().iso().optional().example('2025-10-22T08:00:00Z').description('Oldest active session')
  }).description('Session statistics'),
  ipRestrictions: Joi.object({
    total: Joi.number().integer().example(12).description('Total IP restrictions'),
    allowRules: Joi.number().integer().example(5).description('Allow rules'),
    denyRules: Joi.number().integer().example(7).description('Deny rules'),
    expired: Joi.number().integer().example(2).description('Expired rules')
  }).description('IP restriction statistics'),
  users: Joi.object({
    total: Joi.number().integer().example(85).description('Total users'),
    active: Joi.number().integer().example(78).description('Active users'),
    withMultipleRoles: Joi.number().integer().example(12).description('Users with multiple roles')
  }).description('User statistics'),
  recentActivity: Joi.array().items(
    Joi.object({
      type: Joi.string().example('LOGIN').description('Activity type'),
      timestamp: Joi.date().iso().example('2025-10-23T14:30:00Z').description('Activity timestamp'),
      description: Joi.string().example('User logged in successfully').description('Activity description'),
      userId: Joi.string().uuid().optional().description('User ID'),
      userName: Joi.string().optional().example('Jane Nurse').description('User name')
    })
  ).description('Recent security activity'),
  generatedAt: Joi.date().iso().example('2025-10-23T15:00:00Z').description('Statistics generation timestamp')
}).label('SecurityStatistics');

/**
 * Security Statistics Response Schema
 */
export const SecurityStatisticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: SecurityStatisticsSchema
}).label('SecurityStatisticsResponse');

/**
 * ============================================================================
 * DEFAULT ROLES INITIALIZATION SCHEMA
 * ============================================================================
 */

/**
 * Initialize Default Roles Response Schema
 */
export const InitializeDefaultRolesResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object({
    message: Joi.string().example('Default roles initialized').description('Success message'),
    rolesCreated: Joi.number().integer().optional().example(5).description('Number of roles created'),
    permissionsCreated: Joi.number().integer().optional().example(25).description('Number of permissions created'),
    rolesUpdated: Joi.number().integer().optional().example(2).description('Number of roles updated')
  })
}).label('InitializeDefaultRolesResponse');

/**
 * ============================================================================
 * ERROR RESPONSE SCHEMAS
 * ============================================================================
 */

/**
 * Standard Error Response
 */
export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false).description('Request success status'),
  error: Joi.object({
    message: Joi.string().example('An error occurred').description('Human-readable error message'),
    code: Joi.string().example('ERROR_CODE').optional().description('Machine-readable error code'),
    details: Joi.object().optional().description('Additional error details')
  }).description('Error information')
}).label('ErrorResponse');

/**
 * Validation Error Response
 */
export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Validation failed'),
    code: Joi.string().example('VALIDATION_ERROR'),
    details: Joi.array().items(
      Joi.object({
        field: Joi.string().example('name').description('Field name'),
        message: Joi.string().example('Role name is required').description('Validation message'),
        value: Joi.any().optional().description('Invalid value')
      })
    ).description('Validation errors by field')
  })
}).label('ValidationErrorResponse');
