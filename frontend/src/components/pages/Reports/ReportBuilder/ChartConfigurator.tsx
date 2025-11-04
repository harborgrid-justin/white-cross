import React from 'react';
import { BarChart3, LineChart, PieChart } from 'lucide-react';
import type { ChartConfig } from './types';

/**
 * Props for ChartConfigurator component
 */
export interface ChartConfiguratorProps {
  /** Whether to include a chart in the report */
  includeChart: boolean;
  /** Current chart configuration */
  chartConfig?: ChartConfig;
  /** Callback when chart inclusion is toggled */
  onToggleChart: (include: boolean) => void;
  /** Callback when chart configuration is updated */
  onUpdateChartConfig: (config: Partial<ChartConfig>) => void;
}

/**
 * ChartConfigurator Component
 *
 * Allows users to configure chart visualization options for their report.
 * Users can choose chart type and configure chart-specific settings.
 *
 * @param props - Component props
 * @returns JSX element for chart configuration
 */
export const ChartConfigurator = React.memo<ChartConfiguratorProps>(({
  includeChart,
  chartConfig,
  onToggleChart,
  onUpdateChartConfig
}) => {
  const chartTypes = [
    { type: 'bar' as const, icon: BarChart3, label: 'Bar Chart' },
    { type: 'line' as const, icon: LineChart, label: 'Line Chart' },
    { type: 'pie' as const, icon: PieChart, label: 'Pie Chart' },
    { type: 'area' as const, icon: LineChart, label: 'Area Chart' },
    { type: 'scatter' as const, icon: BarChart3, label: 'Scatter Plot' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Visualization Options</h2>

        {/* Include Chart Toggle */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeChart}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleChart(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              id="include-chart-checkbox"
              aria-describedby="chart-option-desc"
            />
            <span id="chart-option-desc" className="ml-2 text-sm font-medium text-gray-700">
              Include Chart Visualization
            </span>
          </label>
          <p className="ml-6 mt-1 text-xs text-gray-500">
            Add a visual chart to your report for better data representation
          </p>
        </div>

        {/* Chart Configuration (shown when includeChart is true) */}
        {includeChart && (
          <div className="pl-6 space-y-6 border-l-2 border-blue-200">
            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chart Type
              </label>
              <div className="grid grid-cols-5 gap-3">
                {chartTypes.map(({ type, icon: Icon, label }) => {
                  const isSelected = chartConfig?.type === type;

                  return (
                    <button
                      key={type}
                      onClick={() => onUpdateChartConfig({ type })}
                      className={`
                        p-3 border rounded-lg text-center transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isSelected
                          ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                      aria-label={label}
                      aria-pressed={isSelected}
                      title={label}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
                        aria-hidden="true"
                      />
                      <span className="text-xs block">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart Type Description */}
            {chartConfig?.type && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md" role="status">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  {chartTypes.find(ct => ct.type === chartConfig.type)?.label}
                </h4>
                <p className="text-xs text-blue-700">
                  {chartConfig.type === 'bar' && 'Display data as vertical or horizontal bars for easy comparison.'}
                  {chartConfig.type === 'line' && 'Show trends over time with connected data points.'}
                  {chartConfig.type === 'pie' && 'Visualize proportions and percentages in a circular chart.'}
                  {chartConfig.type === 'area' && 'Display quantitative data with filled areas under lines.'}
                  {chartConfig.type === 'scatter' && 'Plot individual data points to show relationships between variables.'}
                </p>
              </div>
            )}

            {/* Aggregate Function Selection (for numeric charts) */}
            {chartConfig?.type && ['bar', 'line', 'area'].includes(chartConfig.type) && (
              <div>
                <label htmlFor="aggregate-function" className="block text-sm font-medium text-gray-700 mb-2">
                  Aggregate Function
                </label>
                <select
                  id="aggregate-function"
                  value={chartConfig.aggregate || 'count'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onUpdateChartConfig({
                      aggregate: e.target.value as ChartConfig['aggregate']
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Select aggregate function for chart data"
                >
                  <option value="count">Count</option>
                  <option value="sum">Sum</option>
                  <option value="avg">Average</option>
                  <option value="min">Minimum</option>
                  <option value="max">Maximum</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose how to aggregate data points in your chart
                </p>
              </div>
            )}

            {/* Additional Chart Options Preview */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-xs text-gray-600 mb-2 font-medium">Chart Preview Configuration:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>Type: <span className="font-medium">{chartConfig?.type || 'Not selected'}</span></li>
                <li>Aggregate: <span className="font-medium">{chartConfig?.aggregate || 'count'}</span></li>
              </ul>
            </div>
          </div>
        )}

        {/* Help Text when chart is not included */}
        {!includeChart && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-gray-600 mb-1">Chart visualization disabled</p>
            <p className="text-sm text-gray-500">
              Enable chart visualization to add visual insights to your report
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ChartConfigurator.displayName = 'ChartConfigurator';

export default ChartConfigurator;
