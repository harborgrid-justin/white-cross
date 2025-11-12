import { CommunicationMetrics, TimeSeriesData } from './types';

/**
 * Mock metrics data for development/testing
 * In production, this should be replaced with actual API calls
 */
export const mockMetrics: CommunicationMetrics = {
  total_sent: {
    label: 'Total Sent',
    value: 1247,
    trend: 'up',
    change: 12.5
  },
  delivery_rate: {
    label: 'Delivery Rate',
    value: 96.8,
    percentage: 96.8,
    trend: 'up',
    change: 2.1
  },
  response_rate: {
    label: 'Response Rate',
    value: 73.4,
    percentage: 73.4,
    trend: 'down',
    change: -1.8
  },
  avg_response_time: {
    label: 'Avg Response Time',
    value: 2.4,
    trend: 'stable',
    change: 0.1
  },
  channels: {
    email: {
      label: 'Email',
      value: 487,
      percentage: 39.1,
      trend: 'up',
      change: 8.2
    },
    sms: {
      label: 'SMS',
      value: 312,
      percentage: 25.0,
      trend: 'down',
      change: -3.1
    },
    push: {
      label: 'Push',
      value: 298,
      percentage: 23.9,
      trend: 'up',
      change: 15.7
    },
    in_app: {
      label: 'In-App',
      value: 150,
      percentage: 12.0,
      trend: 'up',
      change: 22.4
    }
  },
  categories: {
    emergency: {
      label: 'Emergency',
      value: 23,
      percentage: 1.8,
      trend: 'down',
      change: -12.5
    },
    appointment: {
      label: 'Appointment',
      value: 324,
      percentage: 26.0,
      trend: 'up',
      change: 5.2
    },
    medication: {
      label: 'Medication',
      value: 445,
      percentage: 35.7,
      trend: 'up',
      change: 18.9
    },
    general: {
      label: 'General',
      value: 378,
      percentage: 30.3,
      trend: 'stable',
      change: 1.1
    },
    system: {
      label: 'System',
      value: 77,
      percentage: 6.2,
      trend: 'up',
      change: 9.8
    }
  },
  status: {
    delivered: {
      label: 'Delivered',
      value: 1207,
      percentage: 96.8,
      trend: 'up',
      change: 2.1
    },
    pending: {
      label: 'Pending',
      value: 15,
      percentage: 1.2,
      trend: 'down',
      change: -45.2
    },
    failed: {
      label: 'Failed',
      value: 25,
      percentage: 2.0,
      trend: 'down',
      change: -18.7
    },
    read: {
      label: 'Read',
      value: 886,
      percentage: 71.0,
      trend: 'up',
      change: 4.3
    }
  }
};

/**
 * Mock time series data for development/testing
 * In production, this should be replaced with actual API calls
 */
export const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2024-03-01', sent: 42, delivered: 41, failed: 1, read: 30, responded: 22 },
  { date: '2024-03-02', sent: 38, delivered: 37, failed: 1, read: 28, responded: 19 },
  { date: '2024-03-03', sent: 45, delivered: 44, failed: 1, read: 33, responded: 24 },
  { date: '2024-03-04', sent: 52, delivered: 50, failed: 2, read: 38, responded: 27 },
  { date: '2024-03-05', sent: 48, delivered: 47, failed: 1, read: 35, responded: 25 },
  { date: '2024-03-06', sent: 41, delivered: 40, failed: 1, read: 29, responded: 21 },
  { date: '2024-03-07', sent: 39, delivered: 38, failed: 1, read: 28, responded: 20 },
  { date: '2024-03-08', sent: 43, delivered: 42, failed: 1, read: 31, responded: 23 },
  { date: '2024-03-09', sent: 46, delivered: 45, failed: 1, read: 34, responded: 26 },
  { date: '2024-03-10', sent: 44, delivered: 43, failed: 1, read: 32, responded: 24 }
];
