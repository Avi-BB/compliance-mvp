"use client"

import type React from "react"

import { useState } from "react"
import { Box, Container, Typography, Card, Button, Tabs, Tab, Chip, LinearProgress } from "@mui/material"
import { ArrowLeft, Download, Share, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAssessmentDetails } from "../../../lib/hooks/useAssessmentDetails"
import { FindingsTable } from "../../../components/findings/FindingsTable"
import { RequirementsTable } from "../../../components/findings/RequirementsTable"
import { RisksTable } from "../../../components/findings/RisksTable"
import { AssessmentSummary } from "../../../components/findings/AssessmentSummary"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AssessmentDetailsPage() {
  const params = useParams()
  const assessmentId = params.id as string
  const { assessment, findings, requirements, risks, loading, updateAttestation } = useAssessmentDetails(assessmentId)
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Loading assessment details...
          </Typography>
        </Container>
      </Box>
    )
  }

  if (!assessment) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
            Assessment not found
          </Typography>
        </Container>
      </Box>
    )
  }

  const getStatusColor = (status: string) => {
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "white", borderBottom: 1, borderColor: "grey.200", py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="text"
                component={Link}
                href="/assessments"
                startIcon={<ArrowLeft />}
                sx={{ color: "text.secondary" }}
              >
                Back to Assessments
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" startIcon={<RefreshCw />} size="small">
                Re-run
              </Button>
              <Button variant="outlined" startIcon={<Share />} size="small">
                Share
              </Button>
              <Button variant="contained" startIcon={<Download />} size="small">
                Export
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Assessment Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {assessment.name}
            </Typography>
            <Chip
              label={assessment.status.toUpperCase()}
              color={getStatusColor(assessment.status)}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            {assessment.promptPacks.map((pack) => (
              <Chip key={pack} label={pack.toUpperCase()} variant="outlined" size="small" />
            ))}
          </Box>
          <Typography variant="body1" color="text.secondary">
            {assessment.documentIds.length} documents analyzed • Created on{" "}
            {new Date(assessment.createdAt).toLocaleDateString()}
            {assessment.completedAt && <> • Completed on {new Date(assessment.completedAt).toLocaleDateString()}</>}
          </Typography>
        </Box>

        {/* Assessment Summary */}
        {assessment.score && (
          <Box sx={{ mb: 4 }}>
            <AssessmentSummary assessment={assessment} />
          </Box>
        )}

        {/* Findings Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="findings tabs">
              <Tab label={`Requirements (${requirements.length})`} />
              <Tab label={`Risks (${risks.length})`} />
              <Tab label={`All Findings (${findings.length})`} />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <RequirementsTable requirements={requirements} onUpdateAttestation={updateAttestation} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <RisksTable risks={risks} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <FindingsTable findings={findings} onUpdateAttestation={updateAttestation} />
          </TabPanel>
        </Card>
      </Container>
    </Box>
  )
}
