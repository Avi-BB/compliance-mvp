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
  TablePagination,
  TableFooter,
} from "@mui/material"
import { MoreVertical, FileText, Eye, Download, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import type { Document } from "../../lib/slices/documentsSlice"
import { DocumentViewDialog } from "./DocumentViewDialog"
import { ConfirmationDialog } from "../common/ConfirmationDialog"

interface DocumentListProps {
  documents: Document[]
  loading: boolean
}

export function DocumentList({ documents, loading }: DocumentListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
const [confirmationAction, setConfirmationAction] = useState<"delete" | "download" | null>(null)
const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    setAnchorEl(event.currentTarget)
    setSelectedDocument(document);
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    // setSelectedDocument(null)
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
  const paginatedDocuments = documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
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
            {paginatedDocuments.map((document) => (
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
           <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={documents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem   onClick={() => {
      setViewDialogOpen(true)
      handleMenuClose()
    }}>
          <Eye size={16} style={{ marginRight: 8 }} />
          View Details
        </MenuItem>
        {/* <MenuItem onClick={() => {
      setConfirmationAction("download")
      setConfirmationDialogOpen(true)
      handleMenuClose()
    }}>
          <Download size={16} style={{ marginRight: 8 }} />
          Download
        </MenuItem>
        <MenuItem onClick={() => {
      setConfirmationAction("delete")
      setConfirmationDialogOpen(true)
      handleMenuClose()
    }} sx={{ color: "error.main" }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem> */}
      </Menu>

      <DocumentViewDialog
  open={viewDialogOpen}
  document={selectedDocument}
  onClose={() => setViewDialogOpen(false)}
/>

<ConfirmationDialog
  open={confirmationDialogOpen}
  title={confirmationAction === "delete" ? "Delete Document?" : "Download Document?"}
  message={`Are you sure you want to ${
    confirmationAction === "delete" ? "delete" : "download"
  } this document?`}
  onCancel={() => setConfirmationDialogOpen(false)}
  // onConfirm={() => {
  //   if (confirmationAction === "delete" && selectedDocument) deleteDocument(selectedDocument.id)
  //   if (confirmationAction === "download" && selectedDocument) downloadDocument(selectedDocument.id)
  //   setConfirmationDialogOpen(false)
  // }}
/>
    </>
  )
}
