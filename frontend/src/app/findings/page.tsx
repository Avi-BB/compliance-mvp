"use client"
import { motion } from "framer-motion"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  Tooltip,
  TablePagination,
  CircularProgress,
} from "@mui/material"
import {
  FindInPage,
  Visibility,
  Edit,
  Delete,
  FilterList,
  Add,
  Warning,
  Error,
  Info,
  CheckCircle,
} from "@mui/icons-material"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { LoadingButton } from "@mui/lab"
import CommonActionDialog from "@/lib/utils/components/CommonActionDialog"
import { createFinding, fetchFindings, updateFinding } from "@/lib/slices/findingsSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import AddFindingDialog from "@/components/findings/AddFindingDialog"
import { CreateFindingRequest, Finding } from "@/lib/api/findings"
import { formatDate } from "@/lib/utils/formatDate"
import { PrimaryButton } from "@/lib/utils/styledButton"

const getSeverityColor = (severity: string) => {
  switch (severity) {
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

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <Error />
    case "high":
      return <Warning />
    case "medium":
      return <Info />
    case "low":
      return <CheckCircle />
    default:
      return <Info />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "error"
    case "in-progress":
      return "warning"
    case "resolved":
      return "success"
    case "closed":
      return "default"
    default:
      return "default"
  }
}


