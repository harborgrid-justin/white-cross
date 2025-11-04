/**
 * Media Components
 *
 * Optimized components for images, videos, and other media.
 * Provides both Next.js Image wrapper and custom OptimizedImage.
 *
 * @module components/ui/media
 */

// Next.js Image wrapper (recommended)
export { Image, Avatar, Logo, Banner } from './Image';
export type { ImageProps, AvatarProps, LogoProps, BannerProps } from './Image';

// Custom Intersection Observer based image (legacy)
export {
  OptimizedImage,
  AvatarImage,
  BackgroundImage,
} from './OptimizedImage';
export type { OptimizedImageProps } from './OptimizedImage';
