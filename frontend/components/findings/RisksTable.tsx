"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Grid,
} from "@mui/material"
import { AlertTriangle, TrendingUp, DollarSign, Building, Users, Shield } from "lucide-react"
import type { Finding } from "../../lib/slices/findingsSlice"

interface RisksTableProps {
  risks: Finding[]
}

export function RisksTable({ risks }: RisksTableProps) {
  const getSeverityColor = (severity: Finding["severity"]) => {
    switch (severity) {
      case "critical":
        return "#7c2d12"
      case "high":
        return "#dc2626"
      case "medium":
        return "#d97706"
      case "low":
        return "#059669"
      default:
        return "#6b7280"
    }
  }

  const getLikelihoodColor = (likelihood?: string) => {
    switch (likelihood) {
      case "almost_certain":
        return "#7c2d12"
      case "likely":
        return "#dc2626"
      case "possible":
        return "#d97706"
      case "rare":
        return "#059669"
      default:
        return "#6b7280"
    }
  }

  const getImpactAreaIcon = (area: string) => {
    switch (area) {
      case "financial":
        return <DollarSign size={16} />
      case "operational":
        return <Building size={16} />
      case "reputational":
        return <Users size={16} />
      case "security":
        return <Shield size={16} />
      case "legal":
        return <AlertTriangle size={16} />
      default:
        return <TrendingUp size={16} />
    }
  }

  const getRiskStats = () => {
    const total = risks.length
    const critical = risks.filter((r) => r.severity === "critical").length
    const high = risks.filter((r) => r.severity === "high").length
    const medium = risks.filter((r) => r.severity === "medium").length
    const low = risks.filter((r) => r.severity === "low").length

    return { total, critical, high, medium, low }
  }

  const stats = getRiskStats()

  if (risks.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <AlertTriangle size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No risks identified
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Risk analysis will appear here after running an assessment.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Risk Overview */}
      <Box sx={{ mb: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Risk Analysis Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#7c2d12" }}>
                {stats.critical}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#dc2626" }}>
                {stats.high}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#d97706" }}>
                {stats.medium}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medium
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#059669" }}>
                {stats.low}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Risks Table */}
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Risk</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Likelihood</TableCell>
              <TableCell>Impact Area</TableCell>
              <TableCell>Confidence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <AlertTriangle
                      size={20}
                      color={getSeverityColor(risk.severity)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {risk.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        {risk.description.length > 150 ? `${risk.description.substring(0, 150)}...` : risk.description}
                      </Typography>
                      {risk.evidence.page && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                          Reference: Page {risk.evidence.page}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={risk.severity.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: getSeverityColor(risk.severity),
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {risk.likelihood && (
                    <Chip
                      label={risk.likelihood.replace("_", " ").toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getLikelihoodColor(risk.likelihood),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getImpactAreaIcon(risk.impactArea)}
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {risk.impactArea.replace("_", " ")}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 6,
                        bgcolor: "grey.200",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${risk.confidence * 100}%`,
                          height: "100%",
                          bgcolor: "primary.main",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(risk.confidence * 100)}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
