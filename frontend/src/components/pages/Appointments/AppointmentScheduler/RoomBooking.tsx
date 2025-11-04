'use client';

import React from 'react';
import { MapPin, Video } from 'lucide-react';
import type { Room } from './types';

/**
 * Props for the RoomBooking component
 */
interface RoomBookingProps {
  /** Available rooms */
  rooms: Room[];
  /** Currently selected room ID */
  selectedRoomId: string;
  /** Whether virtual mode is enabled */
  isVirtual: boolean;
  /** Whether virtual appointments are allowed */
  allowVirtual: boolean;
  /** Handler for room selection */
  onRoomSelect: (roomId: string) => void;
  /** Handler for mode change (virtual/in-person) */
  onModeChange: (isVirtual: boolean) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * RoomBooking Component
 *
 * Provides interface for selecting appointment mode (virtual/in-person)
 * and room selection for in-person appointments.
 *
 * @param props - RoomBooking component props
 * @returns JSX element representing the room booking interface
 */
const RoomBooking: React.FC<RoomBookingProps> = ({
  rooms,
  selectedRoomId,
  isVirtual,
  allowVirtual,
  onRoomSelect,
  onModeChange,
  className = ''
}) => {
  const inPersonRooms = rooms.filter(room => !room.isVirtual);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Virtual/In-Person Toggle */}
      {allowVirtual && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Appointment Type
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="appointmentMode"
                checked={!isVirtual}
                onChange={() => onModeChange(false)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <MapPin size={16} className="mr-1" aria-hidden="true" />
                In-Person
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="appointmentMode"
                checked={isVirtual}
                onChange={() => onModeChange(true)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <Video size={16} className="mr-1" aria-hidden="true" />
                Virtual
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Room Selection (for in-person appointments) */}
      {!isVirtual && (
        <div>
          <label htmlFor="room-select" className="text-sm font-medium text-gray-700 mb-2 block">
            Room
          </label>
          <select
            id="room-select"
            value={selectedRoomId}
            onChange={(e) => onRoomSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
            required={!isVirtual}
            aria-required={!isVirtual}
          >
            <option value="">Select a room...</option>
            {inPersonRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.building} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default RoomBooking;
