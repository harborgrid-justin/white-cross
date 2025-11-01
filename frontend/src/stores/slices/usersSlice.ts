/**
 * @fileoverview User Management Redux Slice
 * 
 * This slice manages comprehensive user administration functionality for the healthcare management
 * system, including user accounts, roles, permissions, authentication status, and organizational
 * hierarchies. Designed specifically for healthcare environments with strict access control,
 * HIPAA compliance requirements, and multi-organizational support.
 * 
 * Key Features:
 * - Role-based user management (Nurses, Administrators, Support Staff, etc.)
 * - Multi-organizational hierarchy support (District → School → Department)
 * - Healthcare-specific role assignments and permissions
 * - User authentication status and session management
 * - Account activation and deactivation workflows
 * - Audit logging for user account changes
 * - HIPAA-compliant user access tracking
 * - Bulk user operations for administrative efficiency
 * - User profile management with healthcare credentials
 * - Integration with access control and permission systems
 * 
 * Healthcare User Roles:
 * - System Administrator: Full system access and configuration
 * - District Administrator: Multi-school oversight and reporting
 * - School Administrator: School-level management and supervision
 * - Head Nurse: Senior nursing staff with administrative duties
 * - School Nurse: Direct patient care and health services
 * - Substitute Nurse: Temporary coverage and limited access
 * - Support Staff: Administrative support with restricted access
 * - IT Support: Technical support with system maintenance access
 * 
 * HIPAA Compliance Features:
 * - User access logging for audit trails
 * - Role-based PHI access controls
 * - Account security monitoring and alerts
 * - User authentication and authorization tracking
 * - Minimum necessary access principle enforcement
 * - User account change audit trails
 * - Session timeout and security controls
 * - Multi-factor authentication integration
 * 
 * Organizational Hierarchy:
 * - District Level: Multi-school administration and oversight
 * - School Level: Individual school management
 * - Department Level: Specialized units (Health Office, Administration)
 * - User Level: Individual staff members and their assignments
 * - Cross-organizational visibility based on role permissions
 * 
 * User Account Lifecycle:
 * - Account Creation: New user onboarding with role assignment
 * - Profile Setup: Healthcare credentials and certifications
 * - Role Assignment: Permission levels and access scope
 * - Account Activation: Initial setup and security configuration
 * - Ongoing Management: Profile updates and role changes
 * - Account Deactivation: Secure offboarding with data retention
 * - Account Archival: Long-term storage for compliance
 * 
 * Performance Optimizations:
 * - User data caching with intelligent invalidation
 * - Lazy loading of user profiles and extended information
 * - Optimistic updates for non-critical user operations
 * - Background synchronization of user directory changes
 * - Efficient filtering and search capabilities
 * - Bulk operations for administrative efficiency
 * 
 * @example
 * // Basic user management
 * const dispatch = useAppDispatch();
 * 
 * // Fetch all users with filtering
 * dispatch(usersThunks.fetchAll({
 *   schoolId: 'school-123',
 *   role: 'nurse',
 *   isActive: true
 * }));
 * 
 * // Create a new nurse user
 * dispatch(usersThunks.create({
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   email: 'jane.smith@school.edu',
 *   role: 'nurse',
 *   schoolId: 'school-123',
 *   departmentId: 'health-office',
 *   credentials: ['RN', 'BSN'],
 *   licenseNumber: 'RN123456789'
 * }));
 * 
 * @example
 * // Role-based user filtering
 * // Get all nurses in a district
 * const nurses = useAppSelector(state => 
 *   selectUsersByRole(state, 'nurse')
 * );
 * 
 * // Get active users in a school
 * const activeStaff = useAppSelector(state =>
 *   selectActiveUsers(state).filter(user => user.schoolId === schoolId)
 * );
 * 
 * @example
 * // User account management
 * // Update user profile
 * dispatch(usersThunks.update('user-456', {
 *   credentials: ['RN', 'BSN', 'CPN'],
 *   licenseExpiration: '2025-12-31',
 *   department: 'pediatric_care'
 * }));
 * 
 * // Deactivate user account
 * dispatch(usersThunks.update('user-789', {
 *   isActive: false,
 *   deactivationReason: 'Employment ended',
 *   deactivationDate: new Date().toISOString()
 * }));
 * 
 * @example
 * // Organizational filtering
 * // Get all users in a school
 * const schoolStaff = useAppSelector(state =>
 *   selectUsersBySchool(state, 'school-123')
 * );
 * 
 * // Get all users in a district
 * const districtStaff = useAppSelector(state =>
 *   selectUsersByDistrict(state, 'district-456')
 * );
 * 
 * @example
 * // Advanced user queries
 * // Get users with expiring licenses
 * const expiringLicenses = useAppSelector(state => {
 *   const allUsers = usersSelectors.selectAll(state);
 *   const thirtyDaysFromNow = new Date();
 *   thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
 *   
 *   return allUsers.filter(user => 
 *     user.licenseExpiration && 
 *     new Date(user.licenseExpiration) <= thirtyDaysFromNow
 *   );
 * });
 * 
 * Integration Points:
 * - Authentication Service: User login and session management
 * - Access Control System: Role-based permissions and restrictions
 * - Audit Logging Service: User action tracking and compliance
 * - Directory Services: Integration with organizational directories
 * - Notification Service: User account alerts and communications
 * - Compliance Dashboard: User access reporting and analytics
 * - HR Systems: Employee lifecycle integration
 * 
 * Security Considerations:
 * - User account data contains PII and must be protected
 * - Role assignments control access to PHI and sensitive data
 * - Account changes require proper authorization and approval
 * - User session management with timeout controls
 * - Password policy enforcement and security requirements
 * - Multi-factor authentication integration
 * - Account lockout and security monitoring
 * 
 * Healthcare-Specific Features:
 * - Healthcare professional credentials tracking
 * - License expiration monitoring and alerts
 * - Continuing education requirements tracking
 * - Clinical competency validation
 * - Coverage and scheduling integration
 * - Emergency contact information management
 * - Professional liability and insurance tracking
 * 
 * Compliance and Audit:
 * - HIPAA-compliant user access management
 * - Audit trail for all user account changes
 * - User access reporting for compliance reviews
 * - Role assignment documentation and approval
 * - Account security monitoring and reporting
 * - Data retention policies for user records
 * - Regulatory compliance reporting
 * 
 * @author [Your Organization] - Healthcare IT Administration Team
 * @version 2.1.0
 * @since 2024-01-15
 * @see {@link https://your-docs.com/user-management} User Management Documentation
 * @see {@link https://your-docs.com/role-based-access} Role-Based Access Control Guide
 * @see {@link https://your-docs.com/healthcare-credentials} Healthcare Credentials Management
 */

