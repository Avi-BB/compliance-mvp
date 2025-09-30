"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, Avatar, Divider } from "@mui/material"
import { format } from "date-fns"
import { FileText } from "lucide-react"
import type { Document } from "../../lib/slices/documentsSlice"

interface DocumentViewDialogProps {
  open: boolean
  document: Document | null
  onClose: () => void
}

export function DocumentViewDialog({ open, document, onClose }: DocumentViewDialogProps) {
  if (!document) return null

  const getTypeColor = (type: Document["type"]) => {
    switch (type) {
      case "regulation":
        return "#4338ca"
      case "policy":
        return "#059669"
      case "contract":
        return "#d97706"
      case "vendor_doc":
        return "#7c3aed"
      case "audit_letter":
        return "#dc2626"
      default:
        return "#6b7280"
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      {/* Header */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* <Avatar sx={{ bgcolor: getTypeColor(document.type), width: 48, height: 48 }}>
          <DocumentText size={24} />
        </Avatar> */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {document.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Document ID: {document.id}
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          <Chip
            label={`Type: ${document.type.replace("_", " ").toUpperCase()}`}
            size="small"
            sx={{ bgcolor: "#f3f4f6", fontWeight: 500 }}
          />
          <Chip
            label={`Pages: ${document.pages || "-"}`}
            size="small"
            sx={{ bgcolor: "#f3f4f6", fontWeight: 500 }}
          />
          <Chip
            label={`Size: ${formatFileSize(document.size)}`}
            size="small"
            sx={{ bgcolor: "#f3f4f6", fontWeight: 500 }}
          />
          <Chip
            label={`Uploaded: ${format(new Date(document.uploadedAt), "MMM dd, yyyy")}`}
            size="small"
            sx={{ bgcolor: "#f3f4f6", fontWeight: 500 }}
          />
        </Box>

        {document.description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {document.description}
            </Typography>
          </Box>
        )}

        
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {/* <Button onClick={() => alert("Download placeholder")} variant="contained">
          Download
        </Button> */}
      </DialogActions>
    </Dialog>
  )
}
