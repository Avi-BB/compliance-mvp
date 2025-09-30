"use client"

import { useParams } from "next/navigation"
import { Container, Box, Typography, Button } from "@mui/material"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/auth-guard"
import { PromptPackViewer } from "@/components/packs/prompt-pack-viewer"
import { mockPromptPacks, mockPrompts, mockRatings } from "@/lib/mock-data"

export default function PackViewPage() {
  const params = useParams()
  const packId = params?.id as string

  const pack = mockPromptPacks.find((p) => p.id === packId)
  const prompts = mockPrompts.filter((p) => p.packId === packId)
  const ratings = mockRatings.filter((r) => r.packId === packId)

  if (!pack) {
    return (
      <AuthGuard requireAuth={true}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" gutterBottom>
              Pack Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The prompt pack you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/packs"
              startIcon={<ArrowLeft size={20} />}
            >
              Back to Packs
            </Button>
          </Box>
        </Container>
      </AuthGuard>
    )
  }

  const handleDownload = () => {
    console.log("Downloading pack:", pack.id)
    // In a real implementation, this would trigger a download
    alert(`Downloading ${pack.title}...`)
  }

  const handleLike = (liked: boolean) => {
    console.log("Liked:", liked)
    // In a real implementation, this would update the like status via API
  }

  const handleRate = (rating: any) => {
    console.log("Rating submitted:", rating)
    // In a real implementation, this would submit the rating via API
  }

  return (
    <AuthGuard requireAuth={true}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            component={Link}
            href="/packs"
            startIcon={<ArrowLeft size={20} />}
            sx={{ mb: 2 }}
          >
            Back to Packs
          </Button>
        </Box>

        <PromptPackViewer
          pack={pack}
          prompts={prompts}
          ratings={ratings}
          onDownload={handleDownload}
          onLike={handleLike}
          onRate={handleRate}
        />
      </Container>
    </AuthGuard>
  )
}