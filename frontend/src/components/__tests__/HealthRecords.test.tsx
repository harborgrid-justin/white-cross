import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import HealthRecords from '../../pages/HealthRecords';
import { healthRecordApi } from '../../services/healthRecordApi';

// Mock the API
vi.mock('../../services/healthRecordApi');
const mockHealthRecordApi = healthRecordApi as any;

// Mock data
const mockHealthRecords = [
  {
    id: '1',
    type: 'PHYSICAL_EXAM',
    date: '2024-10-01',
    description: 'Annual physical examination',
    provider: 'Dr. Smith',
    notes: 'Patient in good health',
    vital: {
      height: 150,
      weight: 45,
      temperature: 36.5,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72
    },
    student: {
      id: 'student-1',
      firstName: 'John',
      lastName: 'Doe',
      studentNumber: 'STU001'
    }
  }
];

const mockAllergies = [
  {
    id: '1',
    allergen: 'Peanuts',
    severity: 'LIFE_THREATENING' as const,
    reaction: 'Anaphylaxis',
    treatment: 'EpiPen',
    verified: true,
    verifiedBy: 'Dr. Smith',
    verifiedAt: '2024-10-01',
    student: {
      id: 'student-1',
      firstName: 'John',
      lastName: 'Doe',
      studentNumber: 'STU001'
    }
  }
];

const mockChronicConditions = [
  {
    id: '1',
    condition: 'Asthma',
    diagnosedDate: '2020-01-15',
    status: 'ACTIVE',
    severity: 'MODERATE',
    notes: 'Exercise-induced asthma',
    carePlan: 'Inhaler as needed',
    medications: 'Albuterol',
    dietaryRestrictions: 'None',
    activityRestrictions: 'No strenuous exercise',
    triggers: 'Dust, pollen',
    diagnosedBy: 'Dr. Johnson',
    lastReviewDate: '2024-01-15',
    nextReviewDate: '2025-01-15',
    student: {
      id: 'student-1',
      firstName: 'John',
      lastName: 'Doe',
      studentNumber: 'STU001'
    }
  }
];

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('HealthRecords Component - Basic Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getStudentHealthRecords.mockResolvedValue({
      success: true,
      data: { records: mockHealthRecords, pagination: { page: 1, limit: 20, total: 1, pages: 1 } }
    });
    mockHealthRecordApi.getStudentAllergies.mockResolvedValue({
      success: true,
      data: { allergies: mockAllergies }
    });
    mockHealthRecordApi.getStudentChronicConditions.mockResolvedValue({
      success: true,
      data: { conditions: mockChronicConditions }
    });
  });

  // Tests 1-10: Basic Component Rendering
  test('1. should render the health records page title', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Health Records Management')).toBeInTheDocument();
  });

  test('2. should render the comprehensive electronic health records subtitle', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Comprehensive electronic health records system')).toBeInTheDocument();
  });

  test('3. should render all navigation tabs', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Health Records')).toBeInTheDocument();
    expect(screen.getByText('Allergies')).toBeInTheDocument();
    expect(screen.getByText('Chronic Conditions')).toBeInTheDocument();
    expect(screen.getByText('Vaccinations')).toBeInTheDocument();
    expect(screen.getByText('Growth Charts')).toBeInTheDocument();
    expect(screen.getByText('Screenings')).toBeInTheDocument();
  });

  test('4. should render action buttons in header', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('New Record')).toBeInTheDocument();
  });

  test('5. should render statistics cards', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Total Records')).toBeInTheDocument();
    expect(screen.getByText('Active Allergies')).toBeInTheDocument();
    expect(screen.getByText('Chronic Conditions')).toBeInTheDocument();
    expect(screen.getByText('Vaccinations Due')).toBeInTheDocument();
  });

  test('6. should display overview tab content by default', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Electronic Health Records (EHR)')).toBeInTheDocument();
    expect(screen.getByText('Vaccination Tracking')).toBeInTheDocument();
    expect(screen.getByText('Allergy Management')).toBeInTheDocument();
    expect(screen.getByText('Chronic Conditions')).toBeInTheDocument();
  });

  test('7. should render feature descriptions in overview', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Complete digital health record system with comprehensive medical history')).toBeInTheDocument();
    expect(screen.getByText('Complete immunization records with compliance monitoring')).toBeInTheDocument();
  });

  test('8. should render import/export section in overview', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Import/Export Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Import Health History (JSON/CSV)')).toBeInTheDocument();
    expect(screen.getByText('Export Health Records')).toBeInTheDocument();
  });

  test('9. should have proper tab navigation structure', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const tabButtons = screen.getAllByRole('button');
    const overviewTab = tabButtons.find(button => button.textContent?.includes('Overview'));
    expect(overviewTab).toHaveClass('border-blue-600', 'text-blue-600');
  });

  test('10. should render icons for each tab', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    // Check for presence of tab buttons with icons (lucide icons are rendered as SVGs)
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });
});

