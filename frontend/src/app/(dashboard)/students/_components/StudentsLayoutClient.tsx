/**
 * @fileoverview Students Layout Client Component - Modern responsive layout with shadcn/ui patterns
 * @module app/(dashboard)/students/_components/StudentsLayoutClient
 * @category Students - Components
 */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface StudentsLayoutClientProps {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}

export function StudentsLayoutClient({
  children,
  sidebar,
  modal
}: StudentsLayoutClientProps) {
  const pathname = usePathname();
  
  // Determine page type based on pathname - industry standard routing patterns
  const isDetailPage = pathname.includes('/students/') && 
    pathname.split('/').length > 3 && 
    !pathname.includes('new') && 
    !pathname.includes('search') && 
    !pathname.includes('reports');
  
  const isListPage = pathname === '/students' || 
    pathname.startsWith('/students?') ||
    pathname.includes('/students/search') ||
    pathname.includes('/students/reports');

  // Industry best practices for layout proportions:
  // - List/Index pages: 75/25 split with contextual sidebar (Google Admin, GitHub, Linear)
  // - Detail pages: Full width for comprehensive content (Notion, Figma, Slack)
  // - Mobile: Always stack vertically for optimal touch experience

  if (isDetailPage) {
    // Detail pages: Full-width layout for comprehensive information display
    return (
      <div className="container mx-auto max-w-none p-0">
        <div className="min-h-screen">
          {children}
        </div>
        {modal}
      </div>
    );
  }

  // List pages: Responsive layout with contextual sidebar
  return (
    <div className="container mx-auto max-w-none p-0">
      <div className="flex h-screen overflow-hidden">
        {/* Main content area - primary focus */}
        <main 
          className={cn(
            "flex-1 overflow-auto",
            "order-2 lg:order-1",
            "min-w-0", // Prevent flex item from growing beyond container
          )}
        >
          <div className="h-full p-4 lg:p-6">
            {children}
          </div>
        </main>
        
        {/* Responsive separator */}
        <Separator 
          orientation="vertical" 
          className="hidden lg:block h-full" 
        />
        
        {/* Contextual sidebar - industry standard 320px width */}
        <aside 
          className={cn(
            "order-1 lg:order-2",
            "w-full lg:w-80 lg:flex-shrink-0",
            "lg:border-l lg:bg-muted/20",
            "overflow-y-auto"
          )}
        >
          <div className="sticky top-0 p-4 lg:p-6">
            {sidebar}
          </div>
        </aside>
      </div>
      
      {modal}
    </div>
  );
}


