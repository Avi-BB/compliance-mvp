"use client"

import type React from "react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  LinearProgress,
  Avatar,
} from "@mui/material"
import { MoreVertical, FileText, Eye, Download, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import type { Document } from "../../lib/slices/documentsSlice"

interface DocumentListProps {
  documents: Document[]
  loading: boolean
}

export function DocumentList({ documents, loading }: DocumentListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    setAnchorEl(event.currentTarget)
    setSelectedDocument(document)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDocument(null)
  }

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "ready":
        return "success"
      case "processing":
        return "warning"
      case "uploading":
        return "info"
      case "error":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "ready":
        return <CheckCircle size={16} />
      case "processing":
        return <Clock size={16} />
      case "uploading":
        return <Clock size={16} />
      case "error":
        return <AlertCircle size={16} />
      default:
        return <FileText size={16} />
    }
  }

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

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Loading documents...
        </Typography>
      </Box>
    )
  }

  if (documents.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <FileText size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No documents uploaded yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your first document to get started with compliance assessment.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Pages</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: getTypeColor(document.type), width: 40, height: 40 }}>
                      <FileText size={20} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {document.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {document.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={document.type.replace("_", " ").toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(document.status)}
                    label={document.status.toUpperCase()}
                    size="small"
                    color={getStatusColor(document.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatFileSize(document.size)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{document.pages || "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(document.uploadedAt), "MMM dd, yyyy")}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, document)}
                    disabled={document.status === "uploading"}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <Eye size={16} style={{ marginRight: 8 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download size={16} style={{ marginRight: 8 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}
