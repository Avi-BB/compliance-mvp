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
  Button,
  LinearProgress,
} from "@mui/material"
import { Shield, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react"
import type { Finding } from "../../lib/slices/findingsSlice"

interface RequirementsTableProps {
  requirements: Finding[]
  onUpdateAttestation: (findingId: string, attestation: Finding["attestation"]) => void
}

export function RequirementsTable({ requirements, onUpdateAttestation }: RequirementsTableProps) {
  const getRequirementTypeColor = (type?: string) => {
    switch (type) {
      case "must":
        return "#dc2626"
      case "should":
        return "#d97706"
      case "may":
        return "#059669"
      case "prohibited":
        return "#7c2d12"
      default:
        return "#6b7280"
    }
  }

  const getAttestationIcon = (status?: "Have" | "Partial" | "No") => {
    switch (status) {
      case "Have":
        return <CheckCircle size={16} color="#059669" />
      case "Partial":
        return <Clock size={16} color="#d97706" />
      case "No":
        return <XCircle size={16} color="#dc2626" />
      default:
        return <MessageSquare size={16} color="#6b7280" />
    }
  }

  const getComplianceStats = () => {
    const total = requirements.length
    const implemented = requirements.filter((r) => r.attestation?.status === "Have").length
    const partial = requirements.filter((r) => r.attestation?.status === "Partial").length
    const notImplemented = requirements.filter((r) => r.attestation?.status === "No").length
    const notAttested = total - implemented - partial - notImplemented

    return {
      total,
      implemented,
      partial,
      notImplemented,
      notAttested,
      complianceRate: total > 0 ? Math.round((implemented / total) * 100) : 0,
    }
  }

  const stats = getComplianceStats()

  if (requirements.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Shield size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No requirements found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Requirements will appear here after running an assessment.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Compliance Overview */}
      <Box sx={{ mb: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Requirements Compliance Overview
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Overall Compliance Rate:
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {stats.complianceRate}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={stats.complianceRate} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle size={16} color="#059669" />
            <Typography variant="body2">Implemented: {stats.implemented}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Clock size={16} color="#d97706" />
            <Typography variant="body2">Partial: {stats.partial}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <XCircle size={16} color="#dc2626" />
            <Typography variant="body2">Not Implemented: {stats.notImplemented}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MessageSquare size={16} color="#6b7280" />
            <Typography variant="body2">Not Attested: {stats.notAttested}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Requirements Table */}
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Requirement</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Impact Area</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requirements.map((requirement) => (
              <TableRow key={requirement.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Shield size={20} color="#4338ca" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {requirement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        {requirement.description.length > 150
                          ? `${requirement.description.substring(0, 150)}...`
                          : requirement.description}
                      </Typography>
                      {requirement.evidence.page && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                          Reference: Page {requirement.evidence.page}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {requirement.requirementType && (
                    <Chip
                      label={requirement.requirementType.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getRequirementTypeColor(requirement.requirementType),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={requirement.severity.toUpperCase()}
                    size="small"
                    color={requirement.severity === "high" || requirement.severity === "critical" ? "error" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                    {requirement.impactArea.replace("_", " ")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getAttestationIcon(requirement.attestation?.status)}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {requirement.attestation?.status || "Not Set"}
                      </Typography>
                      {requirement.attestation?.owner && (
                        <Typography variant="caption" color="text.secondary">
                          Owner: {requirement.attestation.owner}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<MessageSquare size={14} />}
                    onClick={() => {
                      // This would open the same attestation dialog as in FindingsTable
                      // For now, we'll just show a placeholder
                      console.log("Open attestation dialog for", requirement.id)
                    }}
                  >
                    Attest
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
