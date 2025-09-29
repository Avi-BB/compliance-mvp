"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Grid,
} from "@mui/material"
import {
  Expand as ExpandMore,
  Expand as ExpandLess,
  AlertTriangle,
  Shield,
  FileText,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import type { Finding } from "../../lib/slices/findingsSlice"

interface FindingsTableProps {
  findings: Finding[]
  onUpdateAttestation: (findingId: string, attestation: Finding["attestation"]) => void
}

export function FindingsTable({ findings, onUpdateAttestation }: FindingsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [attestationDialog, setAttestationDialog] = useState<{
    open: boolean
    finding: Finding | null
  }>({ open: false, finding: null })
  const [attestationForm, setAttestationForm] = useState({
    status: "No" as "Have" | "Partial" | "No",
    evidenceUri: "",
    owner: "",
    notes: "",
  })

  const toggleRow = (findingId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(findingId)) {
      newExpanded.delete(findingId)
    } else {
      newExpanded.add(findingId)
    }
    setExpandedRows(newExpanded)
  }

  const openAttestationDialog = (finding: Finding) => {
    setAttestationDialog({ open: true, finding })
    setAttestationForm({
      status: finding.attestation?.status || "No",
      evidenceUri: finding.attestation?.evidenceUri || "",
      owner: finding.attestation?.owner || "",
      notes: finding.attestation?.notes || "",
    })
  }

  const closeAttestationDialog = () => {
    setAttestationDialog({ open: false, finding: null })
  }

  const handleAttestationSubmit = () => {
    if (attestationDialog.finding) {
      onUpdateAttestation(attestationDialog.finding.id, attestationForm)
      closeAttestationDialog()
    }
  }

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

  const getKindIcon = (kind: Finding["kind"]) => {
    switch (kind) {
      case "REQUIREMENT":
        return <Shield size={16} />
      case "RISK":
        return <AlertTriangle size={16} />
      default:
        return <FileText size={16} />
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

  if (findings.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <FileText size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No findings available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Run an assessment to generate compliance findings.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={40}></TableCell>
              <TableCell>Finding</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Impact Area</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Attestation</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {findings.map((finding) => (
              <>
                <TableRow key={finding.id} hover>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(finding.id)}>
                      {expandedRows.has(finding.id) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box sx={{ color: getSeverityColor(finding.severity), mt: 0.5 }}>{getKindIcon(finding.kind)}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {finding.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                          {finding.description.length > 120
                            ? `${finding.description.substring(0, 120)}...`
                            : finding.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={finding.kind} size="small" variant="outlined" sx={{ textTransform: "capitalize" }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={finding.severity.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getSeverityColor(finding.severity),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {finding.impactArea.replace("_", " ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating
                        value={finding.confidence * 5}
                        readOnly
                        size="small"
                        precision={0.1}
                        max={5}
                        sx={{ fontSize: "1rem" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(finding.confidence * 100)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getAttestationIcon(finding.attestation?.status)}
                      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                        {finding.attestation?.status || "Not Set"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openAttestationDialog(finding)}
                      startIcon={<MessageSquare size={14} />}
                    >
                      Attest
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded Row Content */}
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedRows.has(finding.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ py: 2, px: 2, bgcolor: "grey.50", borderRadius: 1, m: 1 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={8}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Full Description
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {finding.description}
                            </Typography>

                            {finding.notes && (
                              <>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Notes
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                                  {finding.notes}
                                </Typography>
                              </>
                            )}
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Evidence
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 1, border: 1, borderColor: "grey.200" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <FileText size={16} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  Document Reference
                                </Typography>
                              </Box>
                              {finding.evidence.page && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                  Page {finding.evidence.page}
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ mt: 1, fontSize: "0.8rem", lineHeight: 1.4 }}>
                                "{finding.evidence.excerpt}"
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<ExternalLink size={12} />}
                                sx={{ mt: 1, fontSize: "0.75rem" }}
                              >
                                View Source
                              </Button>
                            </Box>

                            {finding.attestation && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Current Attestation
                                </Typography>
                                <Box
                                  sx={{ p: 2, bgcolor: "white", borderRadius: 1, border: 1, borderColor: "grey.200" }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    {getAttestationIcon(finding.attestation.status)}
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {finding.attestation.status}
                                    </Typography>
                                  </Box>
                                  {finding.attestation.owner && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                      Owner: {finding.attestation.owner}
                                    </Typography>
                                  )}
                                  {finding.attestation.notes && (
                                    <Typography variant="body2" sx={{ mt: 1, fontSize: "0.8rem" }}>
                                      {finding.attestation.notes}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Attestation Dialog */}
      <Dialog
        open={attestationDialog.open}
        onClose={closeAttestationDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Attest to Finding
          </Typography>
          {attestationDialog.finding && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {attestationDialog.finding.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Control Status</InputLabel>
                  <Select
                    value={attestationForm.status}
                    label="Control Status"
                    onChange={(e) =>
                      setAttestationForm({ ...attestationForm, status: e.target.value as "Have" | "Partial" | "No" })
                    }
                  >
                    <MenuItem value="Have">Have - Control is implemented</MenuItem>
                    <MenuItem value="Partial">Partial - Control is partially implemented</MenuItem>
                    <MenuItem value="No">No - Control is not implemented</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Control Owner"
                  value={attestationForm.owner}
                  onChange={(e) => setAttestationForm({ ...attestationForm, owner: e.target.value })}
                  placeholder="e.g., IT Security Team"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Evidence Link (Optional)"
                  value={attestationForm.evidenceUri}
                  onChange={(e) => setAttestationForm({ ...attestationForm, evidenceUri: e.target.value })}
                  placeholder="Link to supporting documentation or evidence"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={attestationForm.notes}
                  onChange={(e) => setAttestationForm({ ...attestationForm, notes: e.target.value })}
                  placeholder="Additional context, implementation details, or remediation plans..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAttestationDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAttestationSubmit}>
            Save Attestation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
