import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { findingsAPI, type Finding, type CreateFindingRequest, type UpdateFindingRequest } from "../api/findings"

export interface RemediationAction {
  id: string
  findingId: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  estimatedEffortHours?: number
  ownerSuggested?: string
  status: "pending" | "in_progress" | "completed"
  dueDate?: string
}

interface FindingsState {
  findings: Finding[]
  actions: RemediationAction[]
  loading: boolean
  error: string | null
}

const initialState: FindingsState = {
  findings: [],
  actions: [],
  loading: false,
  error: null,
}

export const fetchFindings = createAsyncThunk("findings/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const findings = await findingsAPI.getAll()
    return findings
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch findings")
  }
})

export const createFinding = createAsyncThunk(
  "findings/create",
  async (data: CreateFindingRequest, { rejectWithValue }) => {
    try {
      const finding = await findingsAPI.create(data)
      return finding
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create finding")
    }
  },
)

export const updateFinding = createAsyncThunk(
  "findings/update",
  async (data: UpdateFindingRequest, { rejectWithValue }) => {
    try {
      const finding = await findingsAPI.update(data)
      return finding
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update finding")
    }
  },
)

export const deleteFinding = createAsyncThunk("findings/delete", async (id: string, { rejectWithValue }) => {
  try {
    await findingsAPI.delete(id)
    return id
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete finding")
  }
})

const findingsSlice = createSlice({
  name: "findings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    addAction: (state, action: PayloadAction<RemediationAction>) => {
      state.actions.push(action.payload)
    },
    updateAction: (state, action: PayloadAction<Partial<RemediationAction> & { id: string }>) => {
      const index = state.actions.findIndex((action) => action.id === action.payload.id)
      if (index !== -1) {
        state.actions[index] = { ...state.actions[index], ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch findings
      .addCase(fetchFindings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFindings.fulfilled, (state, action) => {
        state.loading = false
        state.findings = action.payload
      })
      .addCase(fetchFindings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create finding
      .addCase(createFinding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createFinding.fulfilled, (state, action) => {
        state.loading = false
        state.findings.push(action.payload)
      })
      .addCase(createFinding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update finding
      .addCase(updateFinding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFinding.fulfilled, (state, action) => {
        state.loading = false
        const index = state.findings.findIndex((finding) => finding.id === action.payload.id)
        if (index !== -1) {
          state.findings[index] = action.payload
        }
      })
      .addCase(updateFinding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete finding
      .addCase(deleteFinding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFinding.fulfilled, (state, action) => {
        state.loading = false
        state.findings = state.findings.filter((finding) => finding.id !== action.payload)
      })
      .addCase(deleteFinding.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, addAction, updateAction } = findingsSlice.actions
export default findingsSlice.reducer
