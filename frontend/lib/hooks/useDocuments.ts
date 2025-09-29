import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { addDocument, setError, setDocuments } from "../slices/documentsSlice"
import type { Document } from "../slices/documentsSlice"

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "PCI DSS Requirements v4.0.pdf",
    type: "regulation",
    size: 2048000,
    uploadedAt: "2024-01-15T10:30:00Z",
    status: "ready",
    pages: 45,
    tenantId: "tenant_1",
    hash: "abc123",
  },
  {
    id: "2",
    name: "Third Party Vendor Agreement.pdf",
    type: "contract",
    size: 1024000,
    uploadedAt: "2024-01-14T14:20:00Z",
    status: "ready",
    pages: 12,
    tenantId: "tenant_1",
    hash: "def456",
  },
  {
    id: "3",
    name: "ISO 27001 Controls.docx",
    type: "policy",
    size: 756000,
    uploadedAt: "2024-01-13T09:15:00Z",
    status: "processing",
    pages: 28,
    tenantId: "tenant_1",
  },
  {
    id: "4",
    name: "SOX Compliance Audit Letter.pdf",
    type: "audit_letter",
    size: 512000,
    uploadedAt: "2024-01-12T16:45:00Z",
    status: "ready",
    pages: 8,
    tenantId: "tenant_1",
    hash: "ghi789",
  },
]

const fetchDocuments = async (): Promise<Document[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockDocuments
}

const uploadDocument = async (
  file: File,
  metadata: { type: Document["type"]; description?: string },
): Promise<Document> => {
  // Simulate upload with progress
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const newDoc: Document = {
    id: Date.now().toString(),
    name: file.name,
    type: metadata.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    status: "ready",
    tenantId: "tenant_1",
    hash: Math.random().toString(36).substring(7),
  }

  return newDoc
}

export const useDocuments = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { documents, loading, error } = useSelector((state: RootState) => state.documents)

  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    onSuccess: (data) => {
      //dispatch(setDocuments(data))
    },
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: { type: Document["type"]; description?: string } }) =>
      uploadDocument(file, metadata),
    onSuccess: (newDocument) => {
     // dispatch(addDocument(newDocument))
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
    onError: (error: Error) => {
     // dispatch(setError(error.message))
    },
  })

  return {
    documents: documentsQuery.data || documents,
    loading: documentsQuery.isLoading || loading,
    error: documentsQuery.error?.message || error,
    uploadDocument: (file: File, metadata?: { type: Document["type"]; description?: string }) =>
      uploadMutation.mutate({ file, metadata: metadata || { type: "regulation" } }),
    isUploading: uploadMutation.isPending,
  }
}
