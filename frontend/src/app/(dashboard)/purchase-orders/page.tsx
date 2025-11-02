/**
 * Purchase Orders List Page
 *
 * Comprehensive purchase order management with approval workflow, receiving tracking,
 * and vendor management integration.
 *
 * Features:
 * - PO list with advanced filtering and search
 * - Status-based organization (Pending, Approved, Received, etc.)
 * - Approval workflow tracking
 * - Quick actions (approve, receive, cancel)
 * - Export and reporting
 * - Integration with budget tracking
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Package,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react';
import type {
  PurchaseOrder,
  PurchaseOrderStatus,
  PurchaseOrderStatistics,
} from '@/types/domain/purchaseOrders';

// Mock data
const mockStatistics: PurchaseOrderStatistics = {
  totalOrders: 145,
  pendingOrders: 12,
  approvedOrders: 8,
  partiallyReceivedOrders: 5,
  totalValue: 425000,
  recentOrders: 23,
  avgDeliveryTime: 12,
  onTimeDeliveryRate: 87.5,
};

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2025-001',
    vendorId: 'vendor-1',
    vendor: {
      id: 'vendor-1',
      name: 'Medical Supplies Inc.',
      vendorNumber: 'V-001',
      status: 'ACTIVE',
      rating: 'EXCELLENT',
      contacts: [],
      addresses: [],
      paymentTerms: 'Net 30',
      preferredPaymentMethod: 'ACH',
      categories: ['Medical Supplies'],
      productLines: [],
      certifications: [],
      w9OnFile: true,
      insuranceCertOnFile: true,
      contractOnFile: true,
      backgroundCheckCompleted: true,
      createdBy: 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      lastModifiedBy: 'user1',
    },
    orderDate: '2025-01-15',
    expectedDate: '2025-01-30',
    status: 'PENDING' as PurchaseOrderStatus,
    subtotal: 15000,
    tax: 1200,
    shipping: 300,
    total: 16500,
    notes: 'Urgent order for medical supplies',
    items: [],
    totalItems: 15,
    receivedItems: 0,
    pendingItems: 15,
    fulfillmentPercentage: 0,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'PO-2025-002',
    vendorId: 'vendor-2',
    vendor: {
      id: 'vendor-2',
      name: 'Pharma Distributors LLC',
      vendorNumber: 'V-002',
      status: 'ACTIVE',
      rating: 'GOOD',
      contacts: [],
      addresses: [],
      paymentTerms: 'Net 45',
      preferredPaymentMethod: 'Check',
      categories: ['Medications'],
      productLines: [],
      certifications: [],
      w9OnFile: true,
      insuranceCertOnFile: true,
      contractOnFile: true,
      backgroundCheckCompleted: true,
      createdBy: 'user1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      lastModifiedBy: 'user1',
    },
    orderDate: '2025-01-10',
    expectedDate: '2025-01-25',
    receivedDate: '2025-01-24',
    status: 'RECEIVED' as PurchaseOrderStatus,
    subtotal: 45000,
    tax: 3600,
    shipping: 500,
    total: 49100,
    approvedBy: 'user2',
    approvedAt: '2025-01-11T14:00:00Z',
    items: [],
    totalItems: 30,
    receivedItems: 30,
    pendingItems: 0,
    fulfillmentPercentage: 100,
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-24T16:00:00Z',
  },
];

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    PurchaseOrderStatus | 'ALL'
  >('ALL');
  const [sortBy, setSortBy] = useState<'orderDate' | 'total' | 'status'>(
    'orderDate'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      ORDERED: 'bg-indigo-100 text-indigo-800',
      PARTIALLY_RECEIVED: 'bg-purple-100 text-purple-800',
      RECEIVED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'ORDERED':
        return <FileText className="w-4 h-4" />;
      case 'PARTIALLY_RECEIVED':
        return <Package className="w-4 h-4" />;
      case 'RECEIVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredOrders = useMemo(() => {
    return mockPurchaseOrders
      .filter((order) => {
        const matchesSearch =
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === 'ALL' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'orderDate') {
          comparison =
            new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        } else if (sortBy === 'total') {
          comparison = a.total - b.total;
        } else if (sortBy === 'status') {
          comparison = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase Orders
            </h1>
            <p className="text-gray-600 mt-1">
              Manage purchase orders, approvals, and receiving
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/purchase-orders/approvals')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approvals
              {mockStatistics.pendingOrders > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  {mockStatistics.pendingOrders}
                </span>
              )}
            </button>
            <button
              onClick={() => router.push('/vendors')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="w-4 h-4 mr-2" />
              Vendors
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => router.push('/purchase-orders/new')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New PO
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Orders
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockStatistics.totalOrders}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {mockStatistics.recentOrders} in last 30 days
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Pending
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockStatistics.pendingOrders}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Awaiting approval
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Value
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(mockStatistics.totalValue)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Year to date
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              On-Time Rate
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockStatistics.onTimeDeliveryRate}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Avg delivery: {mockStatistics.avgDeliveryTime} days
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PO number or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as PurchaseOrderStatus | 'ALL')
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="ORDERED">Ordered</option>
            <option value="PARTIALLY_RECEIVED">Partially Received</option>
            <option value="RECEIVED">Received</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="orderDate-desc">Newest First</option>
            <option value="orderDate-asc">Oldest First</option>
            <option value="total-desc">Highest Value</option>
            <option value="total-asc">Lowest Value</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/purchase-orders/${order.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                    {order.notes && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {order.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.vendor?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.expectedDate
                      ? formatDate(order.expectedDate)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.receivedItems || 0} / {order.totalItems || 0}
                    </div>
                    {order.fulfillmentPercentage !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{
                            width: `${order.fulfillmentPercentage}%`,
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/purchase-orders/${order.id}`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle approve
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(order.status === 'APPROVED' ||
                        order.status === 'PARTIALLY_RECEIVED') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle receive
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Receive Items"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No purchase orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Get started by creating a new purchase order'}
            </p>
            {!searchQuery && statusFilter === 'ALL' && (
              <div className="mt-6">
                <button
                  onClick={() => router.push('/purchase-orders/new')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Purchase Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
