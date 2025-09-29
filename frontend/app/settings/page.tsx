"use client"
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
} from "@mui/material"
import { Settings, Security, Edit, Delete, Add } from "@mui/icons-material"
import { useState } from "react"
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
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      organization: user?.organization || "",
      phone: "",
    },
  })

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Settings sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
      </Box>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Navigation */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <List>
                <ListItem
                  button
                  selected={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem
                  button
                  selected={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemText primary="Notifications" />
                </ListItem>
                <ListItem
                  button
                  selected={activeTab === "security"}
                  onClick={() => setActiveTab("security")}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemText primary="Security" />
                </ListItem>
                {user?.role === "admin" && (
                  <ListItem
                    button
                    selected={activeTab === "users"}
                    onClick={() => setActiveTab("users")}
                    sx={{ borderRadius: 1 }}
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
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmitProfile)} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        {...register("firstName", { required: "First name is required" })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        {...register("lastName", { required: "Last name is required" })}
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Organization"
                        error={!!errors.organization}
                        helperText={errors.organization?.message}
                        {...register("organization", { required: "Organization is required" })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Phone Number" {...register("phone")} />
                    </Grid>
                  </Grid>
                  <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                    Update Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange("emailNotifications")}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
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
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
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
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
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
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
                    Get weekly compliance summary reports
                  </Typography>

                  <Button variant="contained" sx={{ mt: 2 }}>
                    Save Preferences
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Change Password
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Current Password" type="password" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="New Password" type="password" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Confirm New Password" type="password" />
                    </Grid>
                  </Grid>
                  <Button variant="contained" sx={{ mb: 3 }}>
                    Update Password
                  </Button>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Add an extra layer of security to your account
                  </Typography>
                  <Button variant="outlined" startIcon={<Security />}>
                    Enable 2FA
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && user?.role === "admin" && (
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">User Management</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setOpenUserDialog(true)}>
                    Add User
                  </Button>
                </Box>
                <List>
                  {mockUsers.map((user) => (
                    <ListItem key={user.id} divider>
                      <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
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
                          <Edit />
                        </IconButton>
                        <IconButton edge="end">
                          <Delete />
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
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Role" select SelectProps={{ native: true }}>
                <option value="viewer">Viewer</option>
                <option value="auditor">Auditor</option>
                <option value="compliance_officer">Compliance Officer</option>
                <option value="admin">Admin</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenUserDialog(false)}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
