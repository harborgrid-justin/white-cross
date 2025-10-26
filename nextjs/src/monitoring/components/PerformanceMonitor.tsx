/**
 * Performance Monitor Component
 *
 * Monitors and displays performance metrics
 */

'use client';

import React, { useEffect, useState } from 'react';
import { initPerformanceMonitoring, getWebVitals, type PERFORMANCE_THRESHOLDS } from '../performance';
import type { CoreWebVitalsMetrics, PerformanceMetric } from '../types';

export interface PerformanceMonitorProps {
  showBadge?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onMetric?: (metric: PerformanceMetric) => void;
}

export function PerformanceMonitor({
  showBadge = false,
  position = 'bottom-right',
  onMetric,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<Partial<CoreWebVitalsMetrics>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring((metric) => {
      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        [metric.name]: metric.value,
      }));

      // Call callback
      onMetric?.(metric);
    });

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(getWebVitals());
    }, 1000);

    return () => clearInterval(interval);
  }, [onMetric]);

  if (!showBadge && process.env.NODE_ENV === 'production') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getMetricRating = (name: keyof typeof PERFORMANCE_THRESHOLDS, value?: number) => {
    if (!value) return 'unknown';

    const thresholds = PERFORMANCE_THRESHOLDS[name];
    if (!thresholds) return 'unknown';

    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const ratingColors = {
    good: 'text-green-600',
    'needs-improvement': 'text-yellow-600',
    poor: 'text-red-600',
    unknown: 'text-gray-400',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-900 text-white px-3 py-2 rounded-md shadow-lg text-xs font-mono hover:bg-gray-800 transition-colors"
          title="Performance Metrics"
        >
          ⚡ Perf
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Core Web Vitals
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {/* LCP */}
            <MetricRow
              label="LCP"
              value={metrics.LCP}
              unit="ms"
              rating={getMetricRating('LCP', metrics.LCP)}
              description="Largest Contentful Paint"
            />

            {/* FID */}
            <MetricRow
              label="FID"
              value={metrics.FID}
              unit="ms"
              rating={getMetricRating('FID', metrics.FID)}
              description="First Input Delay"
            />

            {/* CLS */}
            <MetricRow
              label="CLS"
              value={metrics.CLS}
              unit=""
              rating={getMetricRating('CLS', metrics.CLS)}
              description="Cumulative Layout Shift"
            />

            {/* FCP */}
            <MetricRow
              label="FCP"
              value={metrics.FCP}
              unit="ms"
              rating={getMetricRating('FCP', metrics.FCP)}
              description="First Contentful Paint"
            />

            {/* TTFB */}
            <MetricRow
              label="TTFB"
              value={metrics.TTFB}
              unit="ms"
              rating={getMetricRating('TTFB', metrics.TTFB)}
              description="Time to First Byte"
            />

            {/* INP */}
            {metrics.INP !== undefined && (
              <MetricRow
                label="INP"
                value={metrics.INP}
                unit="ms"
                rating={getMetricRating('INP', metrics.INP)}
                description="Interaction to Next Paint"
              />
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">●</span>
              <span>Good</span>
              <span className="text-yellow-600">●</span>
              <span>Needs Improvement</span>
              <span className="text-red-600">●</span>
              <span>Poor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value?: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  description: string;
}

function MetricRow({ label, value, unit, rating, description }: MetricRowProps) {
  const ratingColors = {
    good: 'text-green-600',
    'needs-improvement': 'text-yellow-600',
    poor: 'text-red-600',
    unknown: 'text-gray-400',
  };

  return (
    <div className="flex items-center justify-between" title={description}>
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <span className={`text-xs font-mono ${ratingColors[rating]}`}>
        {value !== undefined ? `${value.toFixed(2)}${unit}` : '-'}
      </span>
    </div>
  );
}