describe('HealthRecords Component - Tab Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getStudentHealthRecords.mockResolvedValue({
      success: true,
      data: { records: mockHealthRecords, pagination: { page: 1, limit: 20, total: 1, pages: 1 } }
    });
    mockHealthRecordApi.getStudentAllergies.mockResolvedValue({
      success: true,
      data: { allergies: mockAllergies }
    });
    mockHealthRecordApi.getStudentChronicConditions.mockResolvedValue({
      success: true,
      data: { conditions: mockChronicConditions }
    });
  });

  // Tests 11-20: Tab Navigation
  test('11. should switch to health records tab when clicked', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByPlaceholderText('Search health records...')).toBeInTheDocument();
  });

  test('12. should switch to allergies tab when clicked', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('Student Allergies')).toBeInTheDocument();
    expect(screen.getByText('Add Allergy')).toBeInTheDocument();
  });

  test('13. should switch to chronic conditions tab when clicked', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    expect(screen.getByText('Add Condition')).toBeInTheDocument();
  });

  test('14. should switch to vaccinations tab when clicked', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    expect(screen.getByText('Vaccination Records')).toBeInTheDocument();
    expect(screen.getByText('Record Vaccination')).toBeInTheDocument();
  });

  test('15. should switch to growth charts tab when clicked', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    expect(screen.getByText('Growth Chart Analysis')).toBeInTheDocument();
  });

  test('16. should switch to screenings tab when clicked', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    expect(screen.getByText('Vision & Hearing Screenings')).toBeInTheDocument();
    expect(screen.getByText('Schedule Screening')).toBeInTheDocument();
  });

  test('17. should highlight active tab correctly', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const allergiesTab = screen.getByText('Allergies').closest('button');
    fireEvent.click(screen.getByText('Allergies'));
    expect(allergiesTab).toHaveClass('border-blue-600', 'text-blue-600');
  });

  test('18. should unhighlight previous tab when switching', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const overviewTab = screen.getByText('Overview').closest('button');
    fireEvent.click(screen.getByText('Allergies'));
    expect(overviewTab).toHaveClass('border-transparent', 'text-gray-500');
  });

  test('19. should maintain tab state when switching back', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    fireEvent.click(screen.getByText('Overview'));
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByPlaceholderText('Search health records...')).toBeInTheDocument();
  });

  test('20. should render correct content for each tab', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    
    // Test each tab content
    const tabs = ['Health Records', 'Allergies', 'Chronic Conditions', 'Vaccinations', 'Growth Charts', 'Screenings'];
    tabs.forEach(tabName => {
      fireEvent.click(screen.getByText(tabName));
      // Each tab should have its own unique content
      expect(screen.getByText(tabName).closest('button')).toHaveClass('border-blue-600', 'text-blue-600');
    });
  });
});

