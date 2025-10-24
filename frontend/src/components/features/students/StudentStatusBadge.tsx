import React from 'react';
import { Badge } from '@/components/ui/display/Badge';

/**
 * Student status type
 */
export type StudentStatus = 'active' | 'inactive' | 'transferred' | 'graduated';

/**
 * StudentStatusBadge props
 */
export interface StudentStatusBadgeProps {
  /** Student status */
  status: StudentStatus;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

const statusConfig: Record<StudentStatus, {
  label: string;
  variant: 'success' | 'default' | 'warning' | 'secondary';
}> = {
  active: {
    label: 'Active',
    variant: 'success'
  },
  inactive: {
    label: 'Inactive',
    variant: 'default'
  },
  transferred: {
    label: 'Transferred',
    variant: 'warning'
  },
  graduated: {
    label: 'Graduated',
    variant: 'secondary'
  }
};

/**
 * StudentStatusBadge - Display student status with appropriate styling
 *
 * @example
 * ```tsx
 * <StudentStatusBadge status="active" size="sm" />
 * ```
 */
export const StudentStatusBadge: React.FC<StudentStatusBadgeProps> = ({
  status,
  size = 'md',
  className
}) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
    >
      {config.label}
    </Badge>
  );
};

StudentStatusBadge.displayName = 'StudentStatusBadge';

export default React.memo(StudentStatusBadge);
