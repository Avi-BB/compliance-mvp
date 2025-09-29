import { useAppDispatch, useAppSelector } from "./index"
import {
  fetchRemediationPlans,
  createRemediationPlan,
  updateRemediationPlan,
  deleteRemediationPlan,
  updateTaskStatus,
  type RemediationPlan,
  type RemediationTask,
} from "../slices/remediationSlice"

export const useRemediation = () => {
  const dispatch = useAppDispatch()
  const { plans, loading, error } = useAppSelector((state) => state.remediation)

  const loadPlans = () => {
    dispatch(fetchRemediationPlans())
  }

  const createPlan = (planData: Omit<RemediationPlan, "id" | "createdAt" | "updatedAt">) => {
    return dispatch(createRemediationPlan(planData))
  }

  const updatePlan = (id: string, updates: Partial<RemediationPlan>) => {
    return dispatch(updateRemediationPlan({ id, updates }))
  }

  const deletePlan = (id: string) => {
    return dispatch(deleteRemediationPlan(id))
  }

  const updateTask = (planId: string, taskId: string, status: RemediationTask["status"]) => {
    dispatch(updateTaskStatus({ planId, taskId, status }))
  }

  const getStats = () => {
    const totalPlans = plans.length
    const activePlans = plans.filter((p) => p.status === "in-progress").length
    const completedPlans = plans.filter((p) => p.status === "completed").length
    const overduePlans = plans.filter((p) => new Date(p.dueDate) < new Date() && p.status !== "completed").length

    return {
      totalPlans,
      activePlans,
      completedPlans,
      overduePlans,
    }
  }

  return {
    plans,
    loading,
    error,
    loadPlans,
    createPlan,
    updatePlan,
    deletePlan,
    updateTask,
    getStats,
  }
}