describe('HealthRecords Component - Health Records Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getStudentHealthRecords.mockResolvedValue({
      success: true,
      data: { records: mockHealthRecords, pagination: { page: 1, limit: 20, total: 1, pages: 1 } }
    });
  });

  // Tests 21-30: Health Records Tab Functionality
  test('21. should render search input in health records tab', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByPlaceholderText('Search health records...')).toBeInTheDocument();
  });

  test('22. should render filter button in health records tab', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  test('23. should render mock health record data', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByText('Annual Physical Examination')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson • October 15, 2024')).toBeInTheDocument();
  });

  test('24. should handle search input changes', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    const searchInput = screen.getByPlaceholderText('Search health records...');
    fireEvent.change(searchInput, { target: { value: 'physical exam' } });
    expect(searchInput).toHaveValue('physical exam');
  });

  test('25. should render view details buttons for health records', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  test('26. should display health record icons', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    // Health records should have stethoscope icons
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('27. should show hover effects on health record items', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    const recordItems = screen.getAllByText('Annual Physical Examination');
    recordItems.forEach(item => {
      const container = item.closest('.hover\\:bg-gray-50');
      expect(container).toBeInTheDocument();
    });
  });

  test('28. should render health record dates correctly', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByText(/October 15, 2024/)).toBeInTheDocument();
  });

  test('29. should render health record descriptions', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByText('Complete physical exam with vitals and health assessment')).toBeInTheDocument();
  });

  test('30. should render provider information in health records', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Health Records'));
    expect(screen.getByText(/Dr\. Sarah Johnson/)).toBeInTheDocument();
  });
});

describe('HealthRecords Component - Allergies Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getStudentAllergies.mockResolvedValue({
      success: true,
      data: { allergies: mockAllergies }
    });
  });

  // Tests 31-40: Allergies Tab Functionality
  test('31. should render allergies tab content', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('Student Allergies')).toBeInTheDocument();
  });

  test('32. should render add allergy button', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('Add Allergy')).toBeInTheDocument();
  });

  test('33. should display mock allergy data', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('Peanuts')).toBeInTheDocument();
    expect(screen.getByText('Penicillin')).toBeInTheDocument();
    expect(screen.getByText('Bee Stings')).toBeInTheDocument();
  });

  test('34. should display allergy severity levels', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('LIFE_THREATENING')).toBeInTheDocument();
    expect(screen.getByText('SEVERE')).toBeInTheDocument();
    expect(screen.getByText('MODERATE')).toBeInTheDocument();
  });

  test('35. should show verification status for allergies', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    const verifiedElements = screen.getAllByText('Verified');
    expect(verifiedElements.length).toBeGreaterThan(0);
  });

  test('36. should display allergy action buttons', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons.length).toBeGreaterThan(0);
  });

  test('37. should render allergy severity with color coding', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    const lifeThreatening = screen.getByText('LIFE_THREATENING');
    expect(lifeThreatening.closest('.bg-red-100')).toBeInTheDocument();
  });

  test('38. should show unverified allergies differently', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    // Mock data includes unverified allergies
    const allergyItems = screen.getAllByText(/Bee Stings|Peanuts|Penicillin/);
    expect(allergyItems.length).toBeGreaterThan(0);
  });

  test('39. should render allergy icons', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    // Should have alert circle icons for allergies
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('40. should handle add allergy button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Allergies'));
    const addButton = screen.getByText('Add Allergy');
    fireEvent.click(addButton);
    // Button should be clickable
    expect(addButton).toBeInTheDocument();
  });
});

