"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material"
import { FileText, Shield, Gavel, Lock, Brain, Building } from "lucide-react"
import { useDocuments } from "../../lib/hooks/useDocuments"
import type { Assessment } from "../../lib/slices/assessmentsSlice"

interface AssessmentWizardProps {
  onComplete: (assessment: Omit<Assessment, "id" | "createdAt" | "tenantId">) => void
}

interface PromptPack {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  domains: string[]
  estimatedTime: string
}

const promptPacks: PromptPack[] = [
  {
    id: "pci_dss",
    name: "PCI DSS",
    description: "Payment Card Industry Data Security Standard requirements and controls",
    icon: <Lock size={24} />,
    color: "#4338ca",
    domains: ["Payment Processing", "Data Security", "Network Security"],
    estimatedTime: "15-20 min",
  },
  {
    id: "iso_27001",
    name: "ISO 27001",
    description: "Information Security Management System requirements",
    icon: <Shield size={24} />,
    color: "#059669",
    domains: ["Information Security", "Risk Management", "Business Continuity"],
    estimatedTime: "20-25 min",
  },
  {
    id: "sox",
    name: "SOX Compliance",
    description: "Sarbanes-Oxley Act financial reporting and internal controls",
    icon: <Building size={24} />,
    color: "#d97706",
    domains: ["Financial Reporting", "Internal Controls", "Audit"],
    estimatedTime: "10-15 min",
  },
  {
    id: "gdpr",
    name: "GDPR",
    description: "General Data Protection Regulation privacy requirements",
    icon: <Lock size={24} />,
    color: "#7c3aed",
    domains: ["Data Privacy", "Consent Management", "Data Rights"],
    estimatedTime: "15-20 min",
  },
  {
    id: "aml_kyc",
    name: "AML/KYC",
    description: "Anti-Money Laundering and Know Your Customer requirements",
    icon: <Gavel size={24} />,
    color: "#dc2626",
    domains: ["Customer Due Diligence", "Transaction Monitoring", "Reporting"],
    estimatedTime: "20-30 min",
  },
  {
    id: "ai_governance",
    name: "AI Governance",
    description: "AI ethics, bias detection, and algorithmic accountability",
    icon: <Brain size={24} />,
    color: "#0891b2",
    domains: ["AI Ethics", "Bias Detection", "Model Governance"],
    estimatedTime: "25-30 min",
  },
]

const jurisdictions = [
  { code: "US", name: "United States" },
  { code: "EU", name: "European Union" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "IN", name: "India" },
]

export function AssessmentWizard({ onComplete }: AssessmentWizardProps) {
  const { documents } = useDocuments()
  const [activeStep, setActiveStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState({
    name: "",
    promptPacks: [] as string[],
    documentIds: [] as string[],
    jurisdiction: "",
    status: "draft" as const,
  })

  const steps = ["Basic Information", "Select Documents", "Choose Prompt Packs", "Review & Create"]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleComplete = () => {
    onComplete(assessmentData)
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return assessmentData.name.trim() !== ""
      case 1:
        return assessmentData.documentIds.length > 0
      case 2:
        return assessmentData.promptPacks.length > 0
      default:
        return true
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Assessment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assessment Name"
                  value={assessmentData.name}
                  onChange={(e) => setAssessmentData({ ...assessmentData, name: e.target.value })}
                  placeholder="e.g., Q1 2024 PCI DSS Assessment"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Jurisdiction (Optional)</InputLabel>
                  <Select
                    value={assessmentData.jurisdiction}
                    label="Jurisdiction (Optional)"
                    onChange={(e) => setAssessmentData({ ...assessmentData, jurisdiction: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>Not specified</em>
                    </MenuItem>
                    {jurisdictions.map((jurisdiction) => (
                      <MenuItem key={jurisdiction.code} value={jurisdiction.code}>
                        {jurisdiction.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Select Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the documents you want to analyze in this assessment.
            </Typography>
            {documents.filter((d) => d.status === "ready").length === 0 ? (
              <Alert severity="warning">
                No documents are ready for analysis. Please upload and process documents first.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {documents
                  .filter((d) => d.status === "ready")
                  .map((document) => (
                    <Grid item xs={12} key={document.id}>
                      <Card variant="outlined">
                        <CardContent sx={{ py: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={assessmentData.documentIds.includes(document.id)}
                                onChange={(e) => {
                                  const newDocumentIds = e.target.checked
                                    ? [...assessmentData.documentIds, document.id]
                                    : assessmentData.documentIds.filter((id) => id !== document.id)
                                  setAssessmentData({ ...assessmentData, documentIds: newDocumentIds })
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <FileText size={20} />
                                <Box>
                                  <Typography variant="subtitle2">{document.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {document.type.replace("_", " ").toUpperCase()} • {document.pages} pages
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Choose Prompt Packs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the compliance frameworks and regulations to analyze against.
            </Typography>
            <Grid container spacing={3}>
              {promptPacks.map((pack) => (
                <Grid item xs={12} md={6} key={pack.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      border: assessmentData.promptPacks.includes(pack.id) ? 2 : 1,
                      borderColor: assessmentData.promptPacks.includes(pack.id) ? pack.color : "grey.300",
                      "&:hover": {
                        borderColor: pack.color,
                      },
                    }}
                    onClick={() => {
                      const newPromptPacks = assessmentData.promptPacks.includes(pack.id)
                        ? assessmentData.promptPacks.filter((id) => id !== pack.id)
                        : [...assessmentData.promptPacks, pack.id]
                      setAssessmentData({ ...assessmentData, promptPacks: newPromptPacks })
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                        <Box sx={{ color: pack.color }}>{pack.icon}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {pack.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {pack.description}
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                            {pack.domains.map((domain) => (
                              <Chip key={domain} label={domain} size="small" variant="outlined" />
                            ))}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Estimated time: {pack.estimatedTime}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review Assessment
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Assessment Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{assessmentData.name}</Typography>
                    </Box>
                    {assessmentData.jurisdiction && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Jurisdiction
                        </Typography>
                        <Typography variant="body1">
                          {jurisdictions.find((j) => j.code === assessmentData.jurisdiction)?.name}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Documents ({assessmentData.documentIds.length})
                    </Typography>
                    {assessmentData.documentIds.map((docId) => {
                      const doc = documents.find((d) => d.id === docId)
                      return (
                        <Box key={docId} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <FileText size={16} />
                          <Typography variant="body2">{doc?.name}</Typography>
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Prompt Packs ({assessmentData.promptPacks.length})
                    </Typography>
                    {assessmentData.promptPacks.map((packId) => {
                      const pack = promptPacks.find((p) => p.id === packId)
                      return (
                        <Box key={packId} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Box sx={{ color: pack?.color }}>{pack?.icon}</Box>
                          <Typography variant="body2">{pack?.name}</Typography>
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ maxHeight: "400px", overflowY: "auto", px: 1 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleComplete} disabled={!isStepValid(activeStep)}>
              Create Assessment
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} disabled={!isStepValid(activeStep)}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}