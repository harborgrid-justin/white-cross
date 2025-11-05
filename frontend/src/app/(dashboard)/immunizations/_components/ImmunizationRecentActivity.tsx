/**
 * @fileoverview Immunization Recent Activity Component - Backend Integrated
 * @module app/(dashboard)/immunizations/_components/ImmunizationRecentActivity
 * @category Healthcare - Immunizations
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Syringe,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { getRecentImmunizationActivity, type ImmunizationActivity } from '@/lib/actions/immunizations.actions';

export default function ImmunizationRecentActivity() {
  const router = useRouter();
  const [activities, setActivities] = useState<ImmunizationActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        console.log('[ImmunizationRecentActivity] Loading recent activity...');
        const data = await getRecentImmunizationActivity(6);
        setActivities(data);
        console.log('[ImmunizationRecentActivity] Activity loaded:', data);
      } catch (error) {
        console.error('Failed to load recent activity:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecentActivity();
  }, []);

  const getActivityIcon = (type: ImmunizationActivity['type']) => {
    switch (type) {
      case 'administered':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'scheduled':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <Syringe className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: ImmunizationActivity['type']) => {
    const variants = {
      administered: 'bg-green-100 text-green-800 border-green-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      declined: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <Badge
        variant="outline"
        className={`${variants[type]} text-xs font-medium`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Recent Activity
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Latest immunization updates
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/immunizations/activity')}
        >
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Syringe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">
              Immunization activity will appear here
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => router.push(`/immunizations/${activity.id}`)}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white"
            >
              <div className="p-2 rounded-full bg-gray-50">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {activity.studentName}
                  </h3>
                  {getActivityBadge(activity.type)}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {activity.vaccineName}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                  {activity.administeredBy && (
                    <>
                      <span>•</span>
                      <span>{activity.administeredBy}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}