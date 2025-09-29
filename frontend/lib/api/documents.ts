import type { Document } from "../slices/documentsSlice"

export interface CreateDocumentRequest {
  name: string
  type: "regulation" | "policy" | "contract" | "vendor_doc" | "audit_letter"
  file: File
}

export interface UpdateDocumentRequest {
  id: string
  name?: string
  type?: "regulation" | "policy" | "contract" | "vendor_doc" | "audit_letter"
}

// Mock API functions - in real app these would call actual endpoints
export const documentsAPI = {
  getAll: async (): Promise<Document[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock documents data
    return [
      {
        id: "1",
        name: "PCI DSS Requirements v4.0",
        type: "regulation",
        size: 2048576,
        uploadedAt: "2024-01-15T10:30:00Z",
        status: "ready",
        pages: 45,
        hash: "abc123",
        tenantId: "tenant1",
      },
      {
        id: "2",
        name: "Data Privacy Policy",
        type: "policy",
        size: 1024000,
        uploadedAt: "2024-01-10T14:20:00Z",
        status: "ready",
        pages: 12,
        hash: "def456",
        tenantId: "tenant1",
      },
      {
        id: "3",
        name: "Vendor Agreement - AWS",
        type: "contract",
        size: 512000,
        uploadedAt: "2024-01-08T09:15:00Z",
        status: "processing",
        pages: 8,
        hash: "ghi789",
        tenantId: "tenant1",
      },
    ]
  },

  create: async (data: CreateDocumentRequest): Promise<Document> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newDocument: Document = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      size: data.file.size,
      uploadedAt: new Date().toISOString(),
      status: "uploading",
      tenantId: "tenant1",
    }

    // Simulate upload progress
    setTimeout(() => {
      // In real app, this would be handled by upload progress callbacks
    }, 2000)

    return newDocument
  },
    add: async (document: Document, tenantId: string): Promise<Document> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In real app, this would associate the document with the tenant in the database
    return { ...document, tenantId }
  },
  update: async (data: UpdateDocumentRequest): Promise<Document> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock updated document
    return {
      id: data.id,
      name: data.name || "Updated Document",
      type: data.type || "policy",
      size: 1024000,
      uploadedAt: "2024-01-15T10:30:00Z",
      status: "ready",
      pages: 10,
      hash: "updated123",
      tenantId: "tenant1",
    }
  },

  delete: async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In real app, this would delete the document from storage and database
    console.log("[v0] Deleting document:", id)
  },

  getById: async (id: string): Promise<Document | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock document lookup
    const documents = await documentsAPI.getAll()
    return documents.find((doc) => doc.id === id) || null
  },
}
