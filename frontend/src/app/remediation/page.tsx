"use client"

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
} from "@mui/material"
import { Add, PlayArrow, CheckCircle, Schedule, CalendarToday, TrendingUp, MoreVert } from "@mui/icons-material"
import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

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

// Locale-stable date formatter to prevent hydration mismatches
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso))

export default function RemediationPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isOverdue = (dueDate: string) => {
    return isMounted && new Date(dueDate) < new Date()
  }

  const statCards = [
    {
      title: "Total Plans",
      value: mockRemediationData.stats.totalPlans,
      icon: TrendingUp,
      color: "primary.main",
      bgColor: "rgba(69, 56, 202, 0.1)",
      gradient: "linear-gradient(135deg, rgba(69, 56, 202, 0.05) 0%, transparent 100%)",
    },
    {
      title: "Active Plans",
      value: mockRemediationData.stats.activePlans,
      icon: PlayArrow,
      color: "info.main",
      bgColor: "rgba(59, 130, 246, 0.1)",
      gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)",
    },
    {
      title: "Completed Plans",
      value: mockRemediationData.stats.completedPlans,
      icon: CheckCircle,
      color: "success.main",
      bgColor: "rgba(16, 185, 129, 0.1)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
    },
    {
      title: "Overdue Plans",
      value: mockRemediationData.stats.overduePlans,
      icon: Schedule,
      color: "error.main",
      bgColor: "rgba(239, 68, 68, 0.1)",
      gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)",
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
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "success.main",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                />
              </Box>
              <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 700 }}>
                Manage action plans to address compliance findings and reduce risk with AI-powered prioritization
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              size="large"
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
              Create Plan
            </Button>
          </Box>
        </motion.div>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
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
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" sx={{ gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
                          {stat.title}
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

        {/* Remediation Plans Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
                              {formatDate(plan.dueDate)}
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
        </motion.div>
      </Container>
    </Box>
  )
}