import React from 'react';
import FormsContent from './_components/FormsContent';
import FormsSidebar from './_components/FormsSidebar';

export const metadata = {
  title: 'Healthcare Forms | White Cross',
  description: 'Comprehensive form builder and management system for healthcare data collection including student enrollment, health screenings, incident reports, and medical consents.',
};

interface FormsLayoutProps {
  children: React.ReactNode;
  modal?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function FormsLayout({ 
  children, 
  modal, 
  sidebar 
}: FormsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Primary Forms Content */}
        <div className="flex-1 p-6">
          <FormsContent />
        </div>
        
        {/* Page-specific content */}
        <div className="flex-1">
          {children}
        </div>
      </div>

      {/* Forms Sidebar */}
      <div className="flex-shrink-0">
        {sidebar || <FormsSidebar />}
      </div>

      {/* Modal Content */}
      {modal}
    </div>
  );
}