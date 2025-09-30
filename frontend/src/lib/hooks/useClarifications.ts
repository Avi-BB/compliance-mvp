import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchClarifications,
  createClarification,
  updateClarification,
  deleteClarification,
} from "../slices/clarificationsSlice"
import type { Clarification } from "../types"

export const useClarifications = (assessmentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.clarifications)

  useEffect(() => {
    dispatch(fetchClarifications(assessmentId))
  }, [dispatch, assessmentId])

  const create = useCallback(
    async (data: Omit<Clarification, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createClarification(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Clarification>) => {
      return dispatch(updateClarification({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteClarification(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchClarifications(assessmentId))
  }, [dispatch, assessmentId])

  return {
    clarifications: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}