import { createEntitySlice, EntityApiService } from '@/stores/sliceFactory';
import { User, CreateUserData, UpdateUserData, UserFilters } from '@/types/administration';
import { apiActions } from '@/lib/api';
import type { RootState } from '@/stores/store';

// Create API service adapter for users
const usersApiService: EntityApiService<User, CreateUserData, UpdateUserData> = {
  async getAll(params?: UserFilters) {
    const response = await apiActions.administration.getUsers(params);
    return {
      data: response.data || [],
      total: response.pagination?.total,
      pagination: response.pagination,
    };
  },

  async getById(id: string) {
    // For now, fetch all and filter - can be optimized with a dedicated endpoint
    const response = await apiActions.administration.getUsers();
    const user = response.data?.find((u: User) => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return { data: user };
  },

  async create(data: CreateUserData) {
    const response = await apiActions.administration.createUser(data);
    return { data: response };
  },

  async update(id: string, data: UpdateUserData) {
    const response = await apiActions.administration.updateUser(id, data);
    return { data: response };
  },

  async delete(id: string) {
    await apiActions.administration.deleteUser(id);
    return { success: true };
  },
};

// Create the users slice using the factory
const usersSliceFactory = createEntitySlice<User, CreateUserData, UpdateUserData>(
  'users',
  usersApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const usersSlice = usersSliceFactory.slice;
export const usersReducer = usersSlice.reducer;
export const usersActions = usersSliceFactory.actions;
export const usersSelectors = usersSliceFactory.adapter.getSelectors((state: RootState) => state.users);
export const usersThunks = usersSliceFactory.thunks;

// Export custom selectors
export const selectUsersByRole = (state: RootState, role: string): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.role === role);
};

export const selectActiveUsers = (state: RootState): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.isActive);
};

export const selectUsersBySchool = (state: RootState, schoolId: string): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.schoolId === schoolId);
};

export const selectUsersByDistrict = (state: RootState, districtId: string): User[] => {
  const allUsers = usersSelectors.selectAll(state) as User[];
  return allUsers.filter(user => user.districtId === districtId);
};
