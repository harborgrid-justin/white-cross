'use client';

import React, { useState } from 'react';
import { 
  Settings,
  Save,
  RefreshCw,
  CreditCard,
  DollarSign,
  Clock,
  Mail,
  Bell,
  Shield,
  FileText,
  Building,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  Edit3,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

/**
 * Tax configuration interface
 */
interface TaxConfig {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  enabled: boolean;
}

/**
 * Payment method configuration interface
 */
interface PaymentMethodConfig {
  method: string;
  enabled: boolean;
  processingFee: number;
  requiresApproval: boolean;
}

/**
 * Props for the BillingSettings component
 */
interface BillingSettingsProps {
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Save settings handler */
  onSaveSettings?: (settings: any) => void;
  /** Test payment gateway handler */
  onTestGateway?: () => void;
  /** Export settings handler */
  onExportSettings?: () => void;
  /** Import settings handler */
  onImportSettings?: () => void;
}

/**
 * BillingSettings Component
 * 
 * A comprehensive billing settings management component for configuring
 * payment methods, tax rates, invoice templates, notification preferences,
 * and billing system parameters.
 * 
 * @param props - BillingSettings component props
 * @returns JSX element representing the billing settings interface
 */
const BillingSettings = ({
  loading = false,
  className = '',
  onSaveSettings,
  onTestGateway,
  onExportSettings,
  onImportSettings
}: BillingSettingsProps) => {
  // State
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([
    { id: '1', name: 'Sales Tax', rate: 8.5, type: 'percentage', enabled: true },
    { id: '2', name: 'Service Fee', rate: 5.0, type: 'fixed', enabled: false }
  ]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([
    { method: 'credit-card', enabled: true, processingFee: 2.9, requiresApproval: false },
    { method: 'bank-transfer', enabled: true, processingFee: 0.5, requiresApproval: true },
    { method: 'cash', enabled: true, processingFee: 0, requiresApproval: false }
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'White Cross Healthcare',
    companyAddress: '123 Healthcare Blvd, Medical City, MC 12345',
    taxId: '12-3456789',
    currency: 'USD',
    invoicePrefix: 'INV-',
    invoiceNumberStart: 1000,
    paymentTerms: '30 days',
    lateFeesEnabled: true,
    lateFeeAmount: 25,
    lateFeeType: 'fixed',
    autoRemindersEnabled: true,
    reminderDays: [7, 3, 1]
  });

  const [gatewaySettings, setGatewaySettings] = useState({
    provider: 'stripe',
    apiKey: '***************',
    webhookUrl: 'https://api.whitecross.com/webhooks/billing',
    testMode: true,
    autoCapture: true,
    retryFailedPayments: true,
    maxRetries: 3
  });

  const [notificationSettings, setNotificationSettings] = useState({
    invoiceGenerated: true,
    paymentReceived: true,
    paymentFailed: true,
    invoiceOverdue: true,
    refundProcessed: true,
    emailTemplate: 'default',
    smsNotifications: false
  });

  /**
   * Handles settings save
   */
  const handleSaveSettings = () => {
    const settings = {
      general: generalSettings,
      gateway: gatewaySettings,
      notifications: notificationSettings,
      taxes: taxConfigs,
      paymentMethods: paymentMethods
    };
    onSaveSettings?.(settings);
  };

  /**
   * Renders general settings tab
   */
  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={generalSettings.companyName}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
            <input
              id="taxId"
              type="text"
              value={generalSettings.taxId}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, taxId: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
          <textarea
            id="companyAddress"
            value={generalSettings.companyAddress}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="invoicePrefix" className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
            <input
              id="invoicePrefix"
              type="text"
              value={generalSettings.invoicePrefix}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="invoiceNumberStart" className="block text-sm font-medium text-gray-700 mb-1">Starting Number</label>
            <input
              id="invoiceNumberStart"
              type="number"
              value={generalSettings.invoiceNumberStart}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, invoiceNumberStart: parseInt(e.target.value) }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
            <select
              id="paymentTerms"
              value={generalSettings.paymentTerms}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, paymentTerms: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="immediate">Due Immediately</option>
              <option value="15 days">Net 15</option>
              <option value="30 days">Net 30</option>
              <option value="60 days">Net 60</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Late Fees & Reminders</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="lateFeesEnabled"
              type="checkbox"
              checked={generalSettings.lateFeesEnabled}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, lateFeesEnabled: e.target.checked }))}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="lateFeesEnabled" className="ml-2 text-sm text-gray-700">Enable late fees</label>
          </div>
          
          {generalSettings.lateFeesEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lateFeeAmount" className="block text-sm font-medium text-gray-700 mb-1">Late Fee Amount</label>
                <input
                  id="lateFeeAmount"
                  type="number"
                  value={generalSettings.lateFeeAmount}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, lateFeeAmount: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="lateFeeType" className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                <select
                  id="lateFeeType"
                  value={generalSettings.lateFeeType}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, lateFeeType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="autoRemindersEnabled"
              type="checkbox"
              checked={generalSettings.autoRemindersEnabled}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoRemindersEnabled: e.target.checked }))}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="autoRemindersEnabled" className="ml-2 text-sm text-gray-700">Enable automatic reminders</label>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders payment methods tab
   */
  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Gateway</h3>
          <button
            onClick={onTestGateway}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Test Connection
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Payment Provider</label>
            <select
              id="provider"
              value={gatewaySettings.provider}
              onChange={(e) => setGatewaySettings(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="square">Square</option>
              <option value="authorize">Authorize.Net</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={gatewaySettings.apiKey}
                onChange={(e) => setGatewaySettings(prev => ({ ...prev, apiKey: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showApiKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              id="testMode"
              type="checkbox"
              checked={gatewaySettings.testMode}
              onChange={(e) => setGatewaySettings(prev => ({ ...prev, testMode: e.target.checked }))}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="testMode" className="ml-2 text-sm text-gray-700">Test mode</label>
          </div>
          
          <div className="flex items-center">
            <input
              id="autoCapture"
              type="checkbox"
              checked={gatewaySettings.autoCapture}
              onChange={(e) => setGatewaySettings(prev => ({ ...prev, autoCapture: e.target.checked }))}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="autoCapture" className="ml-2 text-sm text-gray-700">Auto-capture payments</label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accepted Payment Methods</h3>
        
        <div className="space-y-3">
          {paymentMethods.map((method, index) => (
            <div key={method.method} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={(e) => {
                    const updated = [...paymentMethods];
                    updated[index].enabled = e.target.checked;
                    setPaymentMethods(updated);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {method.method.replace('-', ' ')}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Fee: {method.processingFee}%
                </div>
                {method.requiresApproval && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Requires Approval
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'taxes', label: 'Taxes', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'templates', label: 'Templates', icon: FileText }
  ];

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 rounded-lg p-2">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Settings</h1>
                <p className="text-gray-600">
                  Configure billing preferences and system settings
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onImportSettings}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Import Settings
            </button>
            
            <button
              onClick={onExportSettings}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Export Settings
            </button>
            
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'payments' && renderPaymentTab()}
        {activeTab === 'taxes' && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Tax configuration settings will be displayed here.</p>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Notification preferences will be displayed here.</p>
          </div>
        )}
        {activeTab === 'templates' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Invoice templates configuration will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingSettings;
