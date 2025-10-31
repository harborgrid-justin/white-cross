'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileText, Search, Plus, Eye, Edit, CheckCircle, Clock } from 'lucide-react';
import type { Policy, PolicyStatistics } from '@/schemas/compliance/policy.schemas';
import Link from 'next/link';

interface PolicyLibraryProps {
  policies: Policy[];
  statistics?: Record<string, PolicyStatistics>;
  onViewPolicy?: (policy: Policy) => void;
  onEditPolicy?: (policy: Policy) => void;
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  ACTIVE: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
  SUPERSEDED: 'bg-yellow-100 text-yellow-800',
};

export function PolicyLibrary({ policies, statistics, onViewPolicy, onEditPolicy }: PolicyLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPolicies = policies.filter(
    (policy) =>
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Policy Library</h2>
          <p className="text-gray-600 mt-1">Manage organizational policies and compliance documents</p>
        </div>
        <Button href="/compliance/policies/new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Policy
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search policies by title, type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPolicies.map((policy) => {
          const stats = statistics?.[policy.id];
          return (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <Badge className={statusColors[policy.status]}>{policy.status}</Badge>
                </div>
                <CardTitle className="mt-4 line-clamp-2">{policy.title}</CardTitle>
                <CardDescription className="line-clamp-2">{policy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Policy Type */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <Badge variant="outline">{policy.policyType.replace(/_/g, ' ')}</Badge>
                  </div>

                  {/* Version */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Version</span>
                    <span className="font-medium">{policy.version}</span>
                  </div>

                  {/* Effective Date */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Effective Date</span>
                    <span className="font-medium">{formatDate(policy.effectiveDate)}</span>
                  </div>

                  {/* Acknowledgment Status */}
                  {stats && policy.requiresAcknowledgment && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Acknowledgments</span>
                        <span className="font-medium">
                          {stats.acknowledged} / {stats.totalAssignments}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${stats.acknowledgmentRate}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {stats.pending > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <Clock className="h-3 w-3" />
                            {stats.pending} pending
                          </div>
                        )}
                        {stats.overdue > 0 && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <Clock className="h-3 w-3" />
                            {stats.overdue} overdue
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onViewPolicy?.(policy)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {policy.status !== 'ARCHIVED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEditPolicy?.(policy)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPolicies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No policies found matching your search criteria.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
