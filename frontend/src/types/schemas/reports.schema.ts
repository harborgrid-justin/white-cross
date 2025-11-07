/**
 * @fileoverview Reports Schema Type Definitions
 * @module types/schemas/reports.schema
 *
 * @description
 * TypeScript type definitions for report charts and data visualization schemas.
 * Provides type safety for chart data structures.
 *
 * @since 1.0.0
 */

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, unknown>
}

export interface TimeSeriesDataPoint {
  date: string | Date
  value: number
  label?: string
  metadata?: Record<string, unknown>
}

export interface MultiSeriesDataPoint {
  date: string | Date
  [key: string]: string | number | Date
}

export interface StackedBarDataPoint {
  category: string
  [key: string]: string | number
}

export interface ChartConfig {
  title?: string
  description?: string
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  animate?: boolean
}

export interface ReportChartData {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
  data: ChartDataPoint[] | TimeSeriesDataPoint[] | MultiSeriesDataPoint[] | StackedBarDataPoint[]
  config?: ChartConfig
}
