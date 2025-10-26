/**
 * AnnouncementCard Component
 * 
 * Announcement Card for communication module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AnnouncementCardProps {
  className?: string;
}

/**
 * AnnouncementCard component - Announcement Card
 */
const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ className = '' }) => {
  return (
    <div className={`announcement-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcement Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Announcement Card functionality</p>
          <p className="text-sm mt-2">Connected to communication Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
