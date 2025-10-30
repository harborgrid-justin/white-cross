/**
 * @fileoverview Home Page Features Grid Component
 * 
 * Features grid component showcasing the three main platform capabilities:
 * Health Records Management, Medication Management, and Emergency Communications.
 * 
 * @module components/pages/HomePage/FeaturesGrid
 * @since 1.0.0
 */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

/**
 * Individual Feature Card Component
 */
function FeatureCard({ icon, title, description, iconBgColor, iconColor }: FeatureCardProps) {
  return (
    <div className="healthcare-card text-center">
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

/**
 * Features Grid Component
 * 
 * Renders a grid of platform features with icons and descriptions.
 */
export function FeaturesGrid() {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="Health Records Management"
        description="Secure, comprehensive health record management with real-time access and HIPAA-compliant data handling."
        iconBgColor="bg-primary-100"
        iconColor="text-primary-600"
      />

      <FeatureCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        }
        title="Medication Management"
        description="Track medications, manage prescriptions, and monitor student medication schedules with automated reminders."
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />

      <FeatureCard
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
        title="Emergency Communications"
        description="Instant emergency notifications, parent communications, and crisis management tools for school health emergencies."
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
}
