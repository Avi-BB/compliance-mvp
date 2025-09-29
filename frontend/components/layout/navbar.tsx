"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  InputBase,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Search, MenuIcon, Zap } from "lucide-react"
import { styled } from "@mui/material/styles"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/hooks/use-auth"

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}))

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {isMobile && isAuthenticated && (
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Zap size={24} style={{ marginRight: 8 }} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              fontWeight: 700,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            PromptPack
          </Typography>
        </Box>

        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2, mr: 4 }}>
            <Button color="inherit" component={Link} href="/browse">
              Browse
            </Button>
            <Button color="inherit" component={Link} href="/categories">
              Categories
            </Button>
            <Button color="inherit" component={Link} href="/featured">
              Featured
            </Button>
            {isAuthenticated && (
              <Button color="inherit" component={Link} href="/create">
                Create
              </Button>
            )}
          </Box>
        )}

        {/* Search */}
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: 400 }}>
          <SearchContainer>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search prompt packs..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
        </Box>

        {/* Auth Buttons / User Menu */}
        <Box sx={{ ml: 2 }}>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit" component={Link} href="/login">
                Sign In
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                href="/register"
                sx={{ borderColor: "rgba(255, 255, 255, 0.5)" }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
