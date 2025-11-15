/**
 * PropertyGroup - Collapsible property group component
 *
 * Groups related properties together with collapsible accordion UI.
 * Features:
 * - Radix UI Accordion
 * - Property count badge
 * - Expand/collapse state
 * - Accessibility support
 */

'use client';

import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface PropertyGroupProps {
  title: string;
  propertyCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * PropertyGroup Component
 */
export function PropertyGroup({
  title,
  propertyCount,
  defaultOpen = true,
  children,
}: PropertyGroupProps) {
  return (
    <Accordion.Root type="single" defaultValue={defaultOpen ? title : undefined} collapsible>
      <Accordion.Item value={title} className="border rounded-lg overflow-hidden">
        <Accordion.Header>
          <Accordion.Trigger className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left bg-muted/50 hover:bg-muted transition-colors group">
            <div className="flex items-center gap-2">
              <span>{title}</span>
              {propertyCount !== undefined && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {propertyCount}
                </span>
              )}
            </div>
            <ChevronDown
              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="p-4 bg-background">{children}</div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
