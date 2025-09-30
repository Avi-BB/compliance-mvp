"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, Box, IconButton, Menu, MenuItem, Typography, Divider, ListItemIcon, ListItemText } from "@mui/material"
import { User, Settings, LogOut, BookOpen, Heart, Download, Crown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()
  const router = useRouter()
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (path: string) => {
    handleClose()
    router.push(path)
  }

  const handleLogout = async () => {
    handleClose()
    await logout()
    router.push("/")
  }

  if (!user) return null

  // Derive safe display values
  const displayName = user.fullName || user.username || user.email || "User"
  const initial = (displayName.trim()[0] || "U").toUpperCase()

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar src={user.avatarUrl} alt={displayName} sx={{ width: 32, height: 32 }}>
          {initial}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {displayName}
            {user.isVerified && <Crown size={14} style={{ marginLeft: 4, color: "#F59E0B" }} />}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={() => handleMenuClick("/profile")}>
          <ListItemIcon>
            <User size={16} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick("/my-packs")}>
          <ListItemIcon>
            <BookOpen size={16} />
          </ListItemIcon>
          <ListItemText>My Packs</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick("/favorites")}>
          <ListItemIcon>
            <Heart size={16} />
          </ListItemIcon>
          <ListItemText>Favorites</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuClick("/downloads")}>
          <ListItemIcon>
            <Download size={16} />
          </ListItemIcon>
          <ListItemText>Downloads</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleMenuClick("/settings")}>
          <ListItemIcon>
            <Settings size={16} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}