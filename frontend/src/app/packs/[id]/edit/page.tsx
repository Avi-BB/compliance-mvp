"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Container, Box, Typography, CircularProgress } from "@mui/material"
import { AuthGuard } from "@/components/auth/auth-guard"
import { PackBuilder } from "@/components/packs/pack-builder"
import { mockPromptPacks, mockPrompts } from "@/lib/mock-data"
import type { PromptPack, Prompt } from "@/lib/types"

export default function EditPackPage() {
  const params = useParams()
  const packId = params.id as string

  const [pack, setPack] = useState<PromptPack | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPackData = async () => {
      try {
        setLoading(true)

        // Mock API calls - in real app, fetch from API
        await new Promise((resolve) => setTimeout(resolve, 500))

        const packData = mockPromptPacks.find((p) => p.id === packId)
        if (!packData) {
          setError("Prompt pack not found")
          return
        }

        const packPrompts = mockPrompts.filter((p) => p.packId === packId)

        setPack(packData)
        setPrompts(packPrompts)
      } catch (err) {
        setError("Failed to load prompt pack")
      } finally {
        setLoading(false)
      }
    }

    if (packId) {
      loadPackData()
    }
  }, [packId])

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </Box>
        </Container>
      </AuthGuard>
    )
  }

  if (error || !pack) {
    return (
      <AuthGuard requireAuth={true}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" gutterBottom>
              {error || "Prompt pack not found"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The prompt pack you're trying to edit doesn't exist or you don't have permission to edit it.
            </Typography>
          </Box>
        </Container>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PackBuilder existingPack={pack} existingPrompts={prompts} />
      </Container>
    </AuthGuard>
  )
}
