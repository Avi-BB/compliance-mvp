"use client"
import { useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { PrimaryLoadingButton } from "@/lib/utils/styledButton"
import { CreateRemediationPlanForm } from "@/lib/types"

interface CreateRemediationDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRemediationPlanForm) => void
  editingRemediation?: CreateRemediationPlanForm | null
}

const remediationSchema = yup.object({
  findingId: yup.string().required("Finding ID is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  priority: yup
    .mixed<CreateRemediationPlanForm["priority"]>()
    .oneOf(["low", "medium", "high", "critical"])
    .required("Priority is required"),
  status: yup
    .mixed<CreateRemediationPlanForm["status"]>()
    .oneOf(["pending", "in_progress", "completed"])
    .required("Status is required"),
  estimatedEffortHours: yup
    .number()
    .typeError("Estimated Effort must be a number")
    .positive("Estimated Effort must be positive")
    .optional(),
  ownerSuggested: yup.string().required("Owner/Assignee is required"),
  dueDate: yup.string().required("Due Date is required"),
})

const DEFAULT_FORM_VALUES: CreateRemediationPlanForm = {
  findingId: "",
  title: "",
  description: "",
  priority: "medium",
  estimatedEffortHours: undefined,
  ownerSuggested: "",
  status: "pending",
  dueDate: "",
}

export function CreateRemediationDialog({ open, onClose, onSubmit, editingRemediation }: CreateRemediationDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRemediationPlanForm>({
    resolver: yupResolver(remediationSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (editingRemediation) {
        reset(editingRemediation)
      } else {
        reset(DEFAULT_FORM_VALUES)
      }
    }
  }, [open, editingRemediation, reset])

  useEffect(() => {
    if (!open) {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [open, reset])

  const handleFormSubmit: SubmitHandler<CreateRemediationPlanForm> = (data) => {
    onSubmit(data)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{editingRemediation ? "Edit Remediation Plan" : "Create Remediation Plan"}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {editingRemediation
            ? "Update the remediation plan details below."
            : "Create a new remediation plan to address compliance findings."}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="findingId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Finding ID"
                    fullWidth
                    required
                    error={!!errors.findingId}
                    helperText={errors.findingId?.message}
                    placeholder="e.g., REQ-8.2.3"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    required
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    placeholder="e.g., Implement Multi-Factor Authentication"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Describe the remediation plan in detail..."
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Priority"
                    fullWidth
                    required
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    required
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Due Date"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="estimatedEffortHours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Effort (hours)"
                    type="number"
                    fullWidth
                    error={!!errors.estimatedEffortHours}
                    helperText={errors.estimatedEffortHours?.message}
                    placeholder="e.g., 40"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === "" ? undefined : Number(value))
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="ownerSuggested"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Owner/Assignee"
                    fullWidth
                    required
                    error={!!errors.ownerSuggested}
                    helperText={errors.ownerSuggested?.message}
                    placeholder="e.g., John Smith"
                  />
                )}
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ mt: 3, px: 0 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <PrimaryLoadingButton type="submit" loading={isSubmitting}>
              {editingRemediation ? "Update Plan" : "Create Plan"}
            </PrimaryLoadingButton>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
