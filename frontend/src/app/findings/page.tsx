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

interface Finding {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved" | "closed"
  framework: string
  category: string
  assignee: string
  dueDate: string
  createdDate: string
  riskScore: number
}

interface FindingFormData {
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  framework: string
  category: string
  assignee: string
  dueDate: string
}

const mockFindings: Finding[] = [
  {
    id: "1",
    title: "Inadequate Access Control Implementation",
    description: "User access controls do not meet PCI DSS requirements for privileged access management.",
    severity: "critical",
    status: "open",
    framework: "PCI DSS",
    category: "Access Control",
    assignee: "John Smith",
    dueDate: "2024-02-15",
    createdDate: "2024-01-15",
    riskScore: 95,
  },
  {
    id: "2",
    title: "Missing Data Encryption at Rest",
    description: "Sensitive customer data is not encrypted when stored in the database.",
    severity: "high",
    status: "in-progress",
    framework: "GDPR",
    category: "Data Protection",
    assignee: "Sarah Johnson",
    dueDate: "2024-02-20",
    createdDate: "2024-01-10",
    riskScore: 85,
  },
  {
    id: "3",
    title: "Incomplete Incident Response Documentation",
    description: "Incident response procedures lack detailed escalation protocols.",
    severity: "medium",
    status: "resolved",
    framework: "ISO 27001",
    category: "Incident Response",
    assignee: "Mike Davis",
    dueDate: "2024-01-30",
    createdDate: "2024-01-05",
    riskScore: 65,
  },
  {
    id: "4",
    title: "Outdated Security Awareness Training",
    description: "Employee security training materials are over 12 months old.",
    severity: "low",
    status: "open",
    framework: "ISO 27001",
    category: "Training",
    assignee: "Lisa Wilson",
    dueDate: "2024-03-01",
    createdDate: "2024-01-20",
    riskScore: 35,
  },
]

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

// Locale-stable date formatter to prevent hydration mismatches
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso))

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>(mockFindings)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterFramework, setFilterFramework] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FindingFormData>()

  const filteredFindings = findings.filter((finding) => {
    return (
      (!filterSeverity || finding.severity === filterSeverity) &&
      (!filterStatus || finding.status === filterStatus) &&
      (!filterFramework || finding.framework === filterFramework)
    )
  })

  const onSubmit = async (data: FindingFormData) => {
    console.log("[v0] Finding data:", data)
    const newFinding: Finding = {
      id: Date.now().toString(),
      ...data,
      status: "open",
      createdDate: new Date().toISOString().split("T")[0],
      riskScore:
        data.severity === "critical" ? 95 : data.severity === "high" ? 80 : data.severity === "medium" ? 60 : 30,
    }
    setFindings([...findings, newFinding])
    setOpenDialog(false)
    reset()
  }

  const handleViewFinding = (finding: Finding) => {
    setSelectedFinding(finding)
  }

  const handleDeleteFinding = (id: string) => {
    setFindings(findings.filter((f) => f.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: Finding["status"]) => {
    setFindings(findings.map((f) => (f.id === id ? { ...f, status: newStatus } : f)))
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
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => setOpenDialog(true)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                boxShadow: "0 4px 12px rgba(69, 56, 202, 0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg, rgba(59, 46, 172, 1) 0%, rgba(14, 165, 115, 1) 100%)",
                  boxShadow: "0 6px 20px rgba(69, 56, 202, 0.35)",
                },
              }}
            >
              Add Finding
            </Button>
          </Box>
        </motion.div>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    minHeight: 160,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
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
                        <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
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
                        <stat.icon style={{ color: stat.color }} />
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
                  onClick={() => {
                    setFilterSeverity("")
                    setFilterStatus("")
                    setFilterFramework("")
                  }}
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
                    {filteredFindings.map((finding) => (
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
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={finding.status.replace("-", " ")}
                            color={getStatusColor(finding.status)}
                            size="small"
                            onClick={() => {
                              const statuses: Finding["status"][] = ["open", "in-progress", "resolved", "closed"]
                              const currentIndex = statuses.indexOf(finding.status)
                              const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                              handleStatusChange(finding.id, nextStatus)
                            }}
                            sx={{ cursor: "pointer" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={finding.framework} variant="outlined" size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{finding.assignee}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={isMounted && new Date(finding.dueDate) < new Date() ? "error" : "inherit"}>
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
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewFinding(finding)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteFinding(finding.id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Finding Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Finding</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    {...register("title", { required: "Title is required" })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    {...register("description", { required: "Description is required" })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Severity"
                    error={!!errors.severity}
                    helperText={errors.severity?.message}
                    {...register("severity", { required: "Severity is required" })}
                  >
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Framework"
                    error={!!errors.framework}
                    helperText={errors.framework?.message}
                    {...register("framework", { required: "Framework is required" })}
                  >
                    <MenuItem value="PCI DSS">PCI DSS</MenuItem>
                    <MenuItem value="GDPR">GDPR</MenuItem>
                    <MenuItem value="ISO 27001">ISO 27001</MenuItem>
                    <MenuItem value="SOX">SOX</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    {...register("category", { required: "Category is required" })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Assignee"
                    error={!!errors.assignee}
                    helperText={errors.assignee?.message}
                    {...register("assignee", { required: "Assignee is required" })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    {...register("dueDate", { required: "Due date is required" })}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit(onSubmit)}
              sx={{
                background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, rgba(59, 46, 172, 1) 0%, rgba(14, 165, 115, 1) 100%)",
                },
              }}
            >
              Add Finding
            </Button>
          </DialogActions>
        </Dialog>

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
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Severity:</Typography>
                    <Chip
                      icon={getSeverityIcon(selectedFinding.severity)}
                      label={selectedFinding.severity}
                      color={getSeverityColor(selectedFinding.severity)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Chip
                      label={selectedFinding.status.replace("-", " ")}
                      color={getStatusColor(selectedFinding.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Framework:</Typography>
                    <Typography variant="body2">{selectedFinding.framework}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Category:</Typography>
                    <Typography variant="body2">{selectedFinding.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Assignee:</Typography>
                    <Typography variant="body2">{selectedFinding.assignee}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Due Date:</Typography>
                    <Typography variant="body2">{formatDate(selectedFinding.dueDate)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
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
    </Box>
  )
}