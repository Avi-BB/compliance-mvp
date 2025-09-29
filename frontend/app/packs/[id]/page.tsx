"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Container, Box, Typography, CircularProgress } from "@mui/material"
import { PromptPackViewer } from "@/components/packs/prompt-pack-viewer"
import { mockPromptPacks, mockPrompts, mockRatings } from "@/lib/mock-data"
import type { PromptPack, Prompt, Rating } from "@/lib/types"

export default function PromptPackPage() {
  const params = useParams()
  const packId = params.id as string

  const [pack, setPack] = useState<PromptPack | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPackData = async () => {
      try {
        setLoading(true)

        // Mock API calls - in real app, fetch from API
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading

        const packData = mockPromptPacks.find((p) => p.id === packId)
        if (!packData) {
          setError("Prompt pack not found")
          return
        }

        const packPrompts = mockPrompts.filter((p) => p.packId === packId)
        const packRatings = mockRatings.filter((r) => r.packId === packId)

        setPack(packData)
        setPrompts(packPrompts)
        setRatings(packRatings)
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
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !pack) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" gutterBottom>
            {error || "Prompt pack not found"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The prompt pack you're looking for doesn't exist or has been removed.
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PromptPackViewer pack={pack} prompts={prompts} ratings={ratings} />
    </Container>
  )
}
