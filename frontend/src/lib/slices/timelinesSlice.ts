import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Timeline } from "../types"

interface TimelinesState {
  items: Timeline[]
  loading: boolean
  error: string | null
}

const initialState: TimelinesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchTimelines = createAsyncThunk(
  "timelines/fetchAll",
  async (assessmentId?: string) => {
    return await fakeDB.getTimelines(assessmentId)
  }
)

export const createTimeline = createAsyncThunk(
  "timelines/create",
  async (data: Omit<Timeline, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createTimeline(data)
  }
)

export const updateTimeline = createAsyncThunk(
  "timelines/update",
  async ({ id, updates }: { id: string; updates: Partial<Timeline> }) => {
    return await fakeDB.updateTimeline(id, updates)
  }
)

export const deleteTimeline = createAsyncThunk(
  "timelines/delete",
  async (id: string) => {
    await fakeDB.deleteTimeline(id)
    return id
  }
)

const timelinesSlice = createSlice({
  name: "timelines",
  initialState,
  reducers: {
    clearTimelines: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimelines.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTimelines.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTimelines.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch timelines"
      })
      .addCase(createTimeline.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateTimeline.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteTimeline.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload)
      })
  },
})

export const { clearTimelines } = timelinesSlice.actions
export default timelinesSlice.reducer