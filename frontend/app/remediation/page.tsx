import {
  Box,
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
} from "@mui/material"
import { Add, PlayArrow, CheckCircle, Schedule, CalendarToday, TrendingUp, MoreVert } from "@mui/icons-material"

// Mock data for remediation plans
const mockRemediationData = {
  stats: {
    totalPlans: 15,
    activePlans: 8,
    completedPlans: 7,
    overduePlans: 3,
  },
  plans: [
    {
      id: "1",
      title: "Implement Multi-Factor Authentication",
      description: "Deploy MFA across all user accounts to meet PCI DSS requirements",
      priority: "high",
      status: "in-progress",
      progress: 65,
      assignee: "John Smith",
      dueDate: "2024-02-15",
      estimatedEffort: "40 hours",
      framework: "PCI DSS",
      findings: ["REQ-8.2.3", "REQ-8.2.4"],
      tasks: [
        { id: "1a", title: "Select MFA solution", status: "completed" },
        { id: "1b", title: "Configure authentication server", status: "in-progress" },
        { id: "1c", title: "User training and rollout", status: "pending" },
      ],
    },
    {
      id: "2",
      title: "Data Encryption at Rest Implementation",
      description: "Encrypt sensitive data stored in databases and file systems",
      priority: "critical",
      status: "not-started",
      progress: 0,
      assignee: "Sarah Johnson",
      dueDate: "2024-01-30",
      estimatedEffort: "60 hours",
      framework: "ISO 27001",
      findings: ["A.10.1.1", "A.10.1.2"],
      tasks: [
        { id: "2a", title: "Assess current encryption status", status: "pending" },
        { id: "2b", title: "Implement database encryption", status: "pending" },
        { id: "2c", title: "File system encryption setup", status: "pending" },
      ],
    },
    {
      id: "3",
      title: "Incident Response Plan Update",
      description: "Update and test incident response procedures",
      priority: "medium",
      status: "completed",
      progress: 100,
      assignee: "Mike Davis",
      dueDate: "2024-01-15",
      estimatedEffort: "20 hours",
      framework: "SOX",
      findings: ["CC7.4"],
      tasks: [
        { id: "3a", title: "Review current procedures", status: "completed" },
        { id: "3b", title: "Update response playbooks", status: "completed" },
        { id: "3c", title: "Conduct tabletop exercise", status: "completed" },
      ],
    },
  ],
}

const getPriorityColor = (priority: string) => {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success"
    case "in-progress":
      return "warning"
    case "not-started":
      return "default"
    case "overdue":
      return "error"
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

const StatCard = ({ title, value, icon: Icon, color = "primary" }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light` }}>
          <Icon />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
)

export default function RemediationPage() {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Remediation Planning
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage action plans to address compliance findings and reduce risk.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large">
          Create Plan
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Plans"
            value={mockRemediationData.stats.totalPlans}
            icon={TrendingUp}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Plans" value={mockRemediationData.stats.activePlans} icon={PlayArrow} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Plans"
            value={mockRemediationData.stats.completedPlans}
            icon={CheckCircle}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Plans"
            value={mockRemediationData.stats.overduePlans}
            icon={Schedule}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Remediation Plans Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Remediation Plans
          </Typography>
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
                {mockRemediationData.plans.map((plan) => (
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
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={plan.status.replace("-", " ")}
                        size="small"
                        color={getStatusColor(
                          isOverdue(plan.dueDate) && plan.status !== "completed" ? "overdue" : plan.status,
                        )}
                        icon={getStatusIcon(plan.status)}
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
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                            },
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
                            .map((n) => n[0])
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
                          {new Date(plan.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={plan.framework} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="More actions">
                        <IconButton size="small">
                          <MoreVert />
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
    </Box>
  )
}
