'use client';

/**
 * Avatar Component Module
 *
 * User avatar display with image loading, fallback initials, status indicators,
 * and avatar group functionality for showing multiple users.
 *
 * @module components/ui/display/Avatar
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Avatar component.
 *
 * @interface AvatarProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {string} [src] - Image URL for avatar
 * @property {string} [alt] - Alt text for image and fallback initials source
 * @property {string} [fallback] - Custom fallback text (defaults to alt or '??')
 * @property {('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')} [size='md'] - Avatar size
 *   - xs: 24px (1.5rem)
 *   - sm: 32px (2rem)
 *   - md: 40px (2.5rem) - default
 *   - lg: 48px (3rem)
 *   - xl: 64px (4rem)
 *   - 2xl: 80px (5rem)
 * @property {('circle' | 'square')} [shape='circle'] - Avatar shape
 * @property {('online' | 'offline' | 'away' | 'busy')} [status] - User status for indicator
 * @property {boolean} [showStatus=false] - Whether to show status indicator dot
 */
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
}

/**
 * Avatar component for displaying user profile images with fallbacks.
 *
 * Displays user avatars with automatic image loading, fallback to initials,
 * customizable sizes and shapes, and optional online status indicators.
 * Handles image load errors gracefully by falling back to initials.
 *
 * **Features:**
 * - Image loading with error handling
 * - Automatic initials generation from alt/fallback text
 * - 6 size options (xs to 2xl)
 * - Circle or square shapes
 * - Status indicator (online, offline, away, busy)
 * - Responsive and accessible
 * - Forward ref support
 *
 * **Accessibility:**
 * - Alt text for images
 * - Semantic HTML structure
 * - High contrast status indicators
 *
 * @component
 * @param {AvatarProps} props - Avatar component props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered avatar with image or initials
 *
 * @example
 * ```tsx
 * // Avatar with image
 * <Avatar
 *   src="/images/user.jpg"
 *   alt="John Doe"
 *   size="lg"
 *   status="online"
 *   showStatus
 * />
 *
 * // Avatar with fallback initials
 * <Avatar alt="Jane Smith" size="md" shape="circle" />
 *
 * // Square avatar with custom fallback
 * <Avatar
 *   fallback="Admin"
 *   shape="square"
 *   size="xl"
 * />
 * ```
 *
 * @see {@link AvatarGroup} for displaying multiple avatars
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    src,
    alt,
    fallback,
    size = 'md',
    shape = 'circle',
    status,
    showStatus = false,
    ...props
  }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-20 w-20 text-2xl'
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-md'
    };

    const statusColors = {
      online: 'bg-green-400',
      offline: 'bg-gray-400',
      away: 'bg-yellow-400',
      busy: 'bg-red-400'
    };

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
      '2xl': 'h-5 w-5'
    };

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();
    };

    const displayFallback = fallback || alt || '??';
    const initials = displayFallback.length > 2 ? getInitials(displayFallback) : displayFallback;

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden bg-gray-100 font-medium text-gray-600',
            sizeClasses[size],
            shapeClasses[shape]
          )}
        >
          {src && !imageError ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="select-none">{initials}</span>
          )}
        </div>
        
        {showStatus && status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);

/**
 * AvatarGroup component props.
 *
 * @interface AvatarGroupProps
 *
 * @property {React.ReactNode} children - Avatar components to display
 * @property {number} [max] - Maximum number of avatars to show before "+N" indicator
 * @property {AvatarProps['size']} [size='md'] - Size for all avatars and overflow indicator
 * @property {string} [className] - Additional CSS classes
 */
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

/**
 * AvatarGroup component for displaying multiple avatars in an overlapping row.
 *
 * Groups multiple Avatar components with overlapping layout and optional
 * overflow indicator showing "+N" for additional hidden avatars.
 *
 * **Features:**
 * - Overlapping avatar layout
 * - Configurable maximum visible avatars
 * - "+N" overflow indicator for remaining avatars
 * - Consistent sizing across all avatars
 * - Responsive spacing based on size
 *
 * **Layout:**
 * Avatars overlap by approximately 25% for compact visual grouping.
 *
 * @component
 * @param {AvatarGroupProps} props - Avatar group props
 * @returns {JSX.Element} Rendered group of overlapping avatars
 *
 * @example
 * ```tsx
 * // Show up to 4 avatars, rest shown as "+N"
 * <AvatarGroup max={4} size="md">
 *   <Avatar src="/user1.jpg" alt="User 1" />
 *   <Avatar src="/user2.jpg" alt="User 2" />
 *   <Avatar src="/user3.jpg" alt="User 3" />
 *   <Avatar src="/user4.jpg" alt="User 4" />
 *   <Avatar src="/user5.jpg" alt="User 5" />
 *   <Avatar src="/user6.jpg" alt="User 6" />
 * </AvatarGroup>
 * // Renders: [Avatar1][Avatar2][Avatar3][Avatar4][+2]
 *
 * // Show all avatars without limit
 * <AvatarGroup size="sm">
 *   <Avatar alt="John" />
 *   <Avatar alt="Jane" />
 *   <Avatar alt="Bob" />
 * </AvatarGroup>
 * ```
 *
 * @see {@link Avatar} for individual avatar component
 */
const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max, size = 'md', className }) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const remainingCount = max ? Math.max(0, childArray.length - max) : 0;

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };

  const offsetClasses = {
    xs: '-space-x-1',
    sm: '-space-x-1.5',
    md: '-space-x-2',
    lg: '-space-x-2.5',
    xl: '-space-x-3',
    '2xl': '-space-x-4'
  };

  return (
    <div className={cn('flex items-center', offsetClasses[size], className)}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 ring-2 ring-white',
            sizeClasses[size]
          )}
        >
          <span className="select-none">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup, type AvatarProps };
