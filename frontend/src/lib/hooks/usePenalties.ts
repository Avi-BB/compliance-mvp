import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchPenalties,
  createPenalty,
  updatePenalty,
  deletePenalty,
} from "../slices/penaltiesSlice"
import type { Penalty } from "../types"

export const usePenalties = (assessmentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.penalties)

  useEffect(() => {
    dispatch(fetchPenalties(assessmentId))
  }, [dispatch, assessmentId])

  const create = useCallback(
    async (data: Omit<Penalty, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createPenalty(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Penalty>) => {
      return dispatch(updatePenalty({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deletePenalty(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchPenalties(assessmentId))
  }, [dispatch, assessmentId])

  return {
    penalties: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}