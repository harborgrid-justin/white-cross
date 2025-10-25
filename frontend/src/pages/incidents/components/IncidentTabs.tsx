/**
 * IncidentTabs Component
 *
 * Production-grade tabbed interface for navigating different sections of an incident report.
 * Provides seamless navigation between incident details, witnesses, follow-ups, timeline,
 * documents, and comments.
 *
 * Features:
 * - Tabs: Details, Witnesses, Follow-ups, Timeline, Documents, Comments
 * - Tab badges showing counts (e.g., "Witnesses (3)")
 * - Active tab highlighting
 * - Keyboard navigation (arrow keys, Home, End)
 * - URL hash support for deep linking
 * - Responsive design
 * - Accessibility compliant (ARIA attributes)
 * - Loading states per tab
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { useAppSelector } from '@/hooks/shared/store-hooks-index';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/navigation/Tabs';
import { Badge } from '@/components/ui/display/Badge';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import WitnessStatementsList from './WitnessStatementsList';
import FollowUpActionsList from './FollowUpActionsList';
import IncidentTimeline from './IncidentTimeline';
import IncidentDocuments from './IncidentDocuments';
import CommentsList from './CommentsList';
import IncidentReportDetails from './IncidentReportDetails';
import {
  FileText,
  Users,
  CheckSquare,
  Clock,
  File,
  MessageSquare
} from 'lucide-react';

interface IncidentTabsProps {
  /** Incident report ID */
  incidentId: string;
  /** Default active tab */
  defaultTab?: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Tab configuration with metadata
 */
interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  badgeCount?: number;
  description: string;
}

/**
 * IncidentTabs component - Comprehensive incident navigation
 */
const IncidentTabs: React.FC<IncidentTabsProps> = ({
  incidentId,
  defaultTab = 'details',
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedReport = useAppSelector(state => state.incidentReports.selectedReport);

  // Get active tab from URL hash or use default
  const getActiveTabFromHash = (): string => {
    const hash = location.hash.replace('#', '');
    const validTabs = ['details', 'witnesses', 'follow-ups', 'timeline', 'documents', 'comments'];
    return validTabs.includes(hash) ? hash : defaultTab;
  };

  const [activeTab, setActiveTab] = useState<string>(getActiveTabFromHash());

  // Sync with URL hash
  useEffect(() => {
    const newTab = getActiveTabFromHash();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.hash]);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`${location.pathname}#${value}`, { replace: true });
  };

  // Fetch witness statements count
  const { data: witnessData } = useQuery({
    queryKey: ['incident-witnesses', incidentId],
    queryFn: () => incidentsApi.getWitnessStatements(incidentId),
    staleTime: 30000,
  });

  // Fetch follow-up actions count
  const { data: followUpData } = useQuery({
    queryKey: ['incident-follow-ups', incidentId],
    queryFn: () => incidentsApi.getFollowUpActions(incidentId),
    staleTime: 30000,
  });

  // Fetch comments count
  const { data: commentsData } = useQuery({
    queryKey: ['incident-comments', incidentId, 1, 1],
    queryFn: () => incidentsApi.getComments(incidentId, 1, 1),
    staleTime: 30000,
  });

  // Fetch documents count (from incident report)
  const documentsCount = useMemo(() => {
    if (!selectedReport) return 0;
    const attachmentsCount = selectedReport.attachments?.length || 0;
    const photosCount = selectedReport.evidencePhotos?.length || 0;
    const videosCount = selectedReport.evidenceVideos?.length || 0;
    return attachmentsCount + photosCount + videosCount;
  }, [selectedReport]);

  // Tab configurations with counts
  const tabs: TabConfig[] = useMemo(() => [
    {
      id: 'details',
      label: 'Details',
      icon: <FileText className="h-4 w-4" />,
      description: 'Incident report details and information'
    },
    {
      id: 'witnesses',
      label: 'Witnesses',
      icon: <Users className="h-4 w-4" />,
      badgeCount: witnessData?.statements?.length || 0,
      description: 'Witness statements and testimonies'
    },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      icon: <CheckSquare className="h-4 w-4" />,
      badgeCount: followUpData?.actions?.length || 0,
      description: 'Follow-up actions and tasks'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <Clock className="h-4 w-4" />,
      description: 'Incident timeline and activity log'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <File className="h-4 w-4" />,
      badgeCount: documentsCount,
      description: 'Evidence photos, videos, and attachments'
    },
    {
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare className="h-4 w-4" />,
      badgeCount: commentsData?.pagination?.total || 0,
      description: 'Discussion and collaboration comments'
    }
  ], [witnessData, followUpData, commentsData, documentsCount]);

  return (
    <div className={`incident-tabs ${className}`}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* Tab List */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="bg-transparent p-0 h-auto space-x-0 w-full justify-start">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 data-[state=active]:shadow-none"
                  title={tab.description}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                    {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                      <Badge
                        variant={activeTab === tab.id ? 'primary' : 'default'}
                        size="sm"
                      >
                        {tab.badgeCount}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Details Tab */}
            <TabsContent value="details" className="mt-0">
              <IncidentReportDetails incidentId={incidentId} />
            </TabsContent>

            {/* Witnesses Tab */}
            <TabsContent value="witnesses" className="mt-0">
              <WitnessStatementsList incidentId={incidentId} />
            </TabsContent>

            {/* Follow-ups Tab */}
            <TabsContent value="follow-ups" className="mt-0">
              <FollowUpActionsList incidentId={incidentId} />
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-0">
              <IncidentTimeline incidentId={incidentId} />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <IncidentDocuments incidentId={incidentId} />
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="mt-0">
              <CommentsList incidentId={incidentId} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

IncidentTabs.displayName = 'IncidentTabs';

export default IncidentTabs;
