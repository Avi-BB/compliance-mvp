"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material"
import { Upload, FileText, AlertCircle } from "lucide-react"
import type { Document } from "../../lib/slices/documentsSlice"
import { PrimaryButton } from "@/lib/utils/styledButton"

interface DocumentUploadProps {
  onUpload: (file: File, metadata: { type: Document["type"]; description?: string }) => void
  isUploading: boolean
}

export function DocumentUpload({ onUpload, isUploading }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<Document["type"]>("regulation")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        setError("File size must be less than 50MB")
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
  })

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, { type: documentType, description })
      setSelectedFile(null)
      setDescription("")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<AlertCircle size={20} />}>
          {error}
        </Alert>
      )}

      {/* File Drop Zone */}
      <Box
        {...getRootProps()}
        sx={{
          border: 2,
          borderColor: isDragActive ? "primary.main" : "grey.300",
          borderStyle: "dashed",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: isDragActive ? "primary.50" : "grey.50",
          transition: "all 0.2s ease",
          mb: 3,
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "primary.50",
          },
        }}
      >
        <input {...getInputProps()} />
        <Upload size={48} color="#6b7280" style={{ marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          {isDragActive ? "Drop the file here" : "Drag & drop a document here"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to select a file
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supports PDF, DOC, DOCX, TXT files up to 50MB
        </Typography>
      </Box>

      {/* Selected File Info */}
      {selectedFile && (
        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <FileText size={24} color="#4338ca" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
          </Box>

          {/* Document Type Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Document Type</InputLabel>
            <Select
              value={documentType}
              label="Document Type"
              onChange={(e) => setDocumentType(e.target.value as Document["type"])}
            >
              <MenuItem value="regulation">Regulation</MenuItem>
              <MenuItem value="policy">Policy</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="vendor_doc">Vendor Document</MenuItem>
              <MenuItem value="audit_letter">Audit Letter</MenuItem>
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            inputProps={{maxLength: 200}}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the document..."
            sx={{ mb: 2 }}
          />

          {/* Upload Button */}
          <PrimaryButton variant="contained" onClick={handleUpload} disabled={isUploading} fullWidth>
            {isUploading ? "Uploading..." : "Upload Document"}
          </PrimaryButton>

          {isUploading && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
      )}
    </Box>
  )
}
