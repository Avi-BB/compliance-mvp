import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "../slices/timelinesSlice"
import type { Timeline } from "../types"

export const useTimelines = (assessmentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.timelines)

  useEffect(() => {
    dispatch(fetchTimelines(assessmentId))
  }, [dispatch, assessmentId])

  const create = useCallback(
    async (data: Omit<Timeline, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createTimeline(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Timeline>) => {
      return dispatch(updateTimeline({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteTimeline(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchTimelines(assessmentId))
  }, [dispatch, assessmentId])

  return {
    timelines: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}