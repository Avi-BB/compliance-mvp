import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
} from "../slices/requirementsSlice"
import type { Requirement } from "../types"

export const useRequirements = (assessmentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.requirements)

  useEffect(() => {
    dispatch(fetchRequirements(assessmentId))
  }, [dispatch, assessmentId])

  const create = useCallback(
    async (data: Omit<Requirement, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createRequirement(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Requirement>) => {
      return dispatch(updateRequirement({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteRequirement(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchRequirements(assessmentId))
  }, [dispatch, assessmentId])

  return {
    requirements: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}