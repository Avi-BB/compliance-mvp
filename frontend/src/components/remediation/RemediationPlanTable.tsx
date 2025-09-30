"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Button,
} from "@mui/material"
import { MoreVertical, CheckCircle, Clock, Play, Download } from "lucide-react"
import type { RemediationAction } from "../../lib/types"

interface RemediationPlanTableProps {
  actions: RemediationAction[]
  onUpdateStatus?: (actionId: string, status: RemediationAction["status"]) => void
}

export function RemediationPlanTable({ actions, onUpdateStatus }: RemediationPlanTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, actionId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedAction(actionId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAction(null)
  }

  const handleStatusChange = (status: RemediationAction["status"]) => {
    if (selectedAction && onUpdateStatus) {
      onUpdateStatus(selectedAction, status)
    }
    handleMenuClose()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0":
        return "error"
      case "P1":
        return "warning"
      case "P2":
        return "info"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "in_progress":
        return "warning"
      case "pending":
        return "default"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} />
      case "in_progress":
        return <Play size={16} />
      case "pending":
        return <Clock size={16} />
      default:
        return null
    }
  }

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case "S":
        return "Small"
      case "M":
        return "Medium"
      case "L":
        return "Large"
      default:
        return effort
    }
  }

  // Group by priority
  const actionsByPriority = {
    P0: actions.filter((a) => a.priority === "P0"),
    P1: actions.filter((a) => a.priority === "P1"),
    P2: actions.filter((a) => a.priority === "P2"),
  }

  return (
    <Box>
      {/* Summary Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Actions
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {actions.length}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Critical (P0)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "error.main" }}>
              {actionsByPriority.P0.length}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              In Progress
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "warning.main" }}>
              {actions.filter((a) => a.status === "in_progress").length}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "success.main" }}>
              {actions.filter((a) => a.status === "completed").length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Actions Table */}
      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Effort</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Solution</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No remediation actions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  actions.map((action) => (
                    <TableRow key={action.id} hover>
                      <TableCell>
                        <Chip label={action.priority} size="small" color={getPriorityColor(action.priority)} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {action.title}
                        </Typography>
                        {action.dependency && (
                          <Typography variant="caption" color="text.secondary">
                            Depends on: {action.dependency}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{action.owner}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={getEffortLabel(action.effort)} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{action.dueBy || "TBD"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={action.status.replace("_", " ")}
                          size="small"
                          color={getStatusColor(action.status)}
                          icon={getStatusIcon(action.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {action.mappedSolution && (
                          <Chip label={action.mappedSolution} size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="More actions">
                          <IconButton size="small" onClick={(e) => handleMenuClick(e, action.id)}>
                            <MoreVertical size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange("in_progress")}>
          <Play size={16} style={{ marginRight: 8 }} />
          Start
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("completed")}>
          <CheckCircle size={16} style={{ marginRight: 8 }} />
          Mark Complete
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("pending")}>
          <Clock size={16} style={{ marginRight: 8 }} />
          Reset to Pending
        </MenuItem>
      </Menu>
    </Box>
  )
}