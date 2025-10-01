import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { findingsAPI, type Finding, type CreateFindingRequest, type UpdateFindingRequest } from "../api/findings"
import axios from "axios";
import { toast } from "react-hot-toast";
import { mockFindings } from "../api/findings";
import { handleGetAllQueryParamType } from "../types/common";

interface FindingsState {
  findings: Finding[]
  findingsCount: number;
  actions: any[]
  loading: boolean
  error: string | null
  findingsStats: any[]
  isFindingStatsLoading: boolean
  isFindingsLoading: boolean;
  isFindingCreating: boolean
  isFindingUpdating: boolean
  isFindingDeleting: boolean
}

const initialState: FindingsState = {
  findings: mockFindings,
  findingsCount: mockFindings.length,
  findingsStats: [],
  actions: [],
  loading: false,
  error: null,
  isFindingStatsLoading: false,
  isFindingsLoading: false,
  isFindingCreating: false,
  isFindingUpdating: false,
  isFindingDeleting: false,
}

export const fetchFindings = createAsyncThunk(
  "findings/fetchAll",
  async (query: handleGetAllQueryParamType, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${window.location.origin}/api/findings`, {
        params: query,
      });
      return response.data;
    } catch (error: any) {
      console.log("findings list API:Error >>>>", error);
      toast.error(error)
      return rejectWithValue(error.response?.data?.message || "Failed to fetch findings");
    }
  }
);

export const getFindingsStats = createAsyncThunk(
  "findings/fetchStats",
  async (query: handleGetAllQueryParamType) => {
    try {
      const response = await axios.get( `${window.location.origin}/api/findings/stats`,query);
      return response.data;
    } catch (error: any) {
      console.log("findings list API:Error >>>>", error);
      toast.error(error)
    }
  }
);

export const createFinding = createAsyncThunk(
  "findings/create",
  async (data: CreateFindingRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${window.location.origin}/api/findings`, data)
      toast.success("Finding created successfully")
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create finding")
    }
  },
)

export const updateFinding = createAsyncThunk(
  "findings/update",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${window.location.origin}/api/findings/${data.id}`, data)
      toast.success("Finding updated successfully")
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update finding")
    }
  },
)

export const deleteFinding = createAsyncThunk("findings/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${window.location.origin}/api/findings/${id}`)
    toast.success("Finding deleted successfully")
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
    }
  },
  extraReducers: (builder) => {
    // Fetch findings
    builder.addCase(fetchFindings.pending, (state) => {
      state.isFindingsLoading = true
      state.error = null
    })
    builder.addCase(fetchFindings.fulfilled, (state, action) => {
      state.isFindingsLoading = false
      state.findings = action.payload?.data || []
      state.findingsCount = action.payload?.count || 0
    })
    builder.addCase(fetchFindings.rejected, (state, action) => {
      state.isFindingsLoading = false
      state.error = action.payload as string
    })
    // Stats findings
    builder.addCase(getFindingsStats.pending, (state) => {
      state.isFindingStatsLoading = true
      state.error = null
    })
    builder.addCase(getFindingsStats.fulfilled, (state, action) => {
      state.isFindingStatsLoading = false
      state.findingsStats = action.payload
    })
    builder.addCase(getFindingsStats.rejected, (state, action) => {
      state.isFindingStatsLoading = false
      state.error = action.payload as string
    })

    // Create finding
    builder.addCase(createFinding.pending, (state) => {
      state.isFindingCreating = true
      state.error = null
    })
    builder.addCase(createFinding.fulfilled, (state, action) => {
      state.isFindingCreating = false
    })
    builder.addCase(createFinding.rejected, (state, action) => {
      state.isFindingCreating = false
      state.error = action.payload as string
    })

    // Update finding
    builder.addCase(updateFinding.pending, (state) => {
      state.isFindingUpdating = true
      state.error = null
    })
    builder.addCase(updateFinding.fulfilled, (state, action) => {
      state.isFindingUpdating = false
      const index = state.findings.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) {
        state.findings[index] = action.payload
      }
    })
    builder.addCase(updateFinding.rejected, (state, action) => {
      state.isFindingUpdating = false
      state.error = action.payload as string
    })

    // Delete finding
    builder.addCase(deleteFinding.pending, (state) => {
      state.isFindingDeleting = true
      state.error = null
    })
    builder.addCase(deleteFinding.fulfilled, (state, action) => {
      state.isFindingDeleting = false
      state.findings = state.findings.filter((f) => f.id !== action.payload)
    })
    builder.addCase(deleteFinding.rejected, (state, action) => {
      state.isFindingDeleting = false
      state.error = action.payload as string
    })
  },
})

export const { clearError } = findingsSlice.actions
export default findingsSlice.reducer
