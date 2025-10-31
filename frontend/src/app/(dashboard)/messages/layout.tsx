import React from 'react';
import MessagesSidebar from './_components/MessagesSidebar';

// Loading skeleton components
const MessagesSidebarSkeleton = () => (
  <div className="w-80 bg-white border-r border-gray-200 animate-pulse">
    <div className="p-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="p-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-2 mb-1">
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const MessagesContentSkeleton = () => (
  <div className="flex-1 p-6 animate-pulse">
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface MessagesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}

/**
 * Messages Layout with Parallel Routes
 * 
 * This layout provides a comprehensive healthcare messaging interface with:
 * - Parallel sidebar for navigation and metrics (@sidebar)
 * - Parallel modal for message composition and details (@modal)  
 * - Main content area for message list and management
 * - Responsive design with proper loading states
 * - HIPAA-compliant messaging structure
 */
export default function MessagesLayout({
  children,
  sidebar,
  modal
}: MessagesLayoutProps): React.JSX.Element {
  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar - Messages Navigation and Metrics */}
      <div className="w-80 flex-shrink-0">
        <React.Suspense fallback={<MessagesSidebarSkeleton />}>
          {sidebar || <MessagesSidebar />}
        </React.Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <React.Suspense fallback={<MessagesContentSkeleton />}>
          {children}
        </React.Suspense>
      </div>

      {/* Modal Overlay - Message Composition, Details, etc. */}
      <React.Suspense fallback={null}>
        {modal}
      </React.Suspense>
    </div>
  );
}

/**
 * Metadata for Messages Directory
 */
export const metadata = {
  title: 'Messages - White Cross Healthcare',
  description: 'Secure healthcare communication platform for managing emergency alerts, medical messages, parent communications, and staff notifications with HIPAA compliance.',
  keywords: 'healthcare messages, emergency alerts, medical communication, parent notifications, HIPAA compliant messaging'
};