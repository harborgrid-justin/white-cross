/**
 * WF-COMP-275 | types.ts - Admin page type definitions
 * Purpose: Centralized type definitions for admin module
 * Last Updated: 2025-10-24 | File Type: .ts
 */

// =====================================================
// USER TYPES
// =====================================================

/**
 * User data interface for admin user management
 * @interface UserData
 */
export interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
}

/**
 * Form data for creating/editing users
 * @interface UserFormData
 */
export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
}

// =====================================================
// INVENTORY TYPES
// =====================================================

/**
 * Inventory tab identifier
 * @type InventoryTab
 */
export type InventoryTab = 'items' | 'vendors' | 'orders' | 'budget' | 'analytics';

/**
 * Inventory sortable columns
 * @type InventorySortColumn
 */
export type InventorySortColumn = 'name' | 'category' | 'quantity' | 'reorderLevel' | 'lastUpdated';

/**
 * Inventory filter criteria
 * @interface InventoryFilters
 */
export interface InventoryFilters {
  searchQuery: string;
  selectedCategory: string;
  alertLevel: 'all' | 'critical' | 'low' | 'adequate';
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
}

/**
 * Inventory item data structure
 * @interface InventoryItem
 */
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier?: string;
  lastUpdated: Date;
  expirationDate?: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

/**
 * Inventory alert data structure
 * @interface InventoryAlert
 */
export interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  alertType: 'low-stock' | 'out-of-stock' | 'expiring-soon' | 'expired';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  createdAt: Date;
}

/**
 * Vendor information
 * @interface Vendor
 */
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: string[];
  rating: number;
  status: 'active' | 'inactive';
}

/**
 * Purchase order data structure
 * @interface PurchaseOrder
 */
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  orderDate: Date;
  expectedDelivery?: Date;
}

/**
 * Budget category data
 * @interface BudgetCategory
 */
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

// =====================================================
// REPORTS TYPES
// =====================================================

/**
 * Report tab identifier
 * @type TabType
 */
export type TabType =
  | 'overview'
  | 'health'
  | 'medication'
  | 'incidents'
  | 'attendance'
  | 'dashboard'
  | 'compliance'
  | 'custom';

/**
 * Date range for reports
 * @interface DateRange
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Report export options
 * @interface ReportExportOptions
 */
export interface ReportExportOptions {
  reportType: string;
  format: 'csv' | 'pdf' | 'excel';
  filters: DateRange;
}

// =====================================================
// ROLE & PERMISSION TYPES
// =====================================================

/**
 * Role data structure
 * @interface Role
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission data structure
 * @interface Permission
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedRoles: string[];
  assignedUsers: number;
}

/**
 * Permission category metadata
 * @interface PermissionCategory
 */
export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// =====================================================
// DISTRICT & SCHOOL TYPES
// =====================================================

/**
 * District data structure
 * @interface District
 */
export interface District {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  superintendent: string;
  schoolCount: number;
  studentCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

/**
 * School data structure
 * @interface School
 */
export interface School {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  studentCount: number;
  staffCount: number;
  grades: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

// =====================================================
// SYSTEM TYPES
// =====================================================

/**
 * System health status
 * @interface SystemHealthStatus
 */
export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  lastCheck: Date;
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
  }>;
}

/**
 * Audit log entry
 * @interface AuditLogEntry
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: Record<string, unknown>;
  ipAddress: string;
  timestamp: Date;
  status: 'success' | 'failure';
}

/**
 * System settings configuration
 * @interface SystemSettings
 */
export interface SystemSettings {
  id: string;
  key: string;
  value: string | number | boolean;
  category: string;
  description: string;
  isEditable: boolean;
  lastModified: Date;
  modifiedBy: string;
}

// =====================================================
// COMMON TYPES
// =====================================================

/**
 * Pagination parameters
 * @interface PaginationParams
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Sort configuration
 * @interface SortConfig
 */
export interface SortConfig<T = string> {
  column: T;
  direction: 'asc' | 'desc';
}

/**
 * Filter state for lists
 * @interface FilterState
 */
export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  dateRange?: DateRange;
}

/**
 * API response wrapper
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationParams;
}

/**
 * Error response structure
 * @interface ErrorResponse
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}
