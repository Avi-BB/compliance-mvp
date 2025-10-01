"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Finding } from "@/lib/types/findings";
import { CreateFindingRequest } from "@/lib/api/findings";

interface AddFindingDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  editingFinding?: Finding | null;
  onSubmitFinding: (data: Finding) => void;
}

type Severity = "critical" | "high" | "medium" | "low";

const severityOptions: Severity[] = ["critical", "high", "medium", "low"];
const frameworkOptions = ["PCI DSS", "GDPR", "ISO 27001", "SOX"];

const schema = yup.object({
  title: yup.string().required("Title is required").trim(),
  description: yup.string().required("Description is required").trim(),
  severity: yup.mixed<Severity>().oneOf(severityOptions).required("Severity is required"),
  framework: yup.string().required("Framework is required"),
  category: yup.string().required("Category is required").trim(),
  assignee: yup.string().required("Assignee is required").trim(),
  dueDate: yup.string().required("Due Date is required"),
});

const AddFindingDialog: React.FC<AddFindingDialogProps> = ({
  openDialog,
  setOpenDialog,
  editingFinding,
  onSubmitFinding,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFindingRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      severity: "medium",
      framework: "",
      category: "",
      assignee: "",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (editingFinding) {
      reset({
        title: editingFinding.title,
        description: editingFinding.description,
        severity: editingFinding.severity as Severity,
        framework: editingFinding.framework,
        category: editingFinding.category,
        assignee: editingFinding.assignee,
        dueDate: editingFinding.dueDate,
      })
    } else if (openDialog) {
      reset({
        title: "",
        description: "",
        severity: "medium",
        framework: "",
        category: "",
        assignee: "",
        dueDate: "",
      })
    }
  }, [editingFinding, openDialog, reset])

  const onSubmit: SubmitHandler<CreateFindingRequest> = (data) => {
    const fullData: Finding = {
      id: editingFinding?.id || "",
      status: editingFinding?.status || "open",
      createdDate: editingFinding?.createdDate || new Date().toISOString(),
      riskScore: editingFinding?.riskScore || 0,
      ...data,
    };
    onSubmitFinding(fullData);
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
    reset();
  };


  return (
    <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingFinding ? "Edit Finding" : "Add New Finding"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Title"
                    multiline
                    rows={3}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="severity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    required
                    label="Severity"
                    error={!!errors.severity}
                    helperText={errors.severity?.message}
                  >
                    {severityOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="framework"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    select
                    label="Framework"
                    error={!!errors.framework}
                    helperText={errors.framework?.message}
                  >
                    {frameworkOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Assignee"
                    error={!!errors.assignee}
                    helperText={errors.assignee?.message}
                  />
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
                    fullWidth
                    type="date"
                    required
                    label="Due Date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{
            background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, rgba(59, 46, 172, 1) 0%, rgba(14, 165, 115, 1) 100%)",
            },
          }}
        >
          {editingFinding ? "Save Changes" : "Add Finding"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddFindingDialog;
