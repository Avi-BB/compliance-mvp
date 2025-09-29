import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { addAssessment, setError, setAssessments, updateAssessment } from "../slices/assessmentsSlice"
import type { Assessment } from "../slices/assessmentsSlice"

const mockAssessments: Assessment[] = [
  {
    id: "1",
    name: "Q1 2024 PCI DSS Assessment",
    promptPacks: ["pci_dss", "iso_27001"],
    documentIds: ["1", "2"],
    jurisdiction: "US",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T11:45:00Z",
    tenantId: "tenant_1",
    score: {
      total: 78,
      residualRisk: "Medium",
      familyBreakdown: {
        "Access Control": 85,
        "Data Protection": 70,
        Governance: 60,
        "Incident Response": 90,
        "Third Party": 55,
        "Business Continuity": 65,
      },
    },
  },
  {
    id: "2",
    name: "SOX Compliance Review",
    promptPacks: ["sox"],
    documentIds: ["4"],
    jurisdiction: "US",
    status: "completed",
    createdAt: "2024-01-12T16:45:00Z",
    completedAt: "2024-01-12T17:30:00Z",
    tenantId: "tenant_1",
    score: {
      total: 92,
      residualRisk: "Low",
      familyBreakdown: {
        "Financial Controls": 95,
        "Audit Trail": 88,
        "Access Management": 94,
      },
    },
  },
  {
    id: "3",
    name: "GDPR Privacy Assessment",
    promptPacks: ["gdpr"],
    documentIds: ["3"],
    jurisdiction: "EU",
    status: "running",
    createdAt: "2024-01-20T09:15:00Z",
    tenantId: "tenant_1",
  },
  {
    id: "4",
    name: "Draft: Multi-Framework Review",
    promptPacks: ["pci_dss", "iso_27001", "gdpr"],
    documentIds: ["1", "2", "3"],
    jurisdiction: "US",
    status: "draft",
    createdAt: "2024-01-22T14:20:00Z",
    tenantId: "tenant_1",
  },
]

const fetchAssessments = async (): Promise<Assessment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockAssessments
}

const createAssessment = async (
  assessmentData: Omit<Assessment, "id" | "createdAt" | "tenantId">,
): Promise<Assessment> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newAssessment: Assessment = {
    ...assessmentData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    tenantId: "tenant_1",
  }

  return newAssessment
}

const runAssessment = async (assessmentId: string): Promise<Assessment> => {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const updatedAssessment: Assessment = {
    ...mockAssessments.find((a) => a.id === assessmentId)!,
    status: "completed",
    completedAt: new Date().toISOString(),
    score: {
      total: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      residualRisk: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
      familyBreakdown: {
        "Access Control": Math.floor(Math.random() * 40) + 60,
        "Data Protection": Math.floor(Math.random() * 40) + 60,
        Governance: Math.floor(Math.random() * 40) + 60,
        "Incident Response": Math.floor(Math.random() * 40) + 60,
        "Third Party": Math.floor(Math.random() * 40) + 60,
        "Business Continuity": Math.floor(Math.random() * 40) + 60,
      },
    },
  }

  return updatedAssessment
}

export const useAssessments = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { assessments, loading, error } = useSelector((state: RootState) => state.assessments)

  const assessmentsQuery = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAssessments,
    onSuccess: (data) => {
      dispatch(setAssessments(data))
    },
  })

  const createMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: (newAssessment) => {
      dispatch(addAssessment(newAssessment))
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
    },
    onError: (error: Error) => {
      dispatch(setError(error.message))
    },
  })

  const runMutation = useMutation({
    mutationFn: runAssessment,
    onMutate: async (assessmentId) => {
      // Optimistically update to "running" status
      dispatch(updateAssessment({ id: assessmentId, status: "running" }))
    },
    onSuccess: (updatedAssessment) => {
      dispatch(updateAssessment(updatedAssessment))
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
    },
    onError: (error: Error, assessmentId) => {
      // Revert to draft on error
      dispatch(updateAssessment({ id: assessmentId, status: "failed" }))
      dispatch(setError(error.message))
    },
  })

  return {
    assessments: assessmentsQuery.data || assessments,
    loading: assessmentsQuery.isLoading || loading,
    error: assessmentsQuery.error?.message || error,
    createAssessment: createMutation.mutate,
    runAssessment: runMutation.mutate,
    isCreating: createMutation.isPending,
    isRunning: runMutation.isPending,
  }
}
