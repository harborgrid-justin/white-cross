/**
 * UserManagementHeader Component - Header for user management page
 *
 * Simple header component that can be extended with additional functionality
 * like breadcrumbs, global actions, etc.
 *
 * @component UserManagementHeader
 */

interface UserManagementHeaderProps {
  title?: string;
  description?: string;
}

export function UserManagementHeader({ 
  title = "User Management",
  description = "Comprehensive user administration and role management"
}: UserManagementHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </header>
  );
}
