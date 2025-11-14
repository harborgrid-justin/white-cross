/**
 * ChartSection Component
 *
 * Displays performance charts with interactive modal view
 */

import React, { useState } from 'react';
import { Eye, MoreVertical, Info, X, BarChart3 } from 'lucide-react';
import { ChartData } from './ReportAnalytics.types';
import { getChartIcon } from './ReportAnalytics.helpers';

interface ChartSectionProps {
  charts: ChartData[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ charts }) => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  if (charts.length === 0) {
    return null;
  }

  const selectedChartData = selectedChart
    ? charts.find(c => c.id === selectedChart)
    : null;

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Performance Charts</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chart) => {
            const ChartIcon = getChartIcon(chart.type);
            return (
              <div key={chart.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ChartIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900">{chart.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedChart(chart.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View full chart"
                      aria-label="View full chart"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="More options"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chart Placeholder - In a real app, you'd render actual charts here */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <ChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">{chart.title} Chart</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {chart.data.datasets.length} datasets • {chart.data.labels.length} data points
                    </p>
                  </div>
                </div>

                {/* Chart Insights */}
                {chart.insights && chart.insights.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
                    <ul className="space-y-1">
                      {chart.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Info className="w-3 h-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Detail Modal */}
      {selectedChart && selectedChartData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Chart Details - {selectedChartData.title}
              </h3>
              <button
                onClick={() => setSelectedChart(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close chart modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Detailed Chart View</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Interactive chart would be rendered here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChartSection;
