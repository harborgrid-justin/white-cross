'use client';

/**
 * WF-UI-302 | Image.tsx - Next.js Image Component Wrapper
 *
 * This component provides an enhanced wrapper around Next.js Image component
 * with healthcare-specific optimizations, accessibility features, and error handling.
 * It ensures optimal performance while maintaining HIPAA compliance.
 *
 * @module components/ui/media/Image
 *
 * **Performance Benefits:**
 * - Automatic image optimization (WebP, AVIF)
 * - Lazy loading with blur placeholders
 * - Responsive image sizing
 * - CDN delivery
 * - Prevents Cumulative Layout Shift (CLS)
 *
 * **Core Web Vitals Impact:**
 * - LCP: Optimized through next/image automatic optimization
 * - CLS: Prevented through automatic aspect ratio calculation
 * - FID: Improved by reducing main thread work
 *
 * Last Updated: 2025-11-04 | File Type: .tsx
 */

import React, { useState, CSSProperties } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { clsx } from 'clsx';

/**
 * Extended props for enhanced Image component
 */
export interface ImageProps extends Omit<NextImageProps, 'onError' | 'onLoad'> {
  /**
   * Fallback image URL if main image fails to load
   */
  fallbackSrc?: string;

  /**
   * Show loading skeleton
   */
  showSkeleton?: boolean;

  /**
   * Container className for wrapper div
   */
  containerClassName?: string;

  /**
   * Aspect ratio (e.g., "16/9", "4/3", "1/1")
   */
  aspectRatio?: string;

  /**
   * Object fit CSS property
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Rounded corners
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * Callback when image loads successfully
   */
  onLoadComplete?: () => void;

  /**
   * Callback when image fails to load
   */
  onErrorOccurred?: (error: Error) => void;

  /**
   * Enable zoom on hover
   */
  zoomOnHover?: boolean;

  /**
   * Add border
   */
  bordered?: boolean;
}

/**
 * Generate blur data URL placeholder
 */
function generateBlurDataURL(width: number = 8, height: number = 8): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#f3f4f6"/></svg>`;
  // Use btoa for base64 encoding (browser-compatible)
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Image Component - Enhanced Next.js Image wrapper
 *
 * Provides automatic optimization, lazy loading, and error handling
 * for all images in the healthcare platform.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Image
 *   src="/images/student-photo.jpg"
 *   alt="Student photo"
 *   width={200}
 *   height={200}
 * />
 *
 * // With priority (above-fold hero image)
 * <Image
 *   src="/images/hero.jpg"
 *   alt="Hero banner"
 *   width={1920}
 *   height={1080}
 *   priority
 *   objectFit="cover"
 * />
 *
 * // With fallback and aspect ratio
 * <Image
 *   src={user.photoUrl}
 *   alt={user.name}
 *   width={100}
 *   height={100}
 *   fallbackSrc="/images/default-avatar.png"
 *   aspectRatio="1/1"
 *   rounded="full"
 * />
 * ```
 */
export function Image({
  src,
  alt,
  width,
  height,
  fallbackSrc = '/images/placeholder.png',
  showSkeleton = true,
  containerClassName,
  aspectRatio,
  objectFit = 'cover',
  rounded = 'none',
  onLoadComplete,
  onErrorOccurred,
  zoomOnHover = false,
  bordered = false,
  className,
  placeholder = 'blur',
  blurDataURL,
  ...props
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string | NextImageProps['src']>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Rounded classes
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  // Handle image error
  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
      onErrorOccurred?.(new Error(`Failed to load image: ${src}`));
    } else {
      setIsLoading(false);
    }
  };

  // Container styles
  const containerStyle: CSSProperties = {
    ...(aspectRatio && { aspectRatio }),
  };

  // Generate blur placeholder if not provided
  const finalBlurDataURL = blurDataURL ||
    (placeholder === 'blur' && typeof width === 'number' && typeof height === 'number'
      ? generateBlurDataURL(width as number, height as number)
      : undefined);

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        roundedClasses[rounded],
        bordered && 'border border-gray-200 dark:border-gray-700',
        containerClassName
      )}
      style={containerStyle}
    >
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}

      {/* Next.js Image */}
      <NextImage
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={finalBlurDataURL ? 'blur' : placeholder}
        blurDataURL={finalBlurDataURL}
        className={clsx(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          zoomOnHover && 'hover:scale-105 transition-transform duration-300',
          roundedClasses[rounded],
          className
        )}
        style={{
          objectFit,
        }}
        {...props}
      />

      {/* Error indicator */}
      {hasError && (
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Fallback
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Avatar Component - Specialized image for user avatars
 */
export interface AvatarProps extends Omit<ImageProps, 'aspectRatio' | 'objectFit'> {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
}

export function Avatar({
  size = 'md',
  name,
  alt,
  fallbackSrc = '/images/default-avatar.png',
  ...props
}: AvatarProps) {
  // Size mappings
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size];

  // Generate initials from name if provided
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <Image
      {...props}
      alt={alt || name || 'Avatar'}
      width={pixelSize}
      height={pixelSize}
      aspectRatio="1/1"
      objectFit="cover"
      rounded="full"
      fallbackSrc={fallbackSrc}
      bordered
    />
  );
}

/**
 * Logo Component - Specialized image for logos
 */
export interface LogoProps extends Omit<ImageProps, 'objectFit'> {
  variant?: 'light' | 'dark';
}

export function Logo({ variant = 'light', ...props }: LogoProps) {
  return (
    <Image
      {...props}
      objectFit="contain"
      priority
      placeholder="empty"
    />
  );
}

/**
 * Banner Component - Specialized image for banners/heroes
 */
export interface BannerProps extends ImageProps {
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export function Banner({
  overlay = false,
  overlayOpacity = 0.4,
  children,
  containerClassName,
  ...props
}: BannerProps) {
  return (
    <div className={clsx('relative', containerClassName)}>
      <Image
        {...props}
        containerClassName="absolute inset-0"
        objectFit="cover"
        priority
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

export default Image;
