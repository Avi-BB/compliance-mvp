"use client"

import { Box, Container } from "@mui/material"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth/auth-guard"

const LoginForm = dynamic(() => import("@/components/auth/login-form").then((m) => m.LoginForm), {
  ssr: false,
})

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, rgba(69, 56, 202, 0.03) 0%, transparent 50%, rgba(16, 185, 129, 0.03) 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <LoginForm />
        </Container>
      </Box>
    </AuthGuard>
  )
}