import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  TabType,
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  GrowthMeasurement,
  Screening
} from '@/types/healthRecords'

export const useHealthRecordsData = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [chronicConditions, setChronicConditions] = useState<ChronicCondition[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [growthMeasurements, setGrowthMeasurements] = useState<GrowthMeasurement[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(false)

  const loadTabData = async (tab: TabType, studentId: string = '1', searchQuery?: string) => {
    setLoading(true)
    
    try {
      switch (tab) {
        case 'records': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.STUDENT(studentId)}${searchQuery ? `?search=${searchQuery}` : ''}`
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            setHealthRecords(data.data?.records || [])
          }
          break
        }
        case 'allergies': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.ALLERGIES(studentId)}`
          const allergyResponse = await fetch(url)
          if (allergyResponse.ok) {
            const allergyData = await allergyResponse.json()
            setAllergies(allergyData.data?.allergies || [])
          }
          break
        }
        case 'chronic': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.CHRONIC_CONDITIONS(studentId)}`
          const conditionResponse = await fetch(url)
          if (conditionResponse.ok) {
            const conditionData = await conditionResponse.json()
            setChronicConditions(conditionData.data?.conditions || [])
          }
          break
        }
        case 'vaccinations': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.VACCINATIONS(studentId)}`
          const vaccinationResponse = await fetch(url)
          if (vaccinationResponse.ok) {
            const vaccinationData = await vaccinationResponse.json()
            setVaccinations(vaccinationData.data?.vaccinations || [])
          }
          break
        }
        case 'growth': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.GROWTH_CHART(studentId)}`
          const growthResponse = await fetch(url)
          if (growthResponse.ok) {
            const growthData = await growthResponse.json()
            setGrowthMeasurements(growthData.data?.measurements || [])
          }
          break
        }
        case 'screenings': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.VITALS(studentId)}`
          const screeningResponse = await fetch(url)
          if (screeningResponse.ok) {
            const screeningData = await screeningResponse.json()
            setScreenings(screeningData.data?.screenings || [])
          }
          break
        }
      }
    } catch (error) {
      console.error('Error loading tab data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAllergy = async (allergyData: Partial<Allergy>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/allergies`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', ...allergyData })
    })
    if (response.ok) {
      loadTabData('allergies')
    }
    return response.ok
  }

  const updateAllergy = async (id: string, allergyData: Partial<Allergy>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/allergies/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allergyData)
    })
    if (response.ok) {
      loadTabData('allergies')
    }
    return response.ok
  }

  const createCondition = async (conditionData: Partial<ChronicCondition>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/chronic-conditions`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', ...conditionData })
    })
    if (response.ok) {
      loadTabData('chronic')
    }
    return response.ok
  }

  const createVaccination = async (vaccinationData: Partial<Vaccination>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.BASE}/1/vaccinations`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccinationData)
    })
    if (response.ok) {
      loadTabData('vaccinations')
    }
    return response.ok
  }

  const updateVaccination = async (id: string, vaccinationData: Partial<Vaccination>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.BASE}/1/vaccinations/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccinationData)
    })
    if (response.ok) {
      loadTabData('vaccinations')
    }
    return response.ok
  }

  const deleteVaccination = async (id: string) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.BASE}/1/vaccinations/${id}`
    const response = await fetch(url, {
      method: 'DELETE'
    })
    if (response.ok) {
      loadTabData('vaccinations')
    }
    return response.ok
  }

  const createGrowthMeasurement = async (measurementData: Partial<GrowthMeasurement>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/growth`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', ...measurementData })
    })
    if (response.ok) {
      loadTabData('growth')
    }
    return response.ok
  }

  return {
    // Data
    healthRecords,
    allergies,
    chronicConditions,
    vaccinations,
    growthMeasurements,
    screenings,
    loading,
    
    // Actions
    loadTabData,
    createAllergy,
    updateAllergy,
    createCondition,
    createVaccination,
    updateVaccination,
    deleteVaccination,
    createGrowthMeasurement,
  }
}
