"use client"

import React from "react"
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
} from "@mui/material"
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Person,
  AdminPanelSettings,
  Security,
} from "@mui/icons-material"

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
      return <AdminPanelSettings />
    case "compliance_officer":
      return <Security />
    case "auditor":
      return <CheckCircle />
    default:
      return <Person />
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
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light` }}>
          <Icon />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
)

export default function UsersPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null)

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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage user accounts, roles, and permissions for your organization.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large">
          Add User
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={mockUsers.length} icon={Person} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Users" value={activeUsers} icon={CheckCircle} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Administrators" value={adminUsers} icon={AdminPanelSettings} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Compliance Officers" value={complianceOfficers} icon={Security} color="info" />
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Users
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
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
                      <Typography variant="body2" color="textSecondary">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="More actions">
                        <IconButton size="small" onClick={(e) => handleMenuClick(e, user.id)}>
                          <MoreVert />
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
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Block fontSize="small" sx={{ mr: 1 }} />
          Deactivate
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>
    </Box>
  )
}
