import { useState, useEffect } from "react"
import type { Assessment } from "../slices/assessmentsSlice"
import { fakeDB } from "../fake-db"

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  // Load assessments on mount
  const loadAssessments = async () => {
    try {
      setLoading(true)
      const data = await fakeDB.getAssessments()
      setAssessments(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssessments()
  }, [])

  const createAssessment = async (data: Omit<Assessment, "id" | "createdAt" | "tenantId">) => {
    try {
      setIsCreating(true)
      setError(null)
      const newAssessment = await fakeDB.createAssessment(data)
      setAssessments((prev) => [newAssessment, ...prev])
      return newAssessment
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create assessment"
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setIsCreating(false)
    }
  }

  const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      setError(null)
      const updated = await fakeDB.updateAssessment(id, updates)
      setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)))
      return updated
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update assessment"
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const deleteAssessment = async (id: string) => {
    try {
      setError(null)
      await fakeDB.deleteAssessment(id)
      setAssessments((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete assessment"
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const runAssessment = async (id: string) => {
    try {
      setIsRunning(true)
      setError(null)
      // Optimistically update to running
      setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "running" as const } : a)))
      
      const completed = await fakeDB.runAssessment(id)
      setAssessments((prev) => prev.map((a) => (a.id === id ? completed : a)))
      return completed
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to run assessment"
      setError(errorMsg)
      // Revert to draft on error
      setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "draft" as const } : a)))
      throw new Error(errorMsg)
    } finally {
      setIsRunning(false)
    }
  }

  return {
    assessments,
    loading,
    error,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    runAssessment,
    isCreating,
    isRunning,
    refetch: loadAssessments,
  }
}