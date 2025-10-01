import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { toast } from "react-hot-toast"
import { handleGetAllQueryParamType } from "../types/common"
const mockRemediationData = {
  stats: {
    totalPlans: 15,
    activePlans: 8,
    completedPlans: 7,
    overduePlans: 3,
  },
  plans: [
    {
      id: "1",
      title: "Implement Multi-Factor Authentication",
      description: "Deploy MFA across all user accounts to meet PCI DSS requirements",
      priority: "high",
      status: "in-progress",
      progress: 65,
      assignee: "John Smith",
      dueDate: "2024-02-15",
      estimatedEffort: "40 hours",
      framework: "PCI DSS",
      findings: ["REQ-8.2.3", "REQ-8.2.4"],
      tasks: [
        { id: "1a", title: "Select MFA solution", status: "completed" },
        { id: "1b", title: "Configure authentication server", status: "in-progress" },
        { id: "1c", title: "User training and rollout", status: "pending" },
      ],
    },
    {
      id: "2",
      title: "Data Encryption at Rest Implementation",
      description: "Encrypt sensitive data stored in databases and file systems",
      priority: "critical",
      status: "not-started",
      progress: 0,
      assignee: "Sarah Johnson",
      dueDate: "2024-01-30",
      estimatedEffort: "60 hours",
      framework: "ISO 27001",
      findings: ["A.10.1.1", "A.10.1.2"],
      tasks: [
        { id: "2a", title: "Assess current encryption status", status: "pending" },
        { id: "2b", title: "Implement database encryption", status: "pending" },
        { id: "2c", title: "File system encryption setup", status: "pending" },
      ],
    },
    {
      id: "3",
      title: "Incident Response Plan Update",
      description: "Update and test incident response procedures",
      priority: "medium",
      status: "completed",
      progress: 100,
      assignee: "Mike Davis",
      dueDate: "2024-01-15",
      estimatedEffort: "20 hours",
      framework: "SOX",
      findings: ["CC7.4"],
      tasks: [
        { id: "3a", title: "Review current procedures", status: "completed" },
        { id: "3b", title: "Update response playbooks", status: "completed" },
        { id: "3c", title: "Conduct tabletop exercise", status: "completed" },
      ],
    },
  ],
}

const initialState: any = {
  remediationData: mockRemediationData.plans,
  loading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
}

export const fetchRemediationPlans = createAsyncThunk(
  "remediation/fetchPlans",
  async (query: handleGetAllQueryParamType, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${window.location.origin}/api/remediation`, {
        params: query,
      })
      return response.data
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch remediation plans")
      return rejectWithValue(error.response?.data?.message || "Failed to fetch remediation plans")
    }
  }
)

export const createRemediationPlan = createAsyncThunk(
  "remediation/createPlan",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${window.location.origin}/api/remediation`, data)
      toast.success("Remediation plan created successfully")
      return response.data
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create remediation plan")
      return rejectWithValue(error.response?.data?.message || "Failed to create remediation plan")
    }
  }
)

export const updateRemediationPlan = createAsyncThunk(
  "remediation/updatePlan",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${window.location.origin}/api/remediation/${id}`, data)
      toast.success("Remediation plan updated successfully")
      return response.data
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update remediation plan")
      return rejectWithValue(error.response?.data?.message || "Failed to update remediation plan")
    }
  }
)

export const deleteRemediationPlan = createAsyncThunk(
  "remediation/deletePlan",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${window.location.origin}/api/remediation/${id}`)
      toast.success("Remediation plan deleted successfully")
      return id
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete remediation plan")
      return rejectWithValue(error.response?.data?.message || "Failed to delete remediation plan")
    }
  }
)

// ================== Slice ==================
const remediationSlice = createSlice({
  name: "remediation",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchRemediationPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRemediationPlans.fulfilled, (state, action) => {
        state.loading = false
        state.remediationData = action.payload.data || []
      })
      .addCase(fetchRemediationPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create plan
      .addCase(createRemediationPlan.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createRemediationPlan.fulfilled, (state, action) => {
        state.isCreating = false
        state.plans.push(action.payload)
      })
      .addCase(createRemediationPlan.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })

      // Update plan
      .addCase(updateRemediationPlan.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateRemediationPlan.fulfilled, (state, action) => {
        state.isUpdating = false
        state.remediation = action.payload

      })
      .addCase(updateRemediationPlan.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

      // Delete plan
      .addCase(deleteRemediationPlan.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteRemediationPlan.fulfilled, (state, action) => {
        state.isDeleting = false
      })
      .addCase(deleteRemediationPlan.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload as string
      })
  },
})

export const {  clearError } = remediationSlice.actions
export default remediationSlice.reducer
