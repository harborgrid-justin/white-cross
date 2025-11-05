/**
 * Optimized Image Component - Next.js Image Wrapper
 *
 * PERFORMANCE FIX: Proper image optimization using next/image
 *
 * @module components/ui/OptimizedImage
 * @since 2025-11-05
 */

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  className,
  sizes,
  objectFit = 'cover',
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes || '100vw'}
      className={cn(className)}
      style={fill ? { objectFit } : undefined}
    />
  );
}

export function StudentPhoto({
  src,
  alt,
  size = 'md',
  priority = false,
}: {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
}) {
  const sizeMap = {
    sm: { width: 40, height: 40 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
  };

  const dimensions = sizeMap[size];

  return (
    <div className="relative overflow-hidden rounded-full">
      <OptimizedImage
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className="rounded-full object-cover"
      />
    </div>
  );
}
