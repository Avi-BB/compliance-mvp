import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Clarification } from "../types"

interface ClarificationsState {
  items: Clarification[]
  loading: boolean
  error: string | null
}

const initialState: ClarificationsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchClarifications = createAsyncThunk(
  "clarifications/fetchAll",
  async (assessmentId?: string) => {
    return await fakeDB.getClarifications(assessmentId)
  }
)

export const createClarification = createAsyncThunk(
  "clarifications/create",
  async (data: Omit<Clarification, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createClarification(data)
  }
)

export const updateClarification = createAsyncThunk(
  "clarifications/update",
  async ({ id, updates }: { id: string; updates: Partial<Clarification> }) => {
    return await fakeDB.updateClarification(id, updates)
  }
)

export const deleteClarification = createAsyncThunk(
  "clarifications/delete",
  async (id: string) => {
    await fakeDB.deleteClarification(id)
    return id
  }
)

const clarificationsSlice = createSlice({
  name: "clarifications",
  initialState,
  reducers: {
    clearClarifications: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClarifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClarifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchClarifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch clarifications"
      })
      .addCase(createClarification.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateClarification.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteClarification.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
      })
  },
})

export const { clearClarifications } = clarificationsSlice.actions
export default clarificationsSlice.reducer