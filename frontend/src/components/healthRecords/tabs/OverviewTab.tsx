import React from 'react'
import { TrendingUp, AlertCircle, Heart, Shield, Download, Upload } from 'lucide-react'

interface OverviewTabProps {
  onShowEditAllergyModal: () => void
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onShowEditAllergyModal }) => {
  return (
    <div className="space-y-6" data-testid="overview-content">
      {/* Health Summary Dashboard */}
      <div data-testid="health-summary-dashboard">
        <h3 className="text-lg font-semibold mb-4">Health Summary Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" data-testid="summary-cards">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="allergies-summary-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-700">3</div>
                <div className="text-sm text-red-600">Active Allergies</div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="medications-summary-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700">2</div>
                <div className="text-sm text-blue-600">Current Medications</div>
              </div>
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-testid="vaccinations-summary-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700">85%</div>
                <div className="text-sm text-green-600">Vaccination Compliance</div>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4" data-testid="conditions-summary-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-700">1</div>
                <div className="text-sm text-purple-600">Chronic Conditions</div>
              </div>
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Health Timeline */}
        <div data-testid="health-timeline">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Health Timeline</h4>
            <div className="flex gap-2" data-testid="timeline-filter">
              <button className="btn-sm btn-primary" data-testid="filter-vaccinations">Vaccinations</button>
              <button className="btn-sm btn-secondary" data-testid="filter-medications">Medications</button>
              <button className="btn-sm btn-secondary" data-testid="filter-allergies">Allergies</button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4" data-testid="timeline-container">
            <div className="space-y-4">
              {[
                { id: '1', date: '2024-09-15', type: 'Vaccination', description: 'Annual flu shot administered', provider: 'School Nurse' },
                { id: '2', date: '2024-08-20', type: 'Medication', description: 'Started new inhaler for asthma', provider: 'Dr. Smith' },
                { id: '3', date: '2024-07-10', type: 'Vaccination', description: 'COVID-19 booster completed', provider: 'Clinic' },
              ].map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg" data-testid="timeline-event">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium" data-testid="event-description">{event.description}</div>
                        <div className="text-sm text-gray-600" data-testid="event-type">{event.type}</div>
                        <div className="text-sm text-gray-500" data-testid="event-provider">by {event.provider}</div>
                      </div>
                      <div className="text-sm text-gray-500" data-testid="event-date">{event.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Trends Chart */}
        <div data-testid="health-trends-chart">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Health Trends</h4>
            <select className="border border-gray-300 rounded px-3 py-2" data-testid="trend-selector">
              <option value="BMI Trend">BMI Trend</option>
              <option value="Medication Adherence">Medication Adherence</option>
              <option value="Growth Velocity">Growth Velocity</option>
            </select>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">BMI Trend Chart</p>
                <div data-testid="bmi-trend-line" className="mt-2 text-sm text-gray-500">Showing BMI changes over time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional overview sections... */}
        {/* Generate Health Report */}
        <div className="mt-8">
          <button 
            className="btn-primary" 
            data-testid="generate-health-report-btn"
            onClick={onShowEditAllergyModal}
          >
            Generate Comprehensive Health Report
          </button>
        </div>
      </div>

      <div className="border-t pt-6" data-testid="import-export-section">
        <h3 className="text-lg font-semibold mb-4">Import/Export Capabilities</h3>
        <div className="flex gap-4">
          <button className="btn-secondary flex items-center" data-testid="overview-import-button">
            <Upload className="h-4 w-4 mr-2" />
            Import Health History (JSON/CSV)
          </button>
          <button className="btn-secondary flex items-center" data-testid="overview-export-button">
            <Download className="h-4 w-4 mr-2" />
            Export Health Records
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Easily import and export complete health histories for student transfers, backups, or external system integration.
        </p>
      </div>
    </div>
  )
}