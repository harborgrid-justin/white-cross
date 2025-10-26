/**
 * Vendors Page - Manage inventory vendors and suppliers
 *
 * @module app/inventory/vendors/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Search, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

interface Vendor {
  id: string
  name: string
  contactPerson: string
  email: string
  phoneNumber: string
  address: string
  status: 'active' | 'inactive'
  totalOrders: number
  rating: number
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/inventory/vendors', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setVendors(data.vendors || [])
      } catch (error) {
        console.error('Error fetching vendors:', error)
        toast.error('Failed to load vendors')
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredVendors.length} vendors</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.contactPerson}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {vendor.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {vendor.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {vendor.phoneNumber}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{vendor.totalOrders} orders</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-yellow-600">★ {vendor.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
