/**
 * Heat Map Chart Component
 *
 * Displays data intensity using color gradients.
 * Ideal for showing patterns over time or across categories.
 *
 * Features:
 * - Custom color gradients
 * - Interactive cells
 * - Tooltip with details
 * - Configurable grid
 *
 * @module components/ui/charts/HeatMapChart
 */

'use client';

import React, { useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface HeatMapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatMapChartProps {
  data: HeatMapData[];
  title?: string;
  subtitle?: string;
  className?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple' | 'gradient';
  minValue?: number;
  maxValue?: number;
  cellSize?: number;
  showValues?: boolean;
  onCellClick?: (data: HeatMapData) => void;
}

// ============================================================================
// COLOR SCHEMES
// ============================================================================

const COLOR_SCHEMES = {
  blue: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'],
  green: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D'],
  red: ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C'],
  purple: ['#FAF5FF', '#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7E22CE'],
  gradient: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets color based on value and color scheme
 */
function getColor(
  value: number,
  min: number,
  max: number,
  scheme: keyof typeof COLOR_SCHEMES
): string {
  const colors = COLOR_SCHEMES[scheme];
  const range = max - min;
  const normalizedValue = range > 0 ? (value - min) / range : 0;
  const colorIndex = Math.min(
    Math.floor(normalizedValue * colors.length),
    colors.length - 1
  );
  return colors[colorIndex];
}

/**
 * Groups data by unique x and y values
 */
function prepareHeatMapData(data: HeatMapData[]): {
  xLabels: string[];
  yLabels: string[];
  matrix: Map<string, HeatMapData>;
} {
  const xLabels = Array.from(new Set(data.map((d) => d.x))).sort();
  const yLabels = Array.from(new Set(data.map((d) => d.y))).sort();

  const matrix = new Map<string, HeatMapData>();
  data.forEach((d) => {
    const key = `${d.x}-${d.y}`;
    matrix.set(key, d);
  });

  return { xLabels, yLabels, matrix };
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Heat map chart component
 *
 * @example
 * ```tsx
 * <HeatMapChart
 *   title="Incident Frequency by Day and Hour"
 *   data={[
 *     { x: 'Monday', y: '8AM', value: 5 },
 *     { x: 'Monday', y: '9AM', value: 12 },
 *     // ... more data
 *   ]}
 *   colorScheme="red"
 *   showValues
 * />
 * ```
 */
export function HeatMapChart({
  data,
  title,
  subtitle,
  className = '',
  colorScheme = 'blue',
  minValue,
  maxValue,
  cellSize = 60,
  showValues = false,
  onCellClick
}: HeatMapChartProps) {
  // Calculate min and max if not provided
  const { min, max } = useMemo(() => {
    if (minValue !== undefined && maxValue !== undefined) {
      return { min: minValue, max: maxValue };
    }

    const values = data.map((d) => d.value);
    return {
      min: minValue ?? Math.min(...values),
      max: maxValue ?? Math.max(...values)
    };
  }, [data, minValue, maxValue]);

  // Prepare heat map structure
  const { xLabels, yLabels, matrix } = useMemo(
    () => prepareHeatMapData(data),
    [data]
  );

  // Tooltip state
  const [tooltip, setTooltip] = React.useState<{
    visible: boolean;
    x: number;
    y: number;
    data: HeatMapData | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });

  const handleCellHover = (
    event: React.MouseEvent,
    cellData: HeatMapData | undefined
  ) => {
    if (cellData) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        data: cellData
      });
    }
  };

  const handleCellLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  };

  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Heat map grid */}
          <div className="flex">
            {/* Y-axis labels */}
            <div className="flex flex-col">
              <div style={{ height: cellSize }} /> {/* Spacer for x-axis labels */}
              {yLabels.map((yLabel) => (
                <div
                  key={yLabel}
                  className="flex items-center justify-end pr-2 text-sm text-gray-600"
                  style={{ height: cellSize }}
                >
                  {yLabel}
                </div>
              ))}
            </div>

            {/* Grid cells */}
            <div className="flex-1">
              {/* X-axis labels */}
              <div className="flex">
                {xLabels.map((xLabel) => (
                  <div
                    key={xLabel}
                    className="flex items-center justify-center text-sm text-gray-600"
                    style={{ width: cellSize, height: cellSize }}
                  >
                    <div className="transform -rotate-45 origin-center whitespace-nowrap">
                      {xLabel}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data cells */}
              {yLabels.map((yLabel) => (
                <div key={yLabel} className="flex">
                  {xLabels.map((xLabel) => {
                    const cellData = matrix.get(`${xLabel}-${yLabel}`);
                    const value = cellData?.value ?? 0;
                    const color = cellData
                      ? getColor(value, min, max, colorScheme)
                      : '#F9FAFB';

                    return (
                      <div
                        key={`${xLabel}-${yLabel}`}
                        className="border border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: color
                        }}
                        onMouseEnter={(e) => handleCellHover(e, cellData)}
                        onMouseLeave={handleCellLeave}
                        onClick={() => cellData && onCellClick?.(cellData)}
                      >
                        {showValues && cellData && (
                          <span className="text-xs font-medium text-gray-900">
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Low</span>
            <div className="flex gap-1">
              {COLOR_SCHEMES[colorScheme].map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-4 border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">High</span>
            <span className="text-sm text-gray-500 ml-2">
              ({min} - {max})
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="fixed z-50 bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {tooltip.data.x} - {tooltip.data.y}
            </div>
            <div className="text-gray-600">
              Value: <span className="font-medium">{tooltip.data.value}</span>
            </div>
            {tooltip.data.label && (
              <div className="text-gray-600 text-xs mt-1">
                {tooltip.data.label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeatMapChart;
