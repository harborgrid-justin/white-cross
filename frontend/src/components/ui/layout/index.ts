/**
 * Layout Components Module
 *
 * Comprehensive layout components for organizing and structuring content
 * in the White Cross healthcare platform. Provides container components
 * with consistent styling and composition patterns.
 *
 * **Components:**
 * - Card: Main container component with variants and customization
 * - CardHeader: Header section with optional divider
 * - CardContent: Main content area
 * - CardFooter: Footer section with optional divider
 * - CardTitle: Semantic heading for card title
 * - CardDescription: Subtitle or description text
 *
 * **Features:**
 * - Composable card pattern
 * - Multiple visual variants
 * - Flexible padding and spacing
 * - Dark mode support
 * - Semantic HTML structure
 * - TypeScript type safety
 *
 * @module components/ui/layout
 *
 * @example
 * ```tsx
 * import {
 *   Card,
 *   CardHeader,
 *   CardContent,
 *   CardFooter,
 *   CardTitle,
 *   CardDescription
 * } from '@/components/ui/layout';
 *
 * function ProfileCard() {
 *   return (
 *     <Card variant="elevated">
 *       <CardHeader divider>
 *         <CardTitle>User Profile</CardTitle>
 *         <CardDescription>Manage your account settings</CardDescription>
 *       </CardHeader>
 *       <CardContent>
 *         <ProfileForm />
 *       </CardContent>
 *       <CardFooter>
 *         <Button>Save Changes</Button>
 *       </CardFooter>
 *     </Card>
 *   );
 * }
 * ```
 */

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  type CardProps,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps
} from './Card';

export { Separator, type SeparatorProps } from './Separator';
