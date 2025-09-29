"use client"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Avatar,
  Button,
} from "@mui/material"
import { Dashboard, Description, Assessment, FindInPage, Build, People, Settings, Logout } from "@mui/icons-material"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"

const drawerWidth = 240

const menuItems = [
  { text: "Dashboard", icon: Dashboard, path: "/dashboard" },
  { text: "Documents", icon: Description, path: "/documents" },
  { text: "Assessments", icon: Assessment, path: "/assessments" },
  { text: "Findings", icon: FindInPage, path: "/findings" },
  { text: "Remediation", icon: Build, path: "/remediation" },
  { text: "Users", icon: People, path: "/users" },
  { text: "Settings", icon: Settings, path: "/settings" },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Assessment color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            ComplianceHQ
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      {user && (
        <Box sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user.firstName[0]}
              {user.lastName[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user.role.replace("_", " ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton selected={pathname === item.path} onClick={() => router.push(item.path)}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<Logout />} onClick={handleLogout}>
          Sign Out
        </Button>
      </Box>
    </Drawer>
  )
}
