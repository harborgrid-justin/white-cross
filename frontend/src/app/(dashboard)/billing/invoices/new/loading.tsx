/**
 * New Invoice Form Loading State
 * 
 * Provides a skeleton UI while the new invoice form is being prepared.
 * Mimics the structure of the invoice creation form for better UX.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function NewInvoiceLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services/Items Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Service Items */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Skeleton className="h-16 w-16 mx-auto mb-4" />
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-3 w-40 mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
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
            </CardContent>
          </Card>

          {/* Recent Templates Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
