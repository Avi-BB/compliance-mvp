import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fakeDB } from "../fake-db"
import type { Attestation } from "../types"

interface AttestationsState {
  items: Attestation[]
  loading: boolean
  error: string | null
}

const initialState: AttestationsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchAttestations = createAsyncThunk(
  "attestations/fetchAll",
  async (subjectId?: string) => {
    return await fakeDB.getAttestations(subjectId)
  }
)

export const createAttestation = createAsyncThunk(
  "attestations/create",
  async (data: Omit<Attestation, "id" | "tenantId" | "createdAt" | "updatedAt">) => {
    return await fakeDB.createAttestation(data)
  }
)

export const updateAttestation = createAsyncThunk(
  "attestations/update",
  async ({ id, updates }: { id: string; updates: Partial<Attestation> }) => {
    return await fakeDB.updateAttestation(id, updates)
  }
)

export const deleteAttestation = createAsyncThunk(
  "attestations/delete",
  async (id: string) => {
    await fakeDB.deleteAttestation(id)
    return id
  }
)

const attestationsSlice = createSlice({
  name: "attestations",
  initialState,
  reducers: {
    clearAttestations: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttestations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttestations.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAttestations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch attestations"
      })
      .addCase(createAttestation.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateAttestation.fulfilled, (state, action) => {
        const index = state.items.findIndex((a) => a.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteAttestation.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload)
      })
  },
})

export const { clearAttestations } = attestationsSlice.actions
export default attestationsSlice.reducer