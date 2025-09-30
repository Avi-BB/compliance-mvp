import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { AuditLog } from "../types"

interface AuditLogsState {
  items: AuditLog[]
  loading: boolean
  error: string | null
}

const initialState: AuditLogsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchAuditLogs = createAsyncThunk(
  "auditLogs/fetchAll",
  async (filters?: { targetType?: string; targetId?: string; actor?: string }) => {
    return await fakeDB.getAuditLogs(filters)
  }
)

const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState,
  reducers: {
    clearAuditLogs: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch audit logs"
      })
  },
})

export const { clearAuditLogs } = auditLogsSlice.actions
export default auditLogsSlice.reducer