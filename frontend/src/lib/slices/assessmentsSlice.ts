import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Assessment {
  id: string
  name: string
  promptPacks: string[]
  documentIds: string[]
  jurisdiction?: string
  status: "draft" | "running" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  tenantId: string
  score?: {
    total: number
    residualRisk: "Low" | "Medium" | "High" | "Critical"
    familyBreakdown: Record<string, number>
  }
}

interface AssessmentsState {
  assessments: Assessment[]
  currentAssessment: Assessment | null
  loading: boolean
  error: string | null
}

const initialState: AssessmentsState = {
  assessments: [],
  currentAssessment: null,
  loading: false,
  error: null,
}

const assessmentsSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    setAssessments: (state, action: PayloadAction<Assessment[]>) => {
      state.assessments = action.payload
    },
    addAssessment: (state, action: PayloadAction<Assessment>) => {
      state.assessments.push(action.payload)
    },
    updateAssessment: (state, action: PayloadAction<Partial<Assessment> & { id: string }>) => {
      const index = state.assessments.findIndex((assessment) => assessment.id === action.payload.id)
      if (index !== -1) {
        state.assessments[index] = { ...state.assessments[index], ...action.payload }
      }
      if (state.currentAssessment?.id === action.payload.id) {
        state.currentAssessment = { ...state.currentAssessment, ...action.payload }
      }
    },
    setCurrentAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.currentAssessment = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setAssessments, addAssessment, updateAssessment, setCurrentAssessment, setLoading, setError } =
  assessmentsSlice.actions
export default assessmentsSlice.reducer
