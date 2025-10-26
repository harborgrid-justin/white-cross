/**
 * Gauge Chart Component
 *
 * Displays a single metric as a gauge/speedometer visualization.
 * Perfect for KPIs, progress indicators, and performance metrics.
 *
 * Features:
 * - Customizable color zones
 * - Min/max ranges
 * - Label and value display
 * - Threshold markers
 * - Responsive sizing
 *
 * @module components/ui/charts/GaugeChart
 */

'use client';

import React, { useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface ColorZone {
  min: number;
  max: number;
  color: string;
  label?: string;
}

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;
  unit?: string;
  className?: string;
  size?: number;
  colorZones?: ColorZone[];
  showValue?: boolean;
  showMinMax?: boolean;
  thresholds?: number[];
}

// Default color zones (good - warning - danger)
const DEFAULT_COLOR_ZONES: ColorZone[] = [
  { min: 0, max: 60, color: '#EF4444', label: 'Low' },
  { min: 60, max: 85, color: '#F59E0B', label: 'Medium' },
  { min: 85, max: 100, color: '#10B981', label: 'Good' }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts value to angle (0-180 degrees)
 */
function valueToAngle(value: number, min: number, max: number): number {
  const range = max - min;
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / range));
  return normalizedValue * 180;
}

/**
 * Gets color for current value based on zones
 */
function getValueColor(value: number, zones: ColorZone[]): string {
  const zone = zones.find((z) => value >= z.min && value <= z.max);
  return zone?.color || '#6B7280';
}

/**
 * Polarizes coordinates
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Gauge chart component
 *
 * @example
 * ```tsx
 * <GaugeChart
 *   value={87}
 *   min={0}
 *   max={100}
 *   title="System Health"
 *   unit="%"
 *   colorZones={[
 *     { min: 0, max: 50, color: '#EF4444', label: 'Critical' },
 *     { min: 50, max: 75, color: '#F59E0B', label: 'Warning' },
 *     { min: 75, max: 100, color: '#10B981', label: 'Healthy' }
 *   ]}
 * />
 * ```
 */
export function GaugeChart({
  value,
  min = 0,
  max = 100,
  title,
  subtitle,
  unit = '',
  className = '',
  size = 200,
  colorZones = DEFAULT_COLOR_ZONES,
  showValue = true,
  showMinMax = true,
  thresholds = []
}: GaugeChartProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) * 0.7;
  const strokeWidth = 20;

  // Calculate angle for current value
  const angle = useMemo(
    () => valueToAngle(value, min, max),
    [value, min, max]
  );

  // Get current value color
  const valueColor = useMemo(
    () => getValueColor(value, colorZones),
    [value, colorZones]
  );

  // Generate arc paths for color zones
  const zonePaths = useMemo(() => {
    return colorZones.map((zone) => {
      const startAngle = valueToAngle(zone.min, min, max) - 90;
      const endAngle = valueToAngle(zone.max, min, max) - 90;

      const start = polarToCartesian(centerX, centerY, radius, startAngle);
      const end = polarToCartesian(centerX, centerY, radius, endAngle);

      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

      return {
        path: [
          'M',
          start.x,
          start.y,
          'A',
          radius,
          radius,
          0,
          largeArcFlag,
          1,
          end.x,
          end.y
        ].join(' '),
        color: zone.color
      };
    });
  }, [colorZones, min, max, centerX, centerY, radius]);

  // Needle coordinates
  const needleEnd = useMemo(() => {
    return polarToCartesian(centerX, centerY, radius - 10, angle - 90);
  }, [angle, centerX, centerY, radius]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <div className="text-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <svg width={size} height={size * 0.75} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Color zone arcs */}
        {zonePaths.map((zone, index) => (
          <path
            key={index}
            d={zone.path}
            fill="none"
            stroke={zone.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}

        {/* Threshold markers */}
        {thresholds.map((threshold, index) => {
          const thresholdAngle = valueToAngle(threshold, min, max) - 90;
          const markerStart = polarToCartesian(
            centerX,
            centerY,
            radius - strokeWidth / 2 - 5,
            thresholdAngle
          );
          const markerEnd = polarToCartesian(
            centerX,
            centerY,
            radius + strokeWidth / 2 + 5,
            thresholdAngle
          );

          return (
            <line
              key={index}
              x1={markerStart.x}
              y1={markerStart.y}
              x2={markerEnd.x}
              y2={markerEnd.y}
              stroke="#374151"
              strokeWidth={2}
            />
          );
        })}

        {/* Needle */}
        <g>
          <line
            x1={centerX}
            y1={centerY}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke={valueColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={6}
            fill={valueColor}
            stroke="white"
            strokeWidth={2}
          />
        </g>

        {/* Min/Max labels */}
        {showMinMax && (
          <>
            <text
              x={centerX - radius - 10}
              y={centerY + 5}
              className="text-xs fill-gray-600"
              textAnchor="end"
            >
              {min}
            </text>
            <text
              x={centerX + radius + 10}
              y={centerY + 5}
              className="text-xs fill-gray-600"
              textAnchor="start"
            >
              {max}
            </text>
          </>
        )}
      </svg>

      {/* Value display */}
      {showValue && (
        <div className="text-center mt-2">
          <div className="text-3xl font-bold" style={{ color: valueColor }}>
            {value.toFixed(1)}
            {unit && <span className="text-xl ml-1">{unit}</span>}
          </div>
        </div>
      )}

      {/* Zone legend */}
      {colorZones.some((z) => z.label) && (
        <div className="flex gap-4 mt-4">
          {colorZones
            .filter((z) => z.label)
            .map((zone, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-sm text-gray-600">{zone.label}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default GaugeChart;
