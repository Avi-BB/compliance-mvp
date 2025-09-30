import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import {
  fetchAttestations,
  createAttestation,
  updateAttestation,
  deleteAttestation,
} from "../slices/attestationsSlice"
import type { Attestation } from "../types"

export const useAttestations = (subjectId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.attestations)

  useEffect(() => {
    dispatch(fetchAttestations(subjectId))
  }, [dispatch, subjectId])

  const create = useCallback(
    async (data: Omit<Attestation, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
      return dispatch(createAttestation(data)).unwrap()
    },
    [dispatch]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Attestation>) => {
      return dispatch(updateAttestation({ id, updates })).unwrap()
    },
    [dispatch]
  )

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteAttestation(id)).unwrap()
    },
    [dispatch]
  )

  const reload = useCallback(() => {
    dispatch(fetchAttestations(subjectId))
  }, [dispatch, subjectId])

  return {
    attestations: items,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  }
}