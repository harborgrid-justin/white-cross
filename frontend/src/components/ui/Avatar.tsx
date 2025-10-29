/**
 * Avatar Components - Re-export
 *
 * This is a convenience re-export for the Avatar components.
 * The actual implementation is in ./display/Avatar.tsx
 */

export { Avatar, AvatarGroup, type AvatarProps } from './display/Avatar'

// Avatar subcomponents for compatibility
export const AvatarImage = ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />
export const AvatarFallback = ({ children, ...props }: any) => <div {...props}>{children}</div>
