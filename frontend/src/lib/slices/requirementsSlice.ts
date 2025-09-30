import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Requirement } from "../types"

interface RequirementsState {
  items: Requirement[]
  loading: boolean
  error: string | null
}

const initialState: RequirementsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchRequirements = createAsyncThunk(
  "requirements/fetchAll",
  async (assessmentId?: string) => {
    return await fakeDB.getRequirements(assessmentId)
  }
)

export const createRequirement = createAsyncThunk(
  "requirements/create",
  async (data: Omit<Requirement, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createRequirement(data)
  }
)

export const updateRequirement = createAsyncThunk(
  "requirements/update",
  async ({ id, updates }: { id: string; updates: Partial<Requirement> }) => {
    return await fakeDB.updateRequirement(id, updates)
  }
)

export const deleteRequirement = createAsyncThunk(
  "requirements/delete",
  async (id: string) => {
    await fakeDB.deleteRequirement(id)
    return id
  }
)

const requirementsSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {
    clearRequirements: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequirements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRequirements.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchRequirements.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch requirements"
      })
      .addCase(createRequirement.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateRequirement.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteRequirement.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload)
      })
  },
})

export const { clearRequirements } = requirementsSlice.actions
export default requirementsSlice.reducer