"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material"
import { Plus, Sparkles, TrendingUp, Activity, FileCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAssessments } from "../../lib/hooks/useAssessments"
import { AssessmentWizard } from "../../components/assessments/AssessmentWizard"
import { AssessmentList } from "../../components/assessments/AssessmentList"

export default function AssessmentsPage() {
  const { assessments, loading, createAssessment, runAssessment, deleteAssessment } = useAssessments()
  const [wizardOpen, setWizardOpen] = useState(false)

  const getStatusStats = () => {
    const stats = {
      total: assessments.length,
      completed: assessments.filter((a) => a.status === "completed").length,
      running: assessments.filter((a) => a.status === "running").length,
      draft: assessments.filter((a) => a.status === "draft").length,
    }
    return stats
  }

  const stats = getStatusStats()

  const statCards = [
    {
      label: "Total Assessments",
      value: stats.total,
      icon: FileCheck,
      color: "primary.main",
      bgColor: "rgba(69, 56, 202, 0.1)",
      gradient: "linear-gradient(135deg, rgba(69, 56, 202, 0.05) 0%, transparent 100%)",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: TrendingUp,
      color: "success.main",
      bgColor: "rgba(16, 185, 129, 0.1)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
    },
    {
      label: "In Progress",
      value: stats.running,
      icon: Activity,
      color: "warning.main",
      bgColor: "rgba(245, 158, 11, 0.1)",
      gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)",
    },
    {
      label: "Drafts",
      value: stats.draft,
      icon: AlertCircle,
      color: "text.secondary",
      bgColor: "rgba(0, 0, 0, 0.05)",
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%)",
    },
  ]

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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    Compliance Assessments
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
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
                  Create and manage AI-powered compliance assessments using regulatory prompt packs. Upload
                  documents, select frameworks, and get instant gap analysis with remediation plans.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setWizardOpen(true)}
                size="large"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                  boxShadow: "0 4px 12px rgba(69, 56, 202, 0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(59, 46, 172, 1) 0%, rgba(14, 165, 115, 1) 100%)",
                    boxShadow: "0 6px 20px rgba(69, 56, 202, 0.35)",
                  },
                }}
              >
                New Assessment
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
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
                      boxShadow: `0 8px 24px ${stat.bgColor}`,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
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
                        <stat.icon size={24} style={{ color: stat.color }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Assessment List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Recent Assessments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage your compliance assessment history
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Plus />}
                  onClick={() => setWizardOpen(true)}
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Create New
                </Button>
              </Box>
              <AssessmentList
                assessments={assessments}
                loading={loading}
                onRunAssessment={runAssessment}
                onDeleteAssessment={deleteAssessment}
              />
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Assessment Wizard Dialog */}
      <Dialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Sparkles size={20} style={{ color: "var(--color-primary)" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create New Assessment
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select your compliance framework and documents to begin AI-powered analysis
          </Typography>
        </DialogTitle>
        <DialogContent>
          <AssessmentWizard
            onComplete={(assessmentData) => {
              createAssessment(assessmentData)
              setWizardOpen(false)
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setWizardOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}