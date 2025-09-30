"use client"
import type React from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import { Box } from "@mui/material"

const publicRoutes = ["/", "/login", "/register"]

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) {
    return <Box sx={{ width: "100%" }}>{children}</Box>
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        {children}
      </Box>
    </Box>
  )
}