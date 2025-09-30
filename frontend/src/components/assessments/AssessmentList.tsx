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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { MoreVertical, Play, Eye, Download, Trash2, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { format } from "date-fns"
import type { Assessment } from "../../lib/slices/assessmentsSlice"
import Link from "next/link"

interface AssessmentListProps {
  assessments: Assessment[]
  loading: boolean
  onRunAssessment: (assessmentId: string) => void
  onDeleteAssessment?: (assessmentId: string) => void
}

export function AssessmentList({ assessments, loading, onRunAssessment, onDeleteAssessment }: AssessmentListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, assessment: Assessment) => {
    setAnchorEl(event.currentTarget)
    setSelectedAssessment(assessment)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAssessment(null)
  }

  const handleDeleteClick = () => {
    setAnchorEl(null)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedAssessment || !onDeleteAssessment) return
    
    try {
      setDeleting(true)
      await onDeleteAssessment(selectedAssessment.id)
      setDeleteDialogOpen(false)
      setSelectedAssessment(null)
    } catch (error) {
      console.error("Failed to delete assessment:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedAssessment(null)
  }

  const getStatusColor = (status: Assessment["status"]) => {
    switch (status) {
      case "completed":
        return "success"
      case "running":
        return "warning"
      case "draft":
        return "default"
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: Assessment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} />
      case "running":
        return <Clock size={16} />
      case "draft":
        return <FileText size={16} />
      case "failed":
        return <AlertCircle size={16} />
      default:
        return <FileText size={16} />
    }
  }

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "Low":
        return "#059669"
      case "Medium":
        return "#d97706"
      case "High":
        return "#dc2626"
      case "Critical":
        return "#7c2d12"
      default:
        return "#6b7280"
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Loading assessments...
        </Typography>
      </Box>
    )
  }

  if (assessments.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <FileText size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No assessments created yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first compliance assessment to get started.
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
              <TableCell>Assessment</TableCell>
              <TableCell>Prompt Packs</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                      <FileText size={20} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {assessment.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assessment.documentIds.length} documents • {assessment.jurisdiction || "No jurisdiction"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {assessment.promptPacks.slice(0, 2).map((pack) => (
                      <Chip key={pack} label={pack.toUpperCase()} size="small" variant="outlined" />
                    ))}
                    {assessment.promptPacks.length > 2 && (
                      <Chip label={`+${assessment.promptPacks.length - 2}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(assessment.status)}
                    label={assessment.status.toUpperCase()}
                    size="small"
                    color={getStatusColor(assessment.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {assessment.score ? (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {assessment.score.total}%
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {assessment.score?.residualRisk ? (
                    <Chip
                      label={assessment.score.residualRisk}
                      size="small"
                      sx={{
                        bgcolor: getRiskColor(assessment.score.residualRisk),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(assessment.createdAt), "MMM dd, yyyy")}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {assessment.status === "draft" && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Play size={14} />}
                        onClick={() => onRunAssessment(assessment.id)}
                      >
                        Run
                      </Button>
                    )}
                    {assessment.status === "completed" && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Eye size={14} />}
                        component={Link}
                        href={`/assessments/${assessment.id}`}
                      >
                        View
                      </Button>
                    )}
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, assessment)}>
                      <MoreVertical size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedAssessment?.status === "completed" && (
          <MenuItem
            component={Link}
            href={`/assessments/${selectedAssessment.id}`}
            onClick={handleMenuClose}
          >
            <Eye size={16} style={{ marginRight: 8 }} />
            View Details
          </MenuItem>
        )}
        {selectedAssessment?.status === "completed" && (
          <MenuItem onClick={handleMenuClose}>
            <Download size={16} style={{ marginRight: 8 }} />
            Export Results
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Assessment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedAssessment?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}