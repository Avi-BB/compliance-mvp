"use client"

import { Box, Container } from "@mui/material"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
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
        <RegisterForm />
      </Container>
    </Box>
  )
}
