"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Container,
} from "@mui/material"
import {
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Users,
  ShieldCheck,
  Shield,
  Sparkles,
} from "lucide-react"

// Mock user data
const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    role: "admin",
    status: "active",
    organization: "ACME Corp",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    role: "compliance_officer",
    status: "active",
    organization: "ACME Corp",
    lastLogin: "2024-01-14T16:45:00Z",
    createdAt: "2023-08-15T00:00:00Z",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@company.com",
    role: "auditor",
    status: "inactive",
    organization: "ACME Corp",
    lastLogin: "2024-01-10T09:15:00Z",
    createdAt: "2023-09-20T00:00:00Z",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@company.com",
    role: "viewer",
    status: "active",
    organization: "ACME Corp",
    lastLogin: "2024-01-15T14:20:00Z",
    createdAt: "2023-11-10T00:00:00Z",
  },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <ShieldCheck size={16} />
    case "compliance_officer":
      return <Shield size={16} />
    case "auditor":
      return <CheckCircle size={16} />
    default:
      return <Users size={16} />
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "error"
    case "compliance_officer":
      return "primary"
    case "auditor":
      return "warning"
    default:
      return "default"
  }
}

const getStatusColor = (status: string) => {
  return status === "active" ? "success" : "default"
}

const StatCard = ({ title, value, icon: Icon, color = "primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card
      sx={{
        height: "100%",
        minHeight: 160,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(135deg, ${
          color === "primary"
            ? "rgba(69, 56, 202, 0.05)"
            : color === "success"
              ? "rgba(16, 185, 129, 0.05)"
              : color === "error"
                ? "rgba(239, 68, 68, 0.05)"
                : "rgba(59, 130, 246, 0.05)"
        } 0%, transparent 100%)`,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: `${color}.main`,
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px rgba(69, 56, 202, 0.15)`,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
              {title}
            </Typography>
            <Typography variant="h3" component="div" color={`${color}.main`} sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${
                color === "primary"
                  ? "rgba(69, 56, 202, 0.1)"
                  : color === "success"
                    ? "rgba(16, 185, 129, 0.1)"
                    : color === "error"
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(59, 130, 246, 0.1)"
              }`,
              display: "inline-flex",
              flexShrink: 0,
              ml: 2,
            }}
          >
            <Icon
              size={24}
              style={{
                color:
                  color === "primary"
                    ? "#4538CA"
                    : color === "success"
                      ? "#10B981"
                      : color === "error"
                        ? "#EF4444"
                        : "#3B82F6",
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
)

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso))

export default function UsersPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(userId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const activeUsers = mockUsers.filter((user) => user.status === "active").length
  const adminUsers = mockUsers.filter((user) => user.role === "admin").length
  const complianceOfficers = mockUsers.filter((user) => user.role === "compliance_officer").length

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
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  User Management
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
                Manage user accounts, roles, and permissions for your compliance platform.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<UserPlus size={20} />}
              size="large"
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
        </motion.div>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Users" value={mockUsers.length} icon={Users} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Users" value={activeUsers} icon={CheckCircle} color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Administrators" value={adminUsers} icon={ShieldCheck} color="error" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Compliance Officers" value={complianceOfficers} icon={Shield} color="info" />
          </Grid>
        </Grid>

        {/* Users Table */}
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Organization</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                              fontWeight: 600,
                            }}
                          >
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.replace("_", " ")}
                          size="small"
                          color={getRoleColor(user.role)}
                          icon={getRoleIcon(user.role)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={user.status} size="small" color={getStatusColor(user.status)} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.organization}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {isMounted ? formatDate(user.lastLogin) : ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {isMounted ? formatDate(user.createdAt) : ""}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="More actions">
                          <IconButton size="small" onClick={(e) => handleMenuClick(e, user.id)}>
                            <MoreVertical size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit User
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Ban size={16} style={{ marginRight: 8 }} />
            Deactivate
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
            <Trash2 size={16} style={{ marginRight: 8 }} />
            Delete User
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  )
}