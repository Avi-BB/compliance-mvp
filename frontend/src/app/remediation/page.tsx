"use client"

import type React from "react"

import { motion } from "framer-motion"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
  CircularProgress,
} from "@mui/material"
import {
  Add,
  PlayArrow,
  CheckCircle,
  Schedule,
  CalendarToday,
  TrendingUp,
  Edit,
  Delete,
  Visibility,
  FilterList,
} from "@mui/icons-material"
import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import {
  fetchRemediationPlans,
  createRemediationPlan,
  updateRemediationPlan,
  deleteRemediationPlan,
} from "@/lib/slices/remediationSlice"
import { PrimaryButton } from "@/lib/utils/styledButton"
import {
  CreateRemediationDialog,
} from "@/components/remediation/CreateRemediationDialog"
import { formatDate } from "@/lib/utils/formatDate"
import type { RemediationAction as RemediationPlan, CreateRemediationPlanForm } from "@/lib/types"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import CommonActionDialog from "@/lib/utils/components/CommonActionDialog"

const getPriorityColor = (priority: string): "error" | "warning" | "info" | "success" | "default" => {
  switch (priority) {
    case "critical":
      return "error"
    case "high":
      return "warning"
    case "medium":
      return "info"
    case "low":
      return "success"
    default:
      return "default"
  }
}

const getStatusColor = (status: string): "success" | "warning" | "default" | "error" | "info"=> {
  switch (status) {
    case "completed":
      return "success"
    case "in-progress":
      return "info"
    case "not-started":
      return "error"
    case "overdue":
      return "warning"
    default:
      return "default"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle />
    case "in-progress":
      return <PlayArrow />
    case "not-started":
      return <Schedule />
    case "overdue":
      return <Schedule />
    default:
      return <Schedule />
  }
}

