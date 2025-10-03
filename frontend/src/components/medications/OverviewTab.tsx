import { Pill, Package, AlertTriangle, Bell, Clock } from 'lucide-react'
import { StatsCard } from '../shared'
import type { MedicationTab } from '../../types/medications'

interface OverviewTabProps {
  onTabChange: (tab: MedicationTab) => void
  className?: string
  testId?: string
}

interface FeatureCardProps {
  title: string
  icon: React.ReactNode
  iconColor: string
  features: string[]
  testId?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  icon, 
  iconColor, 
  features, 
  testId 
}) => (
  <div data-testid={testId} className="card p-6 hover:shadow-lg" role="article">
    <div className={`${iconColor} mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ul className="text-sm text-gray-600 space-y-1">
      {features.map((feature, index) => (
        <li key={index}>• {feature}</li>
      ))}
    </ul>
  </div>
)

interface QuickActionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  testId?: string
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  testId 
}) => (
  <button 
    data-testid={testId}
    onClick={onClick}
    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left w-full"
  >
    <div className="text-blue-600 mb-2">
      {icon}
    </div>
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
)

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onTabChange,
  className = '',
  testId
}) => {
  const featureCards = [
    {
      title: 'Prescription Management',
      icon: <Pill className="h-8 w-8" />,
      iconColor: 'text-blue-600',
      features: [
        'Digital prescription tracking',
        'Dosage scheduling',
        'Administration logging',
        'Compliance monitoring'
      ],
      testId: 'prescription-card'
    },
    {
      title: 'Inventory Tracking',
      icon: <Package className="h-8 w-8" />,
      iconColor: 'text-green-600',
      features: [
        'Stock level monitoring',
        'Expiration date alerts',
        'Automated reorder points',
        'Supplier management'
      ],
      testId: 'inventory-card'
    },
    {
      title: 'Safety & Compliance',
      icon: <AlertTriangle className="h-8 w-8" />,
      iconColor: 'text-red-600',
      features: [
        'Controlled substance tracking',
        'Side effect monitoring',
        'Drug interaction alerts',
        'Regulatory compliance'
      ],
      testId: 'safety-card'
    },
    {
      title: 'Automated Reminders',
      icon: <Bell className="h-8 w-8" />,
      iconColor: 'text-purple-600',
      features: [
        'Time-stamped records',
        'Nurse verification',
        'Student response tracking',
        'Dosage reminders'
      ],
      testId: 'reminders-card'
    }
  ]

  const quickActions = [
    {
      title: 'View Medications',
      description: 'Browse medication database',
      icon: <Pill className="h-6 w-6" />,
      onClick: () => onTabChange('medications'),
      testId: 'view-medications-action'
    },
    {
      title: "Today's Reminders",
      description: 'View scheduled medications',
      icon: <Clock className="h-6 w-6" />,
      onClick: () => onTabChange('reminders'),
      testId: 'todays-reminders-action'
    },
    {
      title: 'Check Inventory',
      description: 'Monitor stock levels',
      icon: <Package className="h-6 w-6" />,
      onClick: () => onTabChange('inventory'),
      testId: 'check-inventory-action'
    }
  ]

  return (
    <div data-testid={testId} className={`space-y-6 ${className}`}>
      {/* Feature Cards */}
      <div data-testid="overview-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureCards.map((card) => (
          <FeatureCard
            key={card.title}
            title={card.title}
            icon={card.icon}
            iconColor={card.iconColor}
            features={card.features}
            testId={card.testId}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div data-testid="quick-actions" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <QuickAction
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={action.onClick}
              testId={action.testId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}