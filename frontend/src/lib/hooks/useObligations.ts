import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchObligations,
  createObligation,
  updateObligation,
  deleteObligation,
} from "../slices/obligationsSlice"
import type { Obligation } from "../types"

export const useObligations = (assessmentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.obligations)

  useEffect(() => {
    dispatch(fetchObligations(assessmentId))
  }, [dispatch, assessmentId])

  const create = useCallback(
    async (data: Omit<Obligation, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createObligation(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Obligation>) => {
      return dispatch(updateObligation({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteObligation(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchObligations(assessmentId))
  }, [dispatch, assessmentId])

  return {
    obligations: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}