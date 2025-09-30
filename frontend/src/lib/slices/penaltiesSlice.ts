import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Penalty } from "../types"

interface PenaltiesState {
  items: Penalty[]
  loading: boolean
  error: string | null
}

const initialState: PenaltiesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchPenalties = createAsyncThunk(
  "penalties/fetchAll",
  async (assessmentId?: string) => {
    return await fakeDB.getPenalties(assessmentId)
  }
)

export const createPenalty = createAsyncThunk(
  "penalties/create",
  async (data: Omit<Penalty, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createPenalty(data)
  }
)

export const updatePenalty = createAsyncThunk(
  "penalties/update",
  async ({ id, updates }: { id: string; updates: Partial<Penalty> }) => {
    return await fakeDB.updatePenalty(id, updates)
  }
)

export const deletePenalty = createAsyncThunk(
  "penalties/delete",
  async (id: string) => {
    await fakeDB.deletePenalty(id)
    return id
  }
)

const penaltiesSlice = createSlice({
  name: "penalties",
  initialState,
  reducers: {
    clearPenalties: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPenalties.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPenalties.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchPenalties.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch penalties"
      })
      .addCase(createPenalty.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updatePenalty.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deletePenalty.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
  },
})

export const { clearPenalties } = penaltiesSlice.actions
export default penaltiesSlice.reducer