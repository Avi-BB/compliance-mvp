"use client"

import { Container } from "@mui/material"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <DashboardContent />
      </Container>
    </AuthGuard>
  )
}
