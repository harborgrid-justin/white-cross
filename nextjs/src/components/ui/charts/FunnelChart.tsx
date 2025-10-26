/**
 * Funnel Chart Component
 *
 * Visualizes data as a funnel, showing progressive reduction
 * through stages of a process. Ideal for conversion rates,
 * student health screening progression, etc.
 *
 * Features:
 * - Automatic percentage calculation
 * - Stage labels and values
 * - Interactive segments
 * - Color customization
 *
 * @module components/ui/charts/FunnelChart
 */

'use client';

import React, { useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

interface FunnelChartProps {
  data: FunnelStage[];
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  showPercentages?: boolean;
  showValues?: boolean;
  onStageClick?: (stage: FunnelStage, index: number) => void;
}

const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#EC4899'  // pink-500
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Funnel chart component
 *
 * @example
 * ```tsx
 * <FunnelChart
 *   title="Health Screening Completion Funnel"
 *   data={[
 *     { name: 'Total Students', value: 1000 },
 *     { name: 'Screened', value: 850 },
 *     { name: 'Abnormal Results', value: 120 },
 *     { name: 'Follow-up Scheduled', value: 100 },
 *     { name: 'Resolved', value: 85 }
 *   ]}
 *   showPercentages
 *   showValues
 * />
 * ```
 */
export function FunnelChart({
  data,
  title,
  subtitle,
  className = '',
  height = 400,
  showPercentages = true,
  showValues = true,
  onStageClick
}: FunnelChartProps) {
  // Add colors to stages
  const stagesWithColors = useMemo(() => {
    return data.map((stage, index) => ({
      ...stage,
      color: stage.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    }));
  }, [data]);

  // Calculate percentages and widths
  const stagesWithMetrics = useMemo(() => {
    const maxValue = data[0]?.value || 1;

    return stagesWithColors.map((stage, index) => {
      const percentage = (stage.value / maxValue) * 100;
      const width = Math.max(percentage, 10); // Minimum 10% width for visibility

      // Calculate drop-off from previous stage
      const dropOff = index > 0
        ? ((data[index - 1].value - stage.value) / data[index - 1].value) * 100
        : 0;

      const conversionFromFirst = (stage.value / maxValue) * 100;

      return {
        ...stage,
        percentage,
        width,
        dropOff,
        conversionFromFirst
      };
    });
  }, [stagesWithColors, data]);

  const stageHeight = height / data.length;

  return (
    <div className={className}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {stagesWithMetrics.map((stage, index) => (
          <div key={index} className="relative">
            {/* Stage bar */}
            <div
              className="mx-auto cursor-pointer transition-all hover:opacity-90"
              style={{
                width: `${stage.width}%`,
                height: stageHeight,
                backgroundColor: stage.color,
                clipPath: index === 0
                  ? 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
                  : index === data.length - 1
                  ? 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)'
                  : 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)'
              }}
              onClick={() => onStageClick?.(stage, index)}
            >
              {/* Stage content */}
              <div className="flex items-center justify-center h-full px-4 text-white">
                <div className="text-center">
                  <div className="font-semibold text-sm">{stage.name}</div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {showValues && (
                      <span className="text-lg font-bold">
                        {stage.value.toLocaleString()}
                      </span>
                    )}
                    {showPercentages && (
                      <span className="text-sm opacity-90">
                        ({stage.conversionFromFirst.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Drop-off indicator */}
            {index > 0 && stage.dropOff > 0 && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-4">
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                  -{stage.dropOff.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data[0]?.value.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Started</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data[data.length - 1]?.value.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.length > 0
              ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(1)
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600 mt-1">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}

export default FunnelChart;
