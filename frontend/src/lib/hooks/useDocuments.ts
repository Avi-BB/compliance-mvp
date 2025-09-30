import { useState, useEffect } from "react"
import type { Document } from "../slices/documentsSlice"
import { fakeDB } from "../fake-db"

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await fakeDB.getDocuments()
      setDocuments(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const uploadDocument = async (file: File, metadata: { type: Document["type"]; description?: string }) => {
    try {
      setIsUploading(true)
      setError(null)
      const newDoc = await fakeDB.createDocument(file, metadata)
      setDocuments((prev) => [newDoc, ...prev])
      return newDoc
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload document"
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      setError(null)
      const updated = await fakeDB.updateDocument(id, updates)
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)))
      return updated
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update document"
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      setError(null)
      await fakeDB.deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete document"
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }

  return {
    documents,
    loading,
    error,
    uploadDocument,
    updateDocument,
    deleteDocument,
    isUploading,
    refetch: loadDocuments,
  }
}