"use client"

import { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { FileText, Upload, X, CheckCircle, AlertCircle, MinusCircle } from "lucide-react"
import type { Attestation, DocumentReference } from "../../lib/types"

interface AttestationFormProps {
  subjectId: string
  subjectType: "finding" | "requirement"
  subjectTitle: string
  subjectDescription: string
  refs: DocumentReference[]
  currentAttestation?: Attestation
  onSave: (attestation: Omit<Attestation, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function AttestationForm({
  subjectId,
  subjectType,
  subjectTitle,
  subjectDescription,
  refs,
  currentAttestation,
  onSave,
  onCancel,
}: AttestationFormProps) {
  const [status, setStatus] = useState<"Have" | "Partial" | "No">(currentAttestation?.status || "No")
  const [evidenceUri, setEvidenceUri] = useState(currentAttestation?.evidenceUri || "")
  const [owner, setOwner] = useState(currentAttestation?.owner || "")
  const [notes, setNotes] = useState(currentAttestation?.notes || "")

  const handleSubmit = () => {
    onSave({
      subjectId,
      subjectType,
      status,
      evidenceUri: evidenceUri || undefined,
      owner: owner || undefined,
      notes: notes || undefined,
    })
  }

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case "Have":
        return <CheckCircle size={20} />
      case "Partial":
        return <MinusCircle size={20} />
      case "No":
        return <AlertCircle size={20} />
      default:
        return null
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "Have":
        return "success"
      case "Partial":
        return "warning"
      case "No":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Box>
      {/* Subject Info */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {subjectTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subjectDescription}
          </Typography>
          {refs.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
                References:
              </Typography>
              {refs.map((ref, index) => (
                <Chip
                  key={index}
                  label={`${ref.doc} - Page ${ref.page}${ref.clause ? `, §${ref.clause}` : ""}`}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Attestation Status */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Control Status *
        </Typography>
        <RadioGroup value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <FormControlLabel
            value="Have"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getStatusIcon("Have")}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Have
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Control is fully implemented and operational
                  </Typography>
                </Box>
              </Box>
            }
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="Partial"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getStatusIcon("Partial")}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Partial
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Control is partially implemented or needs improvement
                  </Typography>
                </Box>
              </Box>
            }
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="No"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getStatusIcon("No")}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Don't Have
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Control is not implemented
                  </Typography>
                </Box>
              </Box>
            }
          />
        </RadioGroup>
      </Box>

      {/* Owner */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Control Owner</InputLabel>
        <Select value={owner} label="Control Owner" onChange={(e) => setOwner(e.target.value)}>
          <MenuItem value="">
            <em>Not assigned</em>
          </MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Risk">Risk</MenuItem>
          <MenuItem value="Legal">Legal</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Compliance">Compliance</MenuItem>
          <MenuItem value="Security">Security</MenuItem>
        </Select>
      </FormControl>

      {/* Evidence URI */}
      <TextField
        fullWidth
        label="Evidence Link (Optional)"
        value={evidenceUri}
        onChange={(e) => setEvidenceUri(e.target.value)}
        placeholder="https://... or jira://... or confluence://..."
        helperText="Link to evidence documents, tickets, or internal systems"
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
              <FileText size={20} color="#6b7280" />
            </Box>
          ),
        }}
      />

      {/* Notes */}
      <TextField
        fullWidth
        label="Notes"
        multiline
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any additional context, implementation details, or gaps..."
        sx={{ mb: 3 }}
      />

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
          }}
        >
          Save Attestation
        </Button>
      </Box>
    </Box>
  )
}