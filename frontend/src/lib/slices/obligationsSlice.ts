import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Obligation } from "../types"

interface ObligationsState {
  items: Obligation[]
  loading: boolean
  error: string | null
}

const initialState: ObligationsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchObligations = createAsyncThunk(
  "obligations/fetchAll",
  async (assessmentId?: string) => {
    return await fakeDB.getObligations(assessmentId)
  }
)

export const createObligation = createAsyncThunk(
  "obligations/create",
  async (data: Omit<Obligation, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createObligation(data)
  }
)

export const updateObligation = createAsyncThunk(
  "obligations/update",
  async ({ id, updates }: { id: string; updates: Partial<Obligation> }) => {
    return await fakeDB.updateObligation(id, updates)
  }
)

export const deleteObligation = createAsyncThunk(
  "obligations/delete",
  async (id: string) => {
    await fakeDB.deleteObligation(id)
    return id
  }
)

const obligationsSlice = createSlice({
  name: "obligations",
  initialState,
  reducers: {
    clearObligations: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchObligations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchObligations.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchObligations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch obligations"
      })
      .addCase(createObligation.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateObligation.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteObligation.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o.id !== action.payload)
      })
  },
})

export const { clearObligations } = obligationsSlice.actions
export default obligationsSlice.reducer