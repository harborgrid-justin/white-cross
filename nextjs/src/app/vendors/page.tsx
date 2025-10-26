/**
 * Vendors List Page
 *
 * Comprehensive vendor management with performance tracking, certification management,
 * and order history.
 *
 * Features:
 * - Vendor list with ratings and status
 * - Performance metrics and analytics
 * - Certification tracking
 * - Order history integration
 * - Vendor search and filtering
 * - Quick actions (view, edit, create PO)
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Download,
  Search,
  Eye,
  Edit,
  FileText,
  Award,
  TrendingUp,
  Package,
  Star,
  Building2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import type { Vendor, VendorStatus, VendorRating } from '@/types/vendors';

// Mock data
const mockVendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Medical Supplies Inc.',
    legalName: 'Medical Supplies Incorporated',
    vendorNumber: 'V-001',
    status: 'ACTIVE',
    rating: 'EXCELLENT',
    contacts: [
      {
        id: 'c1',
        name: 'John Smith',
        title: 'Sales Manager',
        email: 'john.smith@medsupplies.com',
        phone: '(555) 123-4567',
        isPrimary: true,
      },
    ],
    addresses: [
      {
        id: 'a1',
        type: 'BILLING',
        street1: '123 Medical Way',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'US',
        isPrimary: true,
      },
    ],
    website: 'https://medsupplies.com',
    taxId: '12-3456789',
    paymentTerms: 'Net 30',
    preferredPaymentMethod: 'ACH',
    creditLimit: 50000,
    categories: ['Medical Supplies', 'First Aid'],
    productLines: ['Bandages', 'Gauze', 'Tape'],
    certifications: [
      {
        id: 'cert1',
        name: 'ISO 9001',
        certificationNumber: 'ISO-9001-2024',
        issuedBy: 'International Standards Organization',
        issuedDate: '2024-01-01',
        expirationDate: '2027-01-01',
        verified: true,
      },
    ],
    performance: {
      vendorId: 'vendor-1',
      overallRating: 'EXCELLENT',
      ratingScore: 92,
      onTimeDeliveryRate: 95,
      averageDeliveryDays: 8,
      lateDeliveries: 2,
      earlyDeliveries: 18,
      defectRate: 1.2,
      returnRate: 0.5,
      qualityScore: 94,
      totalOrders: 45,
      completedOrders: 43,
      cancelledOrders: 2,
      totalValue: 125000,
      averageOrderValue: 2777,
      complianceRate: 98,
      documentationScore: 96,
      averageResponseTime: 4,
      communicationScore: 93,
      priceCompetitiveness: 88,
      totalSpend: 125000,
      costSavings: 5000,
      periodStart: '2024-07-01',
      periodEnd: '2025-06-30',
      lastUpdated: '2025-01-26',
    },
    w9OnFile: true,
    insuranceCertOnFile: true,
    contractOnFile: true,
    backgroundCheckCompleted: true,
    createdBy: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    lastModifiedBy: 'user1',
    lastOrderDate: '2025-01-15',
  },
  {
    id: 'vendor-2',
    name: 'Pharma Distributors LLC',
    legalName: 'Pharma Distributors Limited Liability Company',
    vendorNumber: 'V-002',
    status: 'ACTIVE',
    rating: 'GOOD',
    contacts: [
      {
        id: 'c2',
        name: 'Sarah Johnson',
        title: 'Account Manager',
        email: 'sarah.johnson@pharmadist.com',
        phone: '(555) 987-6543',
        isPrimary: true,
      },
    ],
    addresses: [
      {
        id: 'a2',
        type: 'BILLING',
        street1: '456 Pharma Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'US',
        isPrimary: true,
      },
    ],
    website: 'https://pharmadist.com',
    taxId: '98-7654321',
    paymentTerms: 'Net 45',
    preferredPaymentMethod: 'Check',
    creditLimit: 100000,
    categories: ['Medications', 'Prescriptions'],
    productLines: ['EpiPens', 'Inhalers', 'Medications'],
    certifications: [],
    performance: {
      vendorId: 'vendor-2',
      overallRating: 'GOOD',
      ratingScore: 82,
      onTimeDeliveryRate: 87,
      averageDeliveryDays: 12,
      lateDeliveries: 8,
      earlyDeliveries: 12,
      defectRate: 2.1,
      returnRate: 1.2,
      qualityScore: 85,
      totalOrders: 32,
      completedOrders: 30,
      cancelledOrders: 2,
      totalValue: 280000,
      averageOrderValue: 8750,
      complianceRate: 94,
      documentationScore: 90,
      averageResponseTime: 6,
      communicationScore: 88,
      priceCompetitiveness: 92,
      totalSpend: 280000,
      costSavings: 12000,
      periodStart: '2024-07-01',
      periodEnd: '2025-06-30',
      lastUpdated: '2025-01-26',
    },
    w9OnFile: true,
    insuranceCertOnFile: true,
    contractOnFile: true,
    backgroundCheckCompleted: true,
    createdBy: 'user1',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
    lastModifiedBy: 'user1',
    lastOrderDate: '2025-01-10',
  },
];

export default function VendorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | 'ALL'>('ALL');
  const [ratingFilter, setRatingFilter] = useState<VendorRating | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingBadge = (rating: VendorRating) => {
    const styles = {
      EXCELLENT: 'bg-green-100 text-green-800',
      GOOD: 'bg-blue-100 text-blue-800',
      AVERAGE: 'bg-yellow-100 text-yellow-800',
      POOR: 'bg-red-100 text-red-800',
      UNRATED: 'bg-gray-100 text-gray-800',
    };
    return styles[rating] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: VendorStatus) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800',
      BLACKLISTED: 'bg-red-100 text-red-800',
    };
    return styles[status];
  };

  const getRatingStars = (score: number) => {
    const stars = Math.round((score / 100) * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const allCategories = Array.from(
    new Set(mockVendors.flatMap((v) => v.categories))
  );

  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendorNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || vendor.status === statusFilter;
      const matchesRating =
        ratingFilter === 'ALL' || vendor.rating === ratingFilter;
      const matchesCategory =
        categoryFilter === 'ALL' || vendor.categories.includes(categoryFilter);
      return matchesSearch && matchesStatus && matchesRating && matchesCategory;
    });
  }, [searchQuery, statusFilter, ratingFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600 mt-1">
              Manage vendors, track performance, and view certifications
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/vendors/performance')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => router.push('/vendors/new')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">
              {mockVendors.length}
            </span>
          </div>
          <div className="text-sm text-gray-600">Total Vendors</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {mockVendors.filter((v) => v.status === 'ACTIVE').length}
            </span>
          </div>
          <div className="text-sm text-gray-600">Active Vendors</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">
              {mockVendors.filter((v) => v.rating === 'EXCELLENT').length}
            </span>
          </div>
          <div className="text-sm text-gray-600">Excellent Rating</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {mockVendors.reduce(
                (sum, v) => sum + v.certifications.length,
                0
              )}
            </span>
          </div>
          <div className="text-sm text-gray-600">Total Certifications</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="ALL">All Ratings</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good</option>
            <option value="AVERAGE">Average</option>
            <option value="POOR">Poor</option>
            <option value="UNRATED">Unrated</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="ALL">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/vendors/${vendor.id}`)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vendor.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        vendor.status
                      )}`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {vendor.vendorNumber}
                  </div>
                  {vendor.performance && (
                    <div className="flex items-center gap-1">
                      {getRatingStars(vendor.performance.ratingScore)}
                      <span className="ml-2 text-sm text-gray-600">
                        {vendor.performance.ratingScore}/100
                      </span>
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${getRatingBadge(
                    vendor.rating
                  )}`}
                >
                  {vendor.rating}
                </span>
              </div>

              {/* Contact Info */}
              {vendor.contacts.find((c) => c.isPrimary) && (
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {vendor.contacts.find((c) => c.isPrimary)?.phone || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {vendor.contacts.find((c) => c.isPrimary)?.email || 'N/A'}
                  </div>
                  {vendor.addresses.find((a) => a.isPrimary) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {vendor.addresses.find((a) => a.isPrimary)?.city},{' '}
                      {vendor.addresses.find((a) => a.isPrimary)?.state}
                    </div>
                  )}
                </div>
              )}

              {/* Performance Metrics */}
              {vendor.performance && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      On-Time Delivery
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.performance.onTimeDeliveryRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Total Orders
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.performance.totalOrders}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Spend</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(vendor.performance.totalSpend)}
                    </div>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance Indicators */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                {vendor.w9OnFile && (
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1 text-green-600" />
                    W-9
                  </div>
                )}
                {vendor.insuranceCertOnFile && (
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1 text-green-600" />
                    Insurance
                  </div>
                )}
                {vendor.certifications.length > 0 && (
                  <div className="flex items-center">
                    <Award className="w-3 h-3 mr-1 text-blue-600" />
                    {vendor.certifications.length} Certs
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/vendors/${vendor.id}`);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/purchase-orders/new?vendor=${vendor.id}`);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Create PO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No vendors found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'ALL' || ratingFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Get started by adding a new vendor'}
          </p>
          {!searchQuery &&
            statusFilter === 'ALL' &&
            ratingFilter === 'ALL' && (
              <div className="mt-6">
                <button
                  onClick={() => router.push('/vendors/new')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Vendor
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
