/**
 * @fileoverview Communications Filters Component
 * @module app/(dashboard)/communications/_components/CommunicationsFilters
 * @category Communications - Components
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Filter,
  Search,
  X,
  ChevronDown,
  Mail,
  Phone,
  Bell,
  Megaphone,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface CommunicationsFiltersProps {
  onFiltersChange?: (filters: CommunicationFilters) => void;
  initialFilters?: CommunicationFilters;
}

export interface CommunicationFilters {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  recipient?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

const messageTypes = [
  { value: 'EMAIL', label: 'Email', icon: Mail, color: 'text-blue-600' },
  { value: 'SMS', label: 'SMS', icon: Phone, color: 'text-green-600' },
  { value: 'PUSH_NOTIFICATION', label: 'Push Notification', icon: Bell, color: 'text-purple-600' },
  { value: 'BROADCAST', label: 'Broadcast', icon: Megaphone, color: 'text-orange-600' },
  { value: 'EMERGENCY', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'REMINDER', label: 'Reminder', icon: Clock, color: 'text-yellow-600' },
];

const messageStatus = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'READ', label: 'Read' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'SCHEDULED', label: 'Scheduled' },
];

const messagePriority = [
  { value: 'URGENT', label: 'Urgent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

const recipientTypes = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'GUARDIAN', label: 'Guardian' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'EMERGENCY_CONTACT', label: 'Emergency Contact' },
];

const sortOptions = [
  { value: 'sentAt', label: 'Date Sent' },
  { value: 'subject', label: 'Subject' },
  { value: 'priority', label: 'Priority' },
  { value: 'type', label: 'Type' },
  { value: 'status', label: 'Status' },
];

export function CommunicationsFilters({ 
  onFiltersChange, 
  initialFilters = {} 
}: CommunicationsFiltersProps) {
  const [filters, setFilters] = useState<CommunicationFilters>(initialFilters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleFilterChange = (key: keyof CommunicationFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    
    if (value && value.trim() !== '') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: CommunicationFilters = {};
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => 
      filters[key as keyof CommunicationFilters] && 
      filters[key as keyof CommunicationFilters]?.trim() !== ''
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <div className="p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages by subject, content, or sender..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Type:</Label>
            <Select
              value={filters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {messageTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Status:</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {messageStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Priority:</Label>
            <Select
              value={filters.priority || ''}
              onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {messagePriority.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="mb-2">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              {/* Recipient Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Recipient Type</Label>
                <Select
                  value={filters.recipient || ''}
                  onValueChange={(value) => handleFilterChange('recipient', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Recipients</SelectItem>
                    {recipientTypes.map((recipient) => (
                      <SelectItem key={recipient.value} value={recipient.value}>
                        {recipient.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Sort By</Label>
                <Select
                  value={filters.sortBy || 'sentAt'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Sort Order</Label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value.trim() === '') return null;
                
                const displayValue = key === 'type' 
                  ? messageTypes.find(t => t.value === value)?.label || value
                  : key === 'status'
                  ? messageStatus.find(s => s.value === value)?.label || value
                  : key === 'priority'
                  ? messagePriority.find(p => p.value === value)?.label || value
                  : key === 'recipient'
                  ? recipientTypes.find(r => r.value === value)?.label || value
                  : value;

                return (
                  <Badge 
                    key={key} 
                    variant="secondary" 
                    className="text-xs flex items-center gap-1"
                  >
                    <span>{key}: {displayValue}</span>
                    <button
                      onClick={() => handleFilterChange(key as keyof CommunicationFilters, undefined)}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                      aria-label={`Remove ${key} filter`}
                      title={`Remove ${key} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