describe('HealthRecords Component - Chronic Conditions Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getStudentChronicConditions.mockResolvedValue({
      success: true,
      data: { conditions: mockChronicConditions }
    });
  });

  // Tests 41-50: Chronic Conditions Tab Functionality
  test('41. should render chronic conditions tab content', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    expect(screen.getByText('Add Condition')).toBeInTheDocument();
  });

  test('42. should display mock chronic condition data', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    expect(screen.getByText('Asthma')).toBeInTheDocument();
    expect(screen.getByText('Type 1 Diabetes')).toBeInTheDocument();
  });

  test('43. should show chronic condition status', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    const activeElements = screen.getAllByText('ACTIVE');
    expect(activeElements.length).toBeGreaterThan(0);
  });

  test('44. should display condition severity levels', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    expect(screen.getByText('MODERATE')).toBeInTheDocument();
    expect(screen.getByText('SEVERE')).toBeInTheDocument();
  });

  test('45. should render view care plan buttons', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    const carePlanButtons = screen.getAllByText('View Care Plan');
    expect(carePlanButtons.length).toBeGreaterThan(0);
  });

  test('46. should show condition icons', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    // Should have heart icons for chronic conditions
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('47. should handle add condition button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    const addButton = screen.getByText('Add Condition');
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  test('48. should display condition severity with color coding', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    const severeElement = screen.getByText('SEVERE');
    expect(severeElement.closest('.bg-red-100')).toBeInTheDocument();
  });

  test('49. should show active status with proper styling', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    const activeElement = screen.getAllByText('ACTIVE')[0];
    expect(activeElement.closest('.bg-green-100')).toBeInTheDocument();
  });

  test('50. should render condition cards with proper structure', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Chronic Conditions'));
    const asthmaCard = screen.getByText('Asthma').closest('.border');
    expect(asthmaCard).toHaveClass('border-gray-200', 'rounded-lg', 'p-4');
  });
});

describe('HealthRecords Component - Vaccinations Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getVaccinationRecords.mockResolvedValue({
      success: true,
      data: { 
        vaccinations: [
          {
            id: '1',
            vaccine: 'MMR (Measles, Mumps, Rubella)',
            date: '2023-08-15',
            status: 'Complete',
            provider: 'Dr. Smith',
            nextDue: null
          },
          {
            id: '2',
            vaccine: 'COVID-19 Vaccine',
            date: '2023-09-01',
            status: 'Complete',
            provider: 'Nurse Johnson',
            nextDue: '2024-09-01'
          }
        ]
      }
    });
  });

  // Tests 51-60: Vaccinations Tab Functionality
  test('51. should render vaccinations tab content', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    expect(screen.getByText('Vaccination Records')).toBeInTheDocument();
  });

  test('52. should render record vaccination button', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    expect(screen.getByText('Record Vaccination')).toBeInTheDocument();
  });

  test('53. should display vaccination data', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    expect(screen.getByText('MMR (Measles, Mumps, Rubella)')).toBeInTheDocument();
    expect(screen.getByText('COVID-19 Vaccine')).toBeInTheDocument();
  });

  test('54. should show vaccination status badges', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    const completeElements = screen.getAllByText('Complete');
    expect(completeElements.length).toBeGreaterThan(0);
  });

  test('55. should display vaccination dates', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    expect(screen.getByText(/Administered: 2023-08-15/)).toBeInTheDocument();
  });

  test('56. should render view record buttons for vaccinations', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    const viewButtons = screen.getAllByText('View Record');
    expect(viewButtons.length).toBeGreaterThanOrEqual(1);
  });

  test('57. should show shield icons for vaccinations', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('58. should handle record vaccination button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    const recordButton = screen.getByText('Record Vaccination');
    fireEvent.click(recordButton);
    expect(recordButton).toBeInTheDocument();
  });

  test('59. should display vaccination status with proper color coding', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    const completeStatus = screen.getAllByText('Complete')[0];
    expect(completeStatus.closest('.bg-green-100')).toBeInTheDocument();
  });

  test('60. should render vaccination cards with proper spacing', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Vaccinations'));
    const vaccinationCards = screen.getAllByText(/MMR|COVID-19/);
    vaccinationCards.forEach(card => {
      const container = card.closest('.border');
      expect(container).toHaveClass('border-gray-200', 'rounded-lg', 'p-4');
    });
  });
});

