"use client"

import { motion } from "framer-motion"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
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
  Container,
} from "@mui/material"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  Sparkles,
} from "lucide-react"
import ScoringEngine from "@/components/scoring/ScoringEngine"

// Mock data for dashboard
const mockDashboardData = {
  overallScore: 78,
  scoreChange: 5,
  totalAssessments: 12,
  activeFindings: 34,
  resolvedFindings: 156,
  highRiskItems: 8,
  complianceFrameworks: [
    { name: "PCI DSS", score: 85, trend: "up", color: "#10B981" },
    { name: "ISO 27001", score: 72, trend: "up", color: "#3B82F6" },
    { name: "SOX", score: 90, trend: "stable", color: "#10B981" },
    { name: "GDPR", score: 68, trend: "down", color: "#F59E0B" },
  ],
  recentAssessments: [
    {
      id: "1",
      name: "Q4 PCI DSS Review",
      framework: "PCI DSS",
      score: 85,
      status: "completed",
      date: "2024-01-15",
      findings: 12,
    },
    {
      id: "2",
      name: "ISO 27001 Annual",
      framework: "ISO 27001",
      score: 72,
      status: "in-progress",
      date: "2024-01-10",
      findings: 18,
    },
    {
      id: "3",
      name: "SOX Controls Testing",
      framework: "SOX",
      score: 90,
      status: "completed",
      date: "2024-01-08",
      findings: 5,
    },
  ],
  riskDistribution: {
    critical: 3,
    high: 8,
    medium: 15,
    low: 8,
  },
}

const mockScoringData = {
  breakdown: [
    { category: "Access Controls", score: 85, weight: 25, trend: "up" as const, findings: 8 },
    { category: "Data Protection", score: 72, weight: 20, trend: "stable" as const, findings: 12 },
    { category: "Network Security", score: 90, weight: 20, trend: "up" as const, findings: 5 },
    { category: "Incident Response", score: 68, weight: 15, trend: "down" as const, findings: 9 },
    { category: "Risk Management", score: 75, weight: 20, trend: "up" as const, findings: 6 },
  ],
  riskFactors: [
    { name: "Privileged Access Management", impact: "high" as const, likelihood: "medium" as const, score: 65 },
    { name: "Data Encryption at Rest", impact: "high" as const, likelihood: "low" as const, score: 85 },
    { name: "Third-Party Risk Assessment", impact: "medium" as const, likelihood: "high" as const, score: 55 },
    { name: "Business Continuity Planning", impact: "medium" as const, likelihood: "medium" as const, score: 70 },
  ],
}

const ScoreCard = ({ title, value, change, icon: Icon, color = "primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card
      sx={{
        height: "100%",
        minHeight: 160,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(135deg, ${
          color === "primary"
            ? "rgba(69, 56, 202, 0.05)"
            : color === "info"
              ? "rgba(59, 130, 246, 0.05)"
              : color === "warning"
                ? "rgba(245, 158, 11, 0.05)"
                : "rgba(239, 68, 68, 0.05)"
        } 0%, transparent 100%)`,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: `${color}.main`,
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px rgba(69, 56, 202, 0.15)`,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
              {title}
            </Typography>
            <Typography variant="h3" component="div" color={`${color}.main`} sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color === "primary" ? "rgba(69, 56, 202, 0.1)" : color === "info" ? "rgba(59, 130, 246, 0.1)" : color === "warning" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)"}`,
              display: "inline-flex",
              flexShrink: 0,
              ml: 2,
            }}
          >
            <Icon size={24} style={{ color: color === "primary" ? "#4538CA" : color === "info" ? "#3B82F6" : color === "warning" ? "#F59E0B" : "#EF4444" }} />
          </Box>
        </Box>
        {change !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            {change > 0 ? (
              <TrendingUp size={16} color="#10B981" />
            ) : (
              <TrendingDown size={16} color="#EF4444" />
            )}
            <Typography variant="body2" color={change > 0 ? "success.main" : "error.main"} sx={{ ml: 0.5, fontWeight: 600 }}>
              {change > 0 ? "+" : ""}
              {change}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

const FrameworkScoreCard = ({ framework }) => (
  <Card sx={{ mb: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {framework.name}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} style={{ color: framework.color }}>
            {framework.score}%
          </Typography>
          {framework.trend === "up" && <TrendingUp color="#10B981" size={20} />}
          {framework.trend === "down" && <TrendingDown color="#EF4444" size={20} />}
          {framework.trend === "stable" && <TrendingUp color="#9CA3AF" size={20} />}
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={framework.score}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "grey.200",
          "& .MuiLinearProgress-bar": {
            background: `linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)`,
            borderRadius: 4,
          },
        }}
      />
    </CardContent>
  </Card>
)

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success"
    case "in-progress":
      return "warning"
    case "failed":
      return "error"
    default:
      return "default"
  }
}

export function DashboardContent() {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Compliance Dashboard
              </Typography>
              <Chip
                icon={<Sparkles size={14} />}
                label="AI-Powered"
                size="small"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "success.main",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              Monitor your organization's compliance posture and track improvements across frameworks.
            </Typography>
          </Box>
        </motion.div>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard
              title="Overall Compliance Score"
              value={`${mockDashboardData.overallScore}%`}
              change={mockDashboardData.scoreChange}
              icon={Activity}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard
              title="Total Assessments"
              value={mockDashboardData.totalAssessments}
              icon={Shield}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard title="Active Findings" value={mockDashboardData.activeFindings} icon={AlertTriangle} color="warning" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard title="High Risk Items" value={mockDashboardData.highRiskItems} icon={AlertTriangle} color="error" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Scoring Engine */}
          <Grid item xs={12} lg={8}>
            <ScoringEngine
              overallScore={mockDashboardData.overallScore}
              breakdown={mockScoringData.breakdown}
              riskFactors={mockScoringData.riskFactors}
            />
          </Grid>

          {/* Framework Scores and Risk Distribution */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Framework Compliance Scores
                </Typography>
                {mockDashboardData.complianceFrameworks.map((framework) => (
                  <FrameworkScoreCard key={framework.name} framework={framework} />
                ))}
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Risk Distribution
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.05)" }}>
                      <Typography variant="h3" color="error.main" sx={{ fontWeight: 700 }}>
                        {mockDashboardData.riskDistribution.critical}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Critical
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ borderRadius: 2, bgcolor: "rgba(245, 158, 11, 0.05)" }}>
                      <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                        {mockDashboardData.riskDistribution.high}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        High
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.05)" }}>
                      <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                        {mockDashboardData.riskDistribution.medium}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Medium
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} sx={{ borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.05)" }}>
                      <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                        {mockDashboardData.riskDistribution.low}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Low
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Assessments */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Assessments
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Assessment Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Framework</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Findings</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockDashboardData.recentAssessments.map((assessment) => (
                        <TableRow key={assessment.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {assessment.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={assessment.framework} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color={
                                assessment.score >= 80
                                  ? "success.main"
                                  : assessment.score >= 60
                                    ? "warning.main"
                                    : "error.main"
                              }
                              fontWeight="medium"
                            >
                              {assessment.score}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={assessment.status}
                              size="small"
                              color={getStatusColor(assessment.status)}
                              icon={assessment.status === "completed" ? <CheckCircle size={14} /> : <Clock size={14} />}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(assessment.date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{assessment.findings} findings</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="More actions">
                              <IconButton size="small">
                                <MoreVertical size={16} />
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}