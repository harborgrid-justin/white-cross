import { Metadata } from 'next';
import { Shield } from 'lucide-react';
import { PolicyLibrary } from '@/components/compliance';
import type { Policy, PolicyStatistics } from '@/schemas/compliance/policy.schemas';

export const metadata: Metadata = {
  title: 'Policies | Compliance | White Cross',
};

const getMockPolicies = (): Policy[] => [
  {
    id: '1',
    title: 'HIPAA Privacy Policy',
    policyType: 'HIPAA_PRIVACY',
    version: '2.1.0',
    description: 'Comprehensive privacy policy governing the use and disclosure of protected health information',
    content: 'Full policy content...',
    effectiveDate: '2024-01-01T00:00:00Z',
    reviewDate: '2024-12-01T00:00:00Z',
    status: 'ACTIVE',
    owner: { userId: '1', name: 'Compliance Officer', role: 'Administrator' },
    approvers: [],
    applicableRoles: ['All'],
    mandatory: true,
    requiresAcknowledgment: true,
    requiresSignature: true,
    createdBy: '1',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'HIPAA Security Policy',
    policyType: 'HIPAA_SECURITY',
    version: '2.0.0',
    description: 'Security safeguards and administrative, physical, and technical controls',
    content: 'Full policy content...',
    effectiveDate: '2024-01-01T00:00:00Z',
    reviewDate: '2024-12-01T00:00:00Z',
    status: 'ACTIVE',
    owner: { userId: '1', name: 'Security Officer', role: 'Administrator' },
    approvers: [],
    applicableRoles: ['All'],
    mandatory: true,
    requiresAcknowledgment: true,
    requiresSignature: false,
    createdBy: '1',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const getMockStatistics = (): Record<string, PolicyStatistics> => ({
  '1': {
    policyId: '1',
    policyTitle: 'HIPAA Privacy Policy',
    totalAssignments: 100,
    acknowledged: 95,
    pending: 3,
    overdue: 2,
    exempted: 0,
    acknowledgmentRate: 95,
    averageAcknowledgmentTime: 24,
  },
  '2': {
    policyId: '2',
    policyTitle: 'HIPAA Security Policy',
    totalAssignments: 100,
    acknowledged: 90,
    pending: 10,
    overdue: 0,
    exempted: 0,
    acknowledgmentRate: 90,
    averageAcknowledgmentTime: 48,
  },
});

export default function PoliciesPage() {
  const policies = getMockPolicies();
  const statistics = getMockStatistics();

  return (
    <div className="container mx-auto p-6">
      <PolicyLibrary
        policies={policies}
        statistics={statistics}
        onViewPolicy={(policy) => console.log('View:', policy)}
        onEditPolicy={(policy) => console.log('Edit:', policy)}
      />
    </div>
  );
}