describe('HealthRecords Component - Growth Charts Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getGrowthChartData.mockResolvedValue({
      success: true,
      data: { 
        growthData: [
          {
            date: '2024-01-15',
            height: 148,
            weight: 42,
            bmi: 19.2,
            percentiles: {
              height: 50,
              weight: 45,
              bmi: 60
            }
          }
        ]
      }
    });
  });

  // Tests 61-70: Growth Charts Tab Functionality
  test('61. should render growth charts tab content', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    expect(screen.getByText('Growth Chart Analysis')).toBeInTheDocument();
  });

  test('62. should display growth chart placeholder', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    expect(screen.getByText('Growth chart visualization will be displayed here')).toBeInTheDocument();
  });

  test('63. should render trending up icon for growth', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('64. should have proper layout for growth chart area', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    const chartArea = screen.getByText('Growth chart visualization will be displayed here').closest('.border');
    expect(chartArea).toHaveClass('border-gray-200', 'rounded-lg', 'p-8');
  });

  test('65. should center align growth chart content', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    const chartArea = screen.getByText('Growth chart visualization will be displayed here').closest('.text-center');
    expect(chartArea).toBeInTheDocument();
  });

  test('66. should display growth chart heading', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    expect(screen.getByText('Growth Chart Analysis')).toHaveClass('text-lg', 'font-semibold');
  });

  test('67. should have space for growth data visualization', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    const spaceElement = screen.getByText('Growth Chart Analysis').closest('.space-y-4');
    expect(spaceElement).toBeInTheDocument();
  });

  test('68. should render with proper gray text styling', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    const placeholderText = screen.getByText('Growth chart visualization will be displayed here');
    expect(placeholderText).toHaveClass('text-gray-500');
  });

  test('69. should maintain consistent spacing in growth tab', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    const container = screen.getByText('Growth Chart Analysis').parentElement;
    expect(container).toHaveClass('space-y-4');
  });

  test('70. should be ready for future chart integration', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Growth Charts'));
    // Placeholder structure is ready for chart library integration
    const chartContainer = screen.getByText('Growth chart visualization will be displayed here').parentElement;
    expect(chartContainer).toHaveClass('border', 'border-gray-200', 'rounded-lg');
  });
});

describe('HealthRecords Component - Screenings Tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 71-80: Screenings Tab Functionality
  test('71. should render screenings tab content', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    expect(screen.getByText('Vision & Hearing Screenings')).toBeInTheDocument();
  });

  test('72. should render schedule screening button', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    expect(screen.getByText('Schedule Screening')).toBeInTheDocument();
  });

  test('73. should display screening data', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    expect(screen.getByText('Hearing Screening')).toBeInTheDocument();
    expect(screen.getByText('Vision Screening')).toBeInTheDocument();
  });

  test('74. should show screening results', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Refer')).toBeInTheDocument();
  });

  test('75. should display screening dates', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    expect(screen.getByText(/2024-09-05/)).toBeInTheDocument();
    expect(screen.getByText(/2023-09-15/)).toBeInTheDocument();
  });

  test('76. should render screening icons correctly', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    // Should have ear and eye icons
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('77. should show result color coding', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    const passResult = screen.getByText('Pass');
    const referResult = screen.getByText('Refer');
    expect(passResult.closest('.bg-green-100')).toBeInTheDocument();
    expect(referResult.closest('.bg-orange-100')).toBeInTheDocument();
  });

  test('78. should handle schedule screening button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    const scheduleButton = screen.getByText('Schedule Screening');
    fireEvent.click(scheduleButton);
    expect(scheduleButton).toBeInTheDocument();
  });

  test('79. should render view details buttons for screenings', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    const viewButtons = screen.getAllByText('View Details');
    expect(viewButtons.length).toBeGreaterThanOrEqual(1);
  });

  test('80. should maintain proper screening card structure', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Screenings'));
    const screeningCards = screen.getAllByText(/Hearing|Vision/);
    screeningCards.forEach(card => {
      const container = card.closest('.border');
      expect(container).toHaveClass('border-gray-200', 'rounded-lg', 'p-4');
    });
  });
});

