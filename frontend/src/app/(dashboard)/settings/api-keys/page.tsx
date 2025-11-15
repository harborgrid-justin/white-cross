/**
 * @fileoverview API Keys Settings Page
 * @module app/(dashboard)/settings/api-keys/page
 * @category Settings - API Keys
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'API Keys',
  description: 'Manage API access tokens and integration keys for White Cross Healthcare platform.',
  keywords: [
    'api keys',
    'access tokens',
    'integration',
    'developer access',
    'api management'
  ],
  robots: {
    index: false,
    follow: false,
  },
};

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

// Mock data for now - replace with actual API calls when backend endpoints are available
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Integration',
    key: 'wc_live_••••••••••••••••••••••••••••••••••••••••',
    permissions: ['read:students', 'write:health_records'],
    createdAt: '2024-01-15',
    lastUsed: '2024-01-20',
    isActive: true
  },
  {
    id: '2',
    name: 'Testing Environment',
    key: 'wc_test_••••••••••••••••••••••••••••••••••••••••',
    permissions: ['read:all'],
    createdAt: '2024-01-10',
    isActive: false
  }
];

function ApiKeysContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">
            Manage API access tokens for integrations and external applications
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {mockApiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Created on {new Date(apiKey.createdAt).toLocaleDateString()}
                      {apiKey.lastUsed && (
                        <> • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* API Key Display */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-3 py-2 bg-gray-50 border rounded-md text-sm font-mono">
                        {apiKey.key}
                      </code>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-gray-500">
                    {apiKey.isActive ? 'This key is currently active' : 'This key is disabled'}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      {apiKey.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockApiKeys.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Create your first API key to start integrating with the White Cross platform.
              API keys allow secure access to your data programmatically.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First API Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            API Key Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Security Best Practices</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Store API keys securely and never expose them in client-side code</li>
              <li>Use the principle of least privilege - only grant necessary permissions</li>
              <li>Rotate API keys regularly and disable unused keys immediately</li>
              <li>Monitor API key usage and set up alerts for unusual activity</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Available Permissions</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li><code>read:students</code> - Read student information</li>
              <li><code>write:students</code> - Create and update student records</li>
              <li><code>read:health_records</code> - Access health record data</li>
              <li><code>write:health_records</code> - Modify health records</li>
              <li><code>read:appointments</code> - View appointment data</li>
              <li><code>write:appointments</code> - Schedule and modify appointments</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ApiKeysPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <Suspense fallback={<ApiKeysPageSkeleton />}>
      <ApiKeysContent />
    </Suspense>
  );
}