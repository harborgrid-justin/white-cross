import { useState, useEffect } from 'react'
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
        case 'records':
          const response = await fetch(`/api/health-records/${studentId}${searchQuery ? `?search=${searchQuery}` : ''}`)
          if (response.ok) {
            const data = await response.json()
            setHealthRecords(data.data?.records || [])
          }
          break
        case 'allergies':
          const allergyResponse = await fetch(`/api/health-records/allergies/${studentId}`)
          if (allergyResponse.ok) {
            const allergyData = await allergyResponse.json()
            setAllergies(allergyData.data?.allergies || [])
          }
          break
        case 'chronic':
          const conditionResponse = await fetch(`/api/health-records/chronic-conditions/${studentId}`)
          if (conditionResponse.ok) {
            const conditionData = await conditionResponse.json()
            setChronicConditions(conditionData.data?.conditions || [])
          }
          break
        case 'vaccinations':
          const vaccinationResponse = await fetch(`/api/health-records/vaccinations/${studentId}`)
          if (vaccinationResponse.ok) {
            const vaccinationData = await vaccinationResponse.json()
            setVaccinations(vaccinationData.data?.vaccinations || [])
          }
          break
        case 'growth':
          const growthResponse = await fetch(`/api/health-records/growth/${studentId}`)
          if (growthResponse.ok) {
            const growthData = await growthResponse.json()
            setGrowthMeasurements(growthData.data?.measurements || [])
          }
          break
        case 'screenings':
          const screeningResponse = await fetch(`/api/health-records/vitals/${studentId}`)
          if (screeningResponse.ok) {
            const screeningData = await screeningResponse.json()
            setScreenings(screeningData.data?.screenings || [])
          }
          break
      }
    } catch (error) {
      console.error('Error loading tab data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAllergy = async (allergyData: Partial<Allergy>) => {
    const response = await fetch('/api/health-records/allergies', {
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
    const response = await fetch(`/api/health-records/allergies/${id}`, {
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
    const response = await fetch('/api/health-records/chronic-conditions', {
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
    const response = await fetch('/api/students/1/vaccinations', {
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
    const response = await fetch(`/api/students/1/vaccinations/${id}`, {
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
    const response = await fetch(`/api/students/1/vaccinations/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      loadTabData('vaccinations')
    }
    return response.ok
  }

  const createGrowthMeasurement = async (measurementData: Partial<GrowthMeasurement>) => {
    const response = await fetch('/api/health-records/growth', {
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