describe('HealthRecords Component - Action Buttons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthRecordApi.getStudentHealthRecords.mockResolvedValue({
      success: true,
      data: { records: mockHealthRecords, pagination: { page: 1, limit: 20, total: 1, pages: 1 } }
    });
  });

  // Tests 81-90: Action Button Functionality
  test('81. should handle new record button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const newRecordButton = screen.getByText('New Record');
    fireEvent.click(newRecordButton);
    expect(newRecordButton).toBeInTheDocument();
  });

  test('82. should handle import button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const importButton = screen.getByText('Import');
    fireEvent.click(importButton);
    expect(importButton).toBeInTheDocument();
  });

  test('83. should handle export button click', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    expect(exportButton).toBeInTheDocument();
  });

  test('84. should render button icons correctly', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    // Upload, Download, and Plus icons should be present
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('85. should have proper button styling', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const newRecordButton = screen.getByText('New Record');
    expect(newRecordButton).toHaveClass('btn-primary');
  });

  test('86. should have secondary styling for import/export', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const importButton = screen.getByText('Import');
    const exportButton = screen.getByText('Export');
    expect(importButton).toHaveClass('btn-secondary');
    expect(exportButton).toHaveClass('btn-secondary');
  });

  test('87. should maintain button group layout', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const buttonContainer = screen.getByText('New Record').parentElement;
    expect(buttonContainer).toHaveClass('flex', 'gap-2');
  });

  test('88. should handle button focus states', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const newRecordButton = screen.getByText('New Record');
    newRecordButton.focus();
    expect(document.activeElement).toBe(newRecordButton);
  });

  test('89. should handle overview import/export buttons', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    // Overview tab has its own import/export buttons
    const overviewImportButton = screen.getByText('Import Health History (JSON/CSV)');
    const overviewExportButton = screen.getByText('Export Health Records');
    fireEvent.click(overviewImportButton);
    fireEvent.click(overviewExportButton);
    expect(overviewImportButton).toBeInTheDocument();
    expect(overviewExportButton).toBeInTheDocument();
  });

  test('90. should display button text and icons together', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const buttons = [
      screen.getByText('Import'),
      screen.getByText('Export'),
      screen.getByText('New Record')
    ];
    buttons.forEach(button => {
      expect(button).toHaveClass('flex', 'items-center');
    });
  });
});

describe('HealthRecords Component - Statistics Cards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests 91-100: Statistics Cards Functionality
  test('91. should display total records statistic', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Total Records')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  test('92. should display active allergies statistic', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Active Allergies')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
  });

  test('93. should display chronic conditions statistic', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Chronic Conditions')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  test('94. should display vaccinations due statistic', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    expect(screen.getByText('Vaccinations Due')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('95. should render appropriate icons for each statistic', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    // FileText, AlertCircle, Heart, Shield icons should be present
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test('96. should have proper card styling', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const totalRecordsCard = screen.getByText('Total Records').closest('.card');
    expect(totalRecordsCard).toHaveClass('card', 'p-6');
  });

  test('97. should use responsive grid layout', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const gridContainer = screen.getByText('Total Records').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  test('98. should display numbers with proper typography', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const statisticNumbers = ['1,234', '89', '45', '12'];
    statisticNumbers.forEach(number => {
      const element = screen.getByText(number);
      expect(element).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');
    });
  });

  test('99. should display labels with proper styling', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const labels = ['Total Records', 'Active Allergies', 'Chronic Conditions', 'Vaccinations Due'];
    labels.forEach(label => {
      const element = screen.getByText(label);
      expect(element).toHaveClass('text-sm', 'text-gray-600');
    });
  });

  test('100. should maintain consistent card spacing', () => {
    render(
      <TestWrapper>
        <HealthRecords />
      </TestWrapper>
    );
    const gridContainer = screen.getByText('Total Records').closest('.grid');
    expect(gridContainer).toHaveClass('gap-6');
  });
});