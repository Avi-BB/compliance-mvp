"use client"
import {
  Box,
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
import { useState } from "react"
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

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>(mockFindings)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null)
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterFramework, setFilterFramework] = useState("")

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FindInPage sx={{ mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1">
            Findings
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
          Add Finding
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Critical
                  </Typography>
                  <Typography variant="h4" component="div" color="error.main">
                    {severityStats.critical}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "error.light" }}>
                  <Error />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    High
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {severityStats.high}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "warning.light" }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Medium
                  </Typography>
                  <Typography variant="h4" component="div" color="info.main">
                    {severityStats.medium}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.light" }}>
                  <Info />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Low
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {severityStats.low}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.light" }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
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

      {/* Findings Table */}
      <Card>
        <CardContent>
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
                      <Typography variant="body2" color={new Date(finding.dueDate) < new Date() ? "error" : "inherit"}>
                        {new Date(finding.dueDate).toLocaleDateString()}
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
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
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
                  <Typography variant="body2">{new Date(selectedFinding.dueDate).toLocaleDateString()}</Typography>
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
    </Box>
  )
}
