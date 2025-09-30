"use client"

import { motion } from "framer-motion"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Container,
} from "@mui/material"
import { Settings, Shield, Edit, Trash2, UserPlus, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useForm } from "react-hook-form"

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  organization: string
  phone: string
}

interface NotificationSettings {
  emailNotifications: boolean
  riskAlerts: boolean
  complianceUpdates: boolean
  weeklyReports: boolean
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [showSuccess, setShowSuccess] = useState(false)
  const [openUserDialog, setOpenUserDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    riskAlerts: true,
    complianceUpdates: false,
    weeklyReports: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
      phone: "",
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (user && isMounted) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        organization: user.organization || "",
        phone: "",
      })
    }
  }, [user, isMounted, reset])

  const onSubmitProfile = async (data: ProfileFormData) => {
    console.log("[v0] Profile update:", data)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  // Mock users data
  const mockUsers = [
    { id: "1", name: "John Smith", email: "john@company.com", role: "admin", status: "active" },
    { id: "2", name: "Sarah Johnson", email: "sarah@company.com", role: "compliance_officer", status: "active" },
    { id: "3", name: "Mike Davis", email: "mike@company.com", role: "auditor", status: "inactive" },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <Box sx={{ 
      flexGrow: 1, 
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(69, 56, 202, 0.03) 0%, transparent 50%, rgba(16, 185, 129, 0.03) 100%)",
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Settings size={32} style={{ color: "#4538CA" }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Settings
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
              Manage your account settings and preferences.
            </Typography>
          </Box>
        </motion.div>

        {showSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2, border: "1px solid", borderColor: "success.main" }}
          >
            Settings updated successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Navigation */}
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 2 }}>
                <List>
                  <ListItem
                    button
                    selected={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&.Mui-selected": {
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                        borderLeft: "3px solid #4538CA",
                      },
                    }}
                  >
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem
                    button
                    selected={activeTab === "notifications"}
                    onClick={() => setActiveTab("notifications")}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&.Mui-selected": {
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                        borderLeft: "3px solid #4538CA",
                      },
                    }}
                  >
                    <ListItemText primary="Notifications" />
                  </ListItem>
                  <ListItem
                    button
                    selected={activeTab === "security"}
                    onClick={() => setActiveTab("security")}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&.Mui-selected": {
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                        borderLeft: "3px solid #4538CA",
                      },
                    }}
                  >
                    <ListItemText primary="Security" />
                  </ListItem>
                  {user?.role === "admin" && (
                    <ListItem
                      button
                      selected={activeTab === "users"}
                      onClick={() => setActiveTab("users")}
                      sx={{
                        borderRadius: 2,
                        "&.Mui-selected": {
                          background: "linear-gradient(90deg, rgba(69, 56, 202, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                          borderLeft: "3px solid #4538CA",
                        },
                      }}
                    >
                      <ListItemText primary="User Management" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={9}>
            {activeTab === "profile" && (
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Profile Information
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit(onSubmitProfile)} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          {...register("firstName", { required: "First name is required" })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                          {...register("lastName", { required: "Last name is required" })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Organization"
                          error={!!errors.organization}
                          helperText={errors.organization?.message}
                          {...register("organization", { required: "Organization is required" })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          {...register("phone")}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 4,
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(69, 56, 202, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(90deg, rgba(69, 56, 202, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)",
                          boxShadow: "0 6px 16px rgba(69, 56, 202, 0.4)",
                        },
                      }}
                    >
                      Update Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Notification Preferences
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.emailNotifications}
                          onChange={() => handleNotificationChange("emailNotifications")}
                        />
                      }
                      label="Email Notifications"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                      Receive general notifications via email
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.riskAlerts}
                          onChange={() => handleNotificationChange("riskAlerts")}
                        />
                      }
                      label="Risk Alerts"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                      Get notified about high-risk findings immediately
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.complianceUpdates}
                          onChange={() => handleNotificationChange("complianceUpdates")}
                        />
                      }
                      label="Compliance Updates"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                      Receive updates about regulatory changes
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.weeklyReports}
                          onChange={() => handleNotificationChange("weeklyReports")}
                        />
                      }
                      label="Weekly Reports"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                      Get weekly compliance summary reports
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 2,
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(69, 56, 202, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(90deg, rgba(69, 56, 202, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)",
                          boxShadow: "0 6px 16px rgba(69, 56, 202, 0.4)",
                        },
                      }}
                    >
                      Save Preferences
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Security Settings
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Change Password
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type="password"
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type="password"
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type="password"
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        mb: 4,
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(69, 56, 202, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(90deg, rgba(69, 56, 202, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)",
                          boxShadow: "0 6px 16px rgba(69, 56, 202, 0.4)",
                        },
                      }}
                    >
                      Update Password
                    </Button>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Add an extra layer of security to your account
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Shield size={20} />}
                      size="large"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        borderColor: "#4538CA",
                        color: "#4538CA",
                        "&:hover": {
                          borderColor: "#4538CA",
                          bgcolor: "rgba(69, 56, 202, 0.05)",
                        },
                      }}
                    >
                      Enable 2FA
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {activeTab === "users" && user?.role === "admin" && (
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      User Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<UserPlus size={20} />}
                      onClick={() => setOpenUserDialog(true)}
                      sx={{
                        background: "linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(69, 56, 202, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(90deg, rgba(69, 56, 202, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)",
                          boxShadow: "0 6px 16px rgba(69, 56, 202, 0.4)",
                        },
                      }}
                    >
                      Add User
                    </Button>
                  </Box>
                  <List>
                    {mockUsers.map((user) => (
                      <ListItem
                        key={user.id}
                        divider
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          "&:hover": { bgcolor: "rgba(69, 56, 202, 0.02)" },
                        }}
                      >
                        <Avatar
                          sx={{
                            mr: 2,
                            background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                            fontWeight: 600,
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={user.name}
                          secondary={
                            <Box>
                              <Typography variant="body2">{user.email}</Typography>
                              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <Chip label={user.role.replace("_", " ")} size="small" />
                                <Chip
                                  label={user.status}
                                  size="small"
                                  color={user.status === "active" ? "success" : "default"}
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" sx={{ mr: 1 }}>
                            <Edit size={18} />
                          </IconButton>
                          <IconButton edge="end">
                            <Trash2 size={18} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Add User Dialog */}
        <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Add New User</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  select
                  SelectProps={{ native: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                  <option value="viewer">Viewer</option>
                  <option value="auditor">Auditor</option>
                  <option value="compliance_officer">Compliance Officer</option>
                  <option value="admin">Admin</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenUserDialog(false)} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenUserDialog(false)}
              sx={{
                background: "linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(69, 56, 202, 0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, rgba(69, 56, 202, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)",
                  boxShadow: "0 6px 16px rgba(69, 56, 202, 0.4)",
                },
              }}
            >
              Add User
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}