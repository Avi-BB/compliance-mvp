"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Box, CircularProgress, Typography } from "@mui/material"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, redirectTo = "/login" }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, initialize } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const didInit = useRef(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      initialize()
    }
  }, [initialize])

  useEffect(() => {
    // Skip if still loading
    if (isLoading) {
      setShouldRender(false)
      return
    }

    // Handle auth requirements
    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      if (pathname !== redirectTo) {
        router.replace(redirectTo)
      }
      setShouldRender(false)
    } else if (!requireAuth && isAuthenticated) {
      // User shouldn't be authenticated but is (e.g., on login page)
      if (pathname !== "/dashboard") {
        router.replace("/dashboard")
      }
      setShouldRender(false)
    } else {
      // Auth state matches requirements
      setShouldRender(true)
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname])

  // Show loading screen
  if (!shouldRender) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    )
  }

  return <>{children}</>
}