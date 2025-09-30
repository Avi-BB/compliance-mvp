import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Control } from "../types"

interface ControlsState {
  items: Control[]
  loading: boolean
  error: string | null
}

const initialState: ControlsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchControls = createAsyncThunk(
  "controls/fetchAll",
  async (assessmentId?: string) => {
    return await fakeDB.getControls(assessmentId)
  }
)

export const createControl = createAsyncThunk(
  "controls/create",
  async (data: Omit<Control, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createControl(data)
  }
)

export const updateControl = createAsyncThunk(
  "controls/update",
  async ({ id, updates }: { id: string; updates: Partial<Control> }) => {
    return await fakeDB.updateControl(id, updates)
  }
)

export const deleteControl = createAsyncThunk(
  "controls/delete",
  async (id: string) => {
    await fakeDB.deleteControl(id)
    return id
  }
)

const controlsSlice = createSlice({
  name: "controls",
  initialState,
  reducers: {
    clearControls: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchControls.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchControls.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchControls.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch controls"
      })
      .addCase(createControl.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateControl.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteControl.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
      })
  },
})

export const { clearControls } = controlsSlice.actions
export default controlsSlice.reducer