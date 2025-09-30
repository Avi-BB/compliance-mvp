import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { documentsAPI, type CreateDocumentRequest, type UpdateDocumentRequest } from "../api/documents"

export interface Document {
  id: string
  name: string
  type: "regulation" | "policy" | "contract" | "vendor_doc" | "audit_letter"
  size: number
  uploadedAt: string
  status: "uploading" | "processing" | "ready" | "error"
  pages?: number
  hash?: string
  storageUri?: string
  tenantId: string
  description?: string
}

interface DocumentsState {
  documents: Document[]
  loading: boolean
  error: string | null
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
}

export const fetchDocuments = createAsyncThunk("documents/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const documents = await documentsAPI.getAll()
    return documents
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch documents")
  }
})

export const createDocument = createAsyncThunk(
  "documents/create",
  async (data: CreateDocumentRequest, { rejectWithValue }) => {
    try {
      const document = await documentsAPI.create(data)
      return document
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create document")
    }
  },
)

export const updateDocument = createAsyncThunk(
  "documents/update",
  async (data: UpdateDocumentRequest, { rejectWithValue }) => {
    try {
      const document = await documentsAPI.update(data)
      return document
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update document")
    }
  },
)

export const deleteDocument = createAsyncThunk("documents/delete", async (id: string, { rejectWithValue }) => {
  try {
    await documentsAPI.delete(id)
    return id
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete document")
  }
})

export const addDocument = createAsyncThunk(
  "documents/add",
  async (data: { document: Document; tenantId: string }, { rejectWithValue }) => {
    try {
      const document = await documentsAPI.add(data.document, data.tenantId)
      return document
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to add document")
    }
  },
)

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateDocumentStatus: (state, action: PayloadAction<{ id: string; status: Document["status"] }>) => {
      const document = state.documents.find((doc) => doc.id === action.payload.id)
      if (document) {
        document.status = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false
        state.documents = action.payload
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create document
      .addCase(createDocument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false
        state.documents.push(action.payload)
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update document
      .addCase(updateDocument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false
        const index = state.documents.findIndex((doc) => doc.id === action.payload.id)
        if (index !== -1) {
          state.documents[index] = action.payload
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false
        state.documents = state.documents.filter((doc) => doc.id !== action.payload)
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, updateDocumentStatus } = documentsSlice.actions
export default documentsSlice.reducer
