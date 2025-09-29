"use client"

import { Box, Typography, Chip, Card, CardContent, Divider } from "@mui/material"
import { mockCategories } from "@/lib/mock-data"
import type { Prompt } from "@/lib/types"

interface PackPreviewProps {
  packData: {
    title: string
    description: string
    categoryId: string
    tags: string[]
    isPublic: boolean
    license: string
    version: string
  }
  prompts: Prompt[]
}

export function PackPreview({ packData, prompts }: PackPreviewProps) {
  const category = mockCategories.find((c) => c.id === packData.categoryId)

  return (
    <Box sx={{ maxHeight: "70vh", overflow: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {packData.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {packData.description}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {packData.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Typography variant="body2">
            <strong>Category:</strong> {category?.name}
          </Typography>
          <Typography variant="body2">
            <strong>Version:</strong> {packData.version}
          </Typography>
          <Typography variant="body2">
            <strong>License:</strong> {packData.license}
          </Typography>
          <Typography variant="body2">
            <strong>Visibility:</strong> {packData.isPublic ? "Public" : "Private"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Prompts ({prompts.length})
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {prompts.map((prompt, index) => (
          <Card key={prompt.id} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {index + 1}. {prompt.title}
              </Typography>
              {prompt.description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {prompt.description}
                </Typography>
              )}
              <Box
                sx={{
                  bgcolor: "grey.100",
                  p: 2,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  whiteSpace: "pre-wrap",
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                {prompt.content}
              </Box>
              {prompt.variables && Object.keys(prompt.variables).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Variables:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {Object.keys(prompt.variables).map((key) => (
                      <Chip key={key} label={`{{${key}}}`} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
