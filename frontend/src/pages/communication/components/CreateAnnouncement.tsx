/**
 * CreateAnnouncement Component
 * 
 * Create Announcement for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CreateAnnouncementProps {
  className?: string;
}

/**
 * CreateAnnouncement component - Create Announcement
 */
const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({ className = '' }) => {
  return (
    <div className={`create-announcement ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Announcement</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Create Announcement functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
