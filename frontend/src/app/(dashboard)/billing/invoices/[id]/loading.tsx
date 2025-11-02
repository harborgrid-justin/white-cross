/**
 * Invoice Detail Loading State
 * 
 * Provides a skeleton UI while individual invoice data is being fetched.
 * Mimics the structure of the invoice detail page for better UX.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function InvoiceDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div>
                  <Skeleton className="h-4 w-18 mb-2" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services/Items Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between font-bold">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-16" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
