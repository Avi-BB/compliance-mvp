"use client"

import { Box, Container } from "@mui/material"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  )
}
