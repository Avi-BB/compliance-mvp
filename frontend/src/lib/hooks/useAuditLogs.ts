import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchAuditLogs } from "../slices/auditLogsSlice"

export const useAuditLogs = (filters?: { targetType?: string; targetId?: string; actor?: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.auditLogs)

  useEffect(() => {
    dispatch(fetchAuditLogs(filters))
  }, [dispatch, filters])

  const reload = useCallback(() => {
    dispatch(fetchAuditLogs(filters))
  }, [dispatch, filters])

  return {
    auditLogs: items,
    loading,
    error,
    reload,
  }
}