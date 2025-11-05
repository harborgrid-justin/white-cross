/**
 * @fileoverview Authentication Example Page - Following Gold Standard Architecture
 * @module app/(dashboard)/auth-example/page
 * @category Dashboard - Authentication Example
 * 
 * This page demonstrates the proper way to implement authentication in the
 * White Cross Healthcare Platform following the established patterns and
 * best practices from other dashboard pages.
 * 
 * **Authentication Features Demonstrated:**
 * - Server-side authentication checks
 * - Proper metadata and SEO handling
 * - Suspense boundaries for loading states
 * - Server actions integration
 * - Component architecture following established patterns
 * - TypeScript typing following platform standards
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Activity, Settings } from 'lucide-react';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';

// Server actions - following the established pattern
import { logoutAction } from '@/identity-access/actions/auth.actions';

export const metadata: Metadata = {
  title: 'Authentication Example',
  description: 'Demonstrates proper authentication implementation following White Cross Healthcare Platform best practices and gold standard architecture.',
  keywords: [
    'authentication',
    'security',
    'healthcare',
    'dashboard',
    'server actions',
    'Next.js',
    'best practices'
  ],
  openGraph: {
    title: 'Authentication Example | White Cross Healthcare',
    description: 'Example page showing proper authentication implementation with server-side security.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Loading skeleton following dashboard pattern
 */
function AuthExampleLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

/**
 * Authentication stats component
 */
function AuthenticationStats() {
  const stats = [
    {
      title: "Server-Side Authentication",
      description: "Authentication handled entirely on the server using Next.js server actions",
      icon: Shield,
      status: "✅ Implemented"
    },
    {
      title: "HTTP-Only Cookies",
      description: "Secure token storage using HTTP-only cookies, preventing XSS attacks",
      icon: Settings,
      status: "✅ Secure"
    },
    {
      title: "HIPAA Audit Logging",
      description: "All authentication events are logged for HIPAA compliance",
      icon: Activity,
      status: "✅ Compliant"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-blue-600" />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{stat.description}</p>
            <span className="text-xs font-medium text-green-600">{stat.status}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Server action demonstration
 */
function ServerActionDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Server Actions Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          The authentication system uses Next.js server actions for secure, server-side processing:
        </p>
        
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-md">
            <code className="text-sm">loginAction(prevState, formData)</code>
            <p className="text-xs text-gray-500 mt-1">Handles login with validation and audit logging</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <code className="text-sm">logoutAction()</code>
            <p className="text-xs text-gray-500 mt-1">Secure logout with cookie cleanup</p>
          </div>
        </div>

        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            Test Logout Action
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Authentication Example Page - Server Component with Data Fetching
 * 
 * Follows the established pattern from other dashboard pages:
 * - Async server component
 * - Proper metadata setup
 * - Suspense boundaries
 * - Component composition
 * - Server actions integration
 */
export default async function AuthExamplePage() {
  // In a real implementation, you would fetch user data here
  // using your established server actions pattern
  // const userData = await getCurrentUser();
  
  return (
    <div className="space-y-6">
      {/* Page Header following established pattern */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <PageBreadcrumbs 
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Authentication Example' }
            ]} 
          />
          <PageHeader
            title="Authentication Example"
            description="Demonstrating proper authentication implementation using the gold standard architecture"
          />
        </div>
      </div>

      {/* Main content with Suspense following dashboard pattern */}
      <Suspense fallback={<AuthExampleLoading />}>
        <div className="space-y-6">
          {/* Authentication Stats */}
          <AuthenticationStats />
          
          {/* Server Actions Demo */}
          <ServerActionDemo />
          
          {/* Architecture Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Gold Standard Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">✅ What We&apos;re Using (Gold Standard):</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Server Actions for authentication</li>
                    <li>• HTTP-only cookies for token storage</li>
                    <li>• Server-side route protection</li>
                    <li>• Built-in CSRF protection</li>
                    <li>• Proper Next.js caching</li>
                    <li>• HIPAA audit logging</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">❌ What We Avoided:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Client-side route protection</li>
                    <li>• JavaScript-accessible tokens</li>
                    <li>• Flash of unauthenticated content</li>
                    <li>• Hydration-dependent auth</li>
                    <li>• Complex client state management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  );
}