export default function RemediationPage() {
  const dispatch = useAppDispatch()

  const { remediationData, loading } = useAppSelector((state) => state.remediation)
  const remediationPlans = remediationData ?? []

  const [isMounted, setIsMounted] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingRemediation, setEditingRemediation] = useState<CreateRemediationPlanForm | null>(null)
  const [viewRemediation, setViewRemediation] = useState<RemediationPlan | null>(null)
  const [deleteRemediation, setDeleteRemediation] = useState<RemediationPlan | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [filterPriority, setFilterPriority] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterFramework, setFilterFramework] = useState("")

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    setIsMounted(true)
    dispatch(
      fetchRemediationPlans({
        priority: filterPriority || undefined,
        status: filterStatus || undefined,
        framework: filterFramework || undefined,
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      }),
    )
  }, [dispatch, filterPriority, filterStatus, filterFramework, page, rowsPerPage])

  const isOverdue = (dueDate: string) => isMounted && new Date(dueDate) < new Date()

  const handleRemediationSubmit = (data: CreateRemediationPlanForm) => {
    if (editingRemediation) {
      const planToUpdate = remediationPlans.find(
        (p: any) => p.title === editingRemediation.title && p.description === editingRemediation.description,
      )
      if (planToUpdate) {
        dispatch(updateRemediationPlan({ id: planToUpdate.id, data }))
      }
    } else {
      dispatch(createRemediationPlan(data))
    }
    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTimeout(() => {
      setEditingRemediation(null)
    }, 100)
  }

  const handleOpenCreateDialog = () => {
    setEditingRemediation(null)
    setOpenDialog(true)
  }

  const handleEditClick = (plan: RemediationPlan) => {
    const formData: CreateRemediationPlanForm = {
      findingId: plan.findings?.[0] || "",
      title: plan.title,
      description: plan.description,
      priority: plan.priority as "low" | "medium" | "high" | "critical",
      estimatedEffortHours:
        typeof plan.estimatedEffort === "string"
          ? Number.parseInt(plan.estimatedEffort.replace(/\D/g, "")) || undefined
          : plan.estimatedEffort,
      ownerSuggested: plan.assignee,
      status: plan.status === "in-progress" ? "in_progress" : (plan.status as "pending" | "in_progress" | "completed"),
      dueDate: plan.dueDate,
    }
    setEditingRemediation(formData)
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    if (deleteRemediation) {
      setIsDeleting(true)
      try {
        await dispatch(deleteRemediationPlan(deleteRemediation.id))
        setDeleteRemediation(null)
      } catch (error) {
        console.error("Failed to delete remediation plan:", error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const statCards = [
    {
      title: "Total Plans",
      value: remediationPlans?.length,
      icon: TrendingUp,
      color: "primary.main",
      bgColor: "rgba(69, 56, 202, 0.1)",
      gradient: "linear-gradient(135deg, rgba(69, 56, 202, 0.05) 0%, transparent 100%)",
    },
    {
      title: "Active Plans",
      value: remediationPlans?.filter((p: any) => p.status === "in-progress").length,
      icon: PlayArrow,
      color: "info.main",
      bgColor: "rgba(59, 130, 246, 0.1)",
      gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)",
    },
    {
      title: "Completed Plans",
      value: remediationPlans?.filter((p: any) => p.status === "completed").length,
      icon: CheckCircle,
      color: "success.main",
      bgColor: "rgba(16, 185, 129, 0.1)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
    },
    {
      title: "Overdue Plans",
      value: remediationPlans?.filter((p: any) => isOverdue(p.dueDate) && p.status !== "completed").length,
      icon: Schedule,
      color: "error.main",
      bgColor: "rgba(239, 68, 68, 0.1)",
      gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)",
    },
  ]

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(69, 56, 202, 0.03) 0%, transparent 50%, rgba(16, 185, 129, 0.03) 100%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  Remediation Planning
                </Typography>
                <Chip
                  icon={<Sparkles size={14} />}
                  label="AI-Optimized"
                  size="small"
                  sx={{ bgcolor: "rgba(16, 185, 129, 0.1)", color: "success.main", fontWeight: 600, borderRadius: 2 }}
                />
              </Box>
              <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 700 }}>
                Manage action plans to address compliance findings and reduce risk with AI-powered prioritization
              </Typography>
            </Box>
            <PrimaryButton variant="contained" startIcon={<Add />} onClick={handleOpenCreateDialog}>
              Create Plan
            </PrimaryButton>
          </Box>
        </motion.div>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          {statCards.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    minHeight: 80,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: stat.bgColor,
                    background: stat.gradient,
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography color="textSecondary" variant="body1" sx={{ fontWeight: 500, mb: 1.5 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: stat.bgColor }}>
                      <stat.icon sx={{ color: stat.color }} />
                    </Avatar>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <FilterList />
                <TextField
                  select
                  label="Priority"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Framework"
                  value={filterFramework}
                  onChange={(e) => setFilterFramework(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PCI DSS">PCI DSS</MenuItem>
                  <MenuItem value="GDPR">GDPR</MenuItem>
                  <MenuItem value="ISO 27001">ISO 27001</MenuItem>
                  <MenuItem value="SOX">SOX</MenuItem>
                </TextField>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setFilterPriority("")
                    setFilterStatus("")
                    setFilterFramework("")
                  }}
                  sx={{ py: 0.7 }}
                >
                  Clear Filters
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Remediation Plans
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track progress and manage compliance remediation initiatives
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Assignee</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Framework</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Box sx={{ py: 3 }}>
                            <CircularProgress />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : remediationPlans.length > 0 ? (
                      remediationPlans.map((plan: any) => (
                        <TableRow key={plan.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {plan.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {plan.description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={plan.priority}
                              size="small"
                              color={getPriorityColor(plan.priority)}
                              variant="outlined"
                              sx={{ textTransform: "capitalize" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(plan?.status)}
                              label={plan?.status.replace("-", " ")}
                              size="small"
                              sx={{ textTransform: "capitalize" }}
                              color={getStatusColor(plan?.status)}
                            />
                          </TableCell>
                          <TableCell sx={{ width: 120 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LinearProgress
                                variant="determinate"
                                value={plan.progress}
                                sx={{
                                  flexGrow: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: "grey.200",
                                  "& .MuiLinearProgress-bar": { borderRadius: 3 },
                                }}
                              />
                              <Typography variant="caption" color="textSecondary">
                                {plan.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                                {plan.assignee
                                  .split(" ")
                                  .map((n: any) => n[0])
                                  .join("")}
                              </Avatar>
                              <Typography variant="body2">{plan.assignee}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" color="action" />
                              <Typography
                                variant="body2"
                                color={isOverdue(plan.dueDate) && plan.status !== "completed" ? "error" : "textPrimary"}
                              >
                                {formatDate(plan.dueDate)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={plan.framework} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View">
                              <IconButton size="small" onClick={() => setViewRemediation(plan)}>
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEditClick(plan)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteRemediation(plan)}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No remediation plans found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* TablePagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={remediationPlans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </motion.div>

        <CreateRemediationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleRemediationSubmit}
          editingRemediation={editingRemediation}
        />

        <Dialog
          open={!!viewRemediation}
          onClose={() => setViewRemediation(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Remediation Details</DialogTitle>
          <DialogContent>
            {viewRemediation && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {viewRemediation.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {viewRemediation.description}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Priority:</Typography>
                    <Chip
                      label={viewRemediation.priority}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                      color={getPriorityColor(viewRemediation.priority)}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Chip
                      icon={getStatusIcon(viewRemediation.status)}
                      label={viewRemediation.status.replace("-", " ")}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                      color={getStatusColor(viewRemediation.status)}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Assignee:</Typography>
                    <Typography variant="body2">{viewRemediation.assignee}</Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Due Date:</Typography>
                    <Typography variant="body2">
                      {formatDate(viewRemediation.dueDate)}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Framework:</Typography>
                    <Typography variant="body2">{viewRemediation.framework}</Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Estimated Effort:</Typography>
                    <Typography variant="body2">{viewRemediation.estimatedEffort}</Typography>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2">Findings:</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      {viewRemediation.findings.map((finding, idx) => (
                        <Chip key={idx} label={finding} size="small" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewRemediation(null)}>Close</Button>
          </DialogActions>
        </Dialog>



        {deleteRemediation && (
          <CommonActionDialog
            open={!!deleteRemediation}
            onClose={() => setDeleteRemediation(null)}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Confirm Delete"
            description="Are you sure you want to delete this remediation plan? This action cannot be undone."
            itemName={deleteRemediation.title}
            iconType="delete"
            iconColor="#F44336"
          />
        )}
      </Container>
    </Box>
  )
}