export default function FindingsPage() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterFramework, setFilterFramework] = useState("")

  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [findingToDelete, setFindingToDelete] = useState<Finding | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const dispatch = useAppDispatch()

  const { findings, isFindingsLoading, findingsCount } = useAppSelector((state) => state.findings)

  useEffect(() => {
    dispatch(fetchFindings({
      severity: filterSeverity || undefined,
      status: filterStatus || undefined,
      framework: filterFramework || undefined,
      skip: page * rowsPerPage,
      limit: rowsPerPage,
    }));
  }, [dispatch, filterSeverity, filterStatus, filterFramework, page, rowsPerPage]);

  const onSubmit = async (data: CreateFindingRequest) => {
    try {
      if (editingFinding) {
        await dispatch(updateFinding({ id: editingFinding, ...data }))
      } else {
        await dispatch(createFinding(data))
      }
      dispatch(fetchFindings({}))
      setOpenDialog(false)
      setEditingFinding(null)
    } catch (err) {
      console.error("Unexpected error:", err)
    }
  }

  const handleViewFinding = (finding: Finding) => {
    setSelectedFinding(finding)
  }

  const handleEditFinding = (finding: Finding) => {
    setEditingFinding(finding);
    setOpenDialog(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setOpenDialog(open)
    setEditingFinding(null)
  }

  const severityStats = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  }

  const statCards = [
    {
      label: "Critical",
      value: severityStats.critical,
      icon: Error,
      color: "error.main",
      bgColor: "rgba(239, 68, 68, 0.1)",
      gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)",
    },
    {
      label: "High",
      value: severityStats.high,
      icon: Warning,
      color: "warning.main",
      bgColor: "rgba(245, 158, 11, 0.1)",
      gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)",
    },
    {
      label: "Medium",
      value: severityStats.medium,
      icon: Info,
      color: "info.main",
      bgColor: "rgba(59, 130, 246, 0.1)",
      gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)",
    },
    {
      label: "Low",
      value: severityStats.low,
      icon: CheckCircle,
      color: "success.main",
      bgColor: "rgba(16, 185, 129, 0.1)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
    },
  ]

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(69, 56, 202, 0.03) 0%, transparent 50%, rgba(16, 185, 129, 0.03) 100%)",
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  Findings
                </Typography>
                <Chip
                  icon={<Sparkles size={14} />}
                  label="AI-Detected"
                  size="small"
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "success.main",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
                Track and manage compliance findings with intelligent risk scoring and remediation tracking
              </Typography>
            </Box>
            <PrimaryButton startIcon={<Add />} onClick={() => setOpenDialog(true)}> 
               Add Finding
            </PrimaryButton>
          </Box>
        </motion.div>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          {statCards.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
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
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: stat.color,
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${stat.bgColor}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 500, mb: 1.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: stat.bgColor,
                          display: "inline-flex",
                          flexShrink: 0,
                          ml: 2,
                        }}
                      >
                        <stat.icon sx={{ color: stat.color }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
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
                  label="Severity"
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
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
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
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
                    setFilterSeverity("")
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

        {/* Findings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  All Findings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and track compliance findings across all frameworks
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Finding</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Framework</TableCell>
                      <TableCell>Assignee</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Risk Score</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isFindingsLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Box sx={{ py: 3 }}>
                            <CircularProgress />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : findings.length > 0 ? (
                      findings.map((finding) => (
                        <TableRow key={finding.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {finding.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {finding.category}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getSeverityIcon(finding.severity)}
                              label={finding.severity}
                              color={getSeverityColor(finding.severity)}
                              size="small"
                              sx={{ textTransform: "capitalize" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={finding.status.replace("-", " ")}
                              color={getStatusColor(finding.status)}
                              size="small"
                              onClick={() => {
                                const statuses: Finding["status"][] = ["open", "in-progress", "resolved", "closed"];
                                const currentIndex = statuses.indexOf(finding.status);
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                // Call your update function here
                              }}
                              sx={{ cursor: "pointer", textTransform: "capitalize" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={finding.framework} variant="outlined" size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{finding.assignee}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color={new Date(finding.dueDate) < new Date() ? "error" : "inherit"}
                            >
                              {formatDate(finding.dueDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={finding.riskScore}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: "grey.200",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor:
                                      finding.riskScore >= 80
                                        ? "error.main"
                                        : finding.riskScore >= 60
                                          ? "warning.main"
                                          : "success.main",
                                  },
                                }}
                              />
                              <Typography variant="body2">{finding.riskScore}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {finding.status !== "closed" ? (
                              <>
                                <Tooltip title="View Details">
                                  <IconButton size="small" onClick={() => handleViewFinding(finding)}>
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton size="small" onClick={() => handleEditFinding(finding)}>
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setFindingToDelete(finding);
                                      setOpenDeleteDialog(true);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => handleViewFinding(finding)}>
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No findings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={findingsCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Finding Dialog */}
        <AddFindingDialog
          openDialog={openDialog}
          setOpenDialog={handleCloseDialog}
          editingFinding={editingFinding}
          onSubmitFinding={onSubmit}
        />

        {/* View Finding Dialog */}
        <Dialog open={!!selectedFinding} onClose={() => setSelectedFinding(null)} maxWidth="md" fullWidth>
          <DialogTitle>Finding Details</DialogTitle>
          <DialogContent>
            {selectedFinding && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedFinding.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedFinding.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Severity:</Typography>
                    <Chip
                      icon={getSeverityIcon(selectedFinding.severity)}
                      label={selectedFinding.severity}
                      color={getSeverityColor(selectedFinding.severity)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Chip
                      label={selectedFinding.status.replace("-", " ")}
                      color={getStatusColor(selectedFinding.status)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Framework:</Typography>
                    <Typography variant="body2">{selectedFinding.framework}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Category:</Typography>
                    <Typography variant="body2">{selectedFinding.category}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Assignee:</Typography>
                    <Typography variant="body2">{selectedFinding.assignee}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Due Date:</Typography>
                    <Typography variant="body2">{formatDate(selectedFinding.dueDate)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2">Risk Score:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={selectedFinding.riskScore}
                        sx={{
                          width: 200,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              selectedFinding.riskScore >= 80
                                ? "error.main"
                                : selectedFinding.riskScore >= 60
                                  ? "warning.main"
                                  : "success.main",
                          },
                        }}
                      />
                      <Typography variant="body2">{selectedFinding.riskScore}/100</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedFinding(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>

      {findingToDelete && (
        <CommonActionDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={async () => {
            setIsDeleting(true);

          }}
          isLoading={isDeleting}
          title="Confirm Delete"
          description="Are you sure you want to delete this finding? This action cannot be undone."
          itemName={findingToDelete.title}
          iconType="delete"
          iconColor="#F44336"
        />
      )}

    </Box>
  )
}