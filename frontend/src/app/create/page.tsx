"use client"

import { Container } from "@mui/material"
import { AuthGuard } from "@/components/auth/auth-guard"
import { PackBuilder } from "@/components/packs/pack-builder"

export default function CreatePackPage() {
  return (
    <AuthGuard requireAuth={true}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PackBuilder />
      </Container>
    </AuthGuard>
  )
}
