import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchControls,
  createControl,
  updateControl,
  deleteControl,
} from "../slices/controlsSlice"
import type { Control } from "../types"

export const useControls = (assessmentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.controls)

  useEffect(() => {
    dispatch(fetchControls(assessmentId))
  }, [dispatch, assessmentId])

  const create = useCallback(
    async (data: Omit<Control, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createControl(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Control>) => {
      return dispatch(updateControl({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteControl(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchControls(assessmentId))
  }, [dispatch, assessmentId])

  return {
    controls: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}