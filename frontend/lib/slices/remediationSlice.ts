import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface RemediationTask {
  id: string
  title: string
  status: "completed" | "in-progress" | "pending"
  assignee?: string
  dueDate?: string
}

export interface RemediationPlan {
  id: string
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  status: "completed" | "in-progress" | "not-started"
  progress: number
  assignee: string
  dueDate: string
  estimatedEffort: string
  framework: string
  findings: string[]
  tasks: RemediationTask[]
  createdAt: string
  updatedAt: string
}

interface RemediationState {
  plans: RemediationPlan[]
  loading: boolean
  error: string | null
}

const initialState: RemediationState = {
  plans: [],
  loading: false,
  error: null,
}

// Async thunks for API calls (mock implementation)
export const fetchRemediationPlans = createAsyncThunk("remediation/fetchPlans", async () => {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: "1",
      title: "Implement Multi-Factor Authentication",
      description: "Deploy MFA across all user accounts to meet PCI DSS requirements",
      priority: "high" as const,
      status: "in-progress" as const,
      progress: 65,
      assignee: "John Smith",
      dueDate: "2024-02-15",
      estimatedEffort: "40 hours",
      framework: "PCI DSS",
      findings: ["REQ-8.2.3", "REQ-8.2.4"],
      tasks: [
        { id: "1a", title: "Select MFA solution", status: "completed" as const },
        { id: "1b", title: "Configure authentication server", status: "in-progress" as const },
        { id: "1c", title: "User training and rollout", status: "pending" as const },
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ]
})

export const createRemediationPlan = createAsyncThunk(
  "remediation/createPlan",
  async (planData: Omit<RemediationPlan, "id" | "createdAt" | "updatedAt">) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newPlan: RemediationPlan = {
      ...planData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newPlan
  },
)

export const updateRemediationPlan = createAsyncThunk(
  "remediation/updatePlan",
  async ({ id, updates }: { id: string; updates: Partial<RemediationPlan> }) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { id, updates: { ...updates, updatedAt: new Date().toISOString() } }
  },
)

export const deleteRemediationPlan = createAsyncThunk("remediation/deletePlan", async (id: string) => {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return id
})

const remediationSlice = createSlice({
  name: "remediation",
  initialState,
  reducers: {
    updateTaskStatus: (
      state,
      action: PayloadAction<{ planId: string; taskId: string; status: RemediationTask["status"] }>,
    ) => {
      const { planId, taskId, status } = action.payload
      const plan = state.plans.find((p) => p.id === planId)
      if (plan) {
        const task = plan.tasks.find((t) => t.id === taskId)
        if (task) {
          task.status = status
          // Recalculate progress
          const completedTasks = plan.tasks.filter((t) => t.status === "completed").length
          plan.progress = Math.round((completedTasks / plan.tasks.length) * 100)
          plan.updatedAt = new Date().toISOString()
        }
      }
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
        state.plans = action.payload
      })
      .addCase(fetchRemediationPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch remediation plans"
      })
      // Create plan
      .addCase(createRemediationPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload)
      })
      // Update plan
      .addCase(updateRemediationPlan.fulfilled, (state, action) => {
        const { id, updates } = action.payload
        const index = state.plans.findIndex((p) => p.id === id)
        if (index !== -1) {
          state.plans[index] = { ...state.plans[index], ...updates }
        }
      })
      // Delete plan
      .addCase(deleteRemediationPlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter((p) => p.id !== action.payload)
      })
  },
})

export const { updateTaskStatus } = remediationSlice.actions
export default remediationSlice.reducer
