"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material"
import { Plus, Trash2, Save, Eye, ArrowLeft, Upload } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { PromptEditor } from "./prompt-editor"
import { PackPreview } from "./pack-preview"
import { mockCategories } from "@/lib/mock-data"
import type { PromptPack, Prompt } from "@/lib/types"

interface PackBuilderProps {
  existingPack?: PromptPack
  existingPrompts?: Prompt[]
}

interface PackFormData {
  title: string
  description: string
  categoryId: string
  tags: string[]
  isPublic: boolean
  license: string
  version: string
}

const steps = ["Pack Details", "Add Prompts", "Review & Publish"]

export function PackBuilder({ existingPack, existingPrompts = [] }: PackBuilderProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [packData, setPackData] = useState<PackFormData>({
    title: existingPack?.title || "",
    description: existingPack?.description || "",
    categoryId: existingPack?.categoryId || "",
    tags: existingPack?.tags || [],
    isPublic: existingPack?.isPublic ?? true,
    license: existingPack?.license || "MIT",
    version: existingPack?.version || "1.0.0",
  })
  const [prompts, setPrompts] = useState<Prompt[]>(existingPrompts)
  const [currentTag, setCurrentTag] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { user } = useAuth()
  const router = useRouter()
  const isEditing = !!existingPack

  const handlePackDataChange = (field: keyof PackFormData, value: any) => {
    setPackData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !packData.tags.includes(currentTag.trim())) {
      handlePackDataChange("tags", [...packData.tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handlePackDataChange(
      "tags",
      packData.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleAddPrompt = () => {
    const newPrompt: Prompt = {
      id: `temp-${Date.now()}`,
      packId: existingPack?.id || "new",
      title: "",
      content: "",
      description: "",
      category: "",
      variables: {},
      orderIndex: prompts.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPrompts([...prompts, newPrompt])
  }

  const handleUpdatePrompt = (promptId: string, updates: Partial<Prompt>) => {
    setPrompts((prev) => prev.map((prompt) => (prompt.id === promptId ? { ...prompt, ...updates } : prompt)))
  }

  const handleDeletePrompt = (promptId: string) => {
    setPrompts((prev) => prev.filter((prompt) => prompt.id !== promptId))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!packData.title.trim()) newErrors.title = "Title is required"
      if (!packData.description.trim()) newErrors.description = "Description is required"
      if (!packData.categoryId) newErrors.categoryId = "Category is required"
      if (packData.tags.length === 0) newErrors.tags = "At least one tag is required"
    }

    if (step === 1) {
      if (prompts.length === 0) newErrors.prompts = "At least one prompt is required"
      const invalidPrompts = prompts.filter((p) => !p.title.trim() || !p.content.trim())
      if (invalidPrompts.length > 0) newErrors.prompts = "All prompts must have a title and content"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleSave = async (publish = false) => {
    if (!validateStep(0) || !validateStep(1)) return

    setSaving(true)
    try {
      // Mock API call - in real app, save to backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const packPayload = {
        ...packData,
        authorId: user?.id,
        prompts: prompts.map((p, index) => ({ ...p, orderIndex: index })),
        isPublic: publish ? packData.isPublic : false,
      }

      console.log("Saving pack:", packPayload)

      // Redirect to pack view or dashboard
      if (isEditing) {
        router.push(`/packs/${existingPack.id}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to save pack:", error)
    } finally {
      setSaving(false)
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Pack Title"
              value={packData.title}
              onChange={(e) => handlePackDataChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter a descriptive title for your prompt pack"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={packData.description}
              onChange={(e) => handlePackDataChange("description", e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe what your prompt pack does and who it's for"
            />

            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel>Category</InputLabel>
              <Select
                value={packData.categoryId}
                label="Category"
                onChange={(e) => handlePackDataChange("categoryId", e.target.value)}
              >
                {mockCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.categoryId}
                </Typography>
              )}
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {packData.tags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} size="small" />
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button variant="outlined" onClick={handleAddTag} disabled={!currentTag.trim()}>
                  Add
                </Button>
              </Box>
              {errors.tags && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.tags}
                </Typography>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Version"
                  value={packData.version}
                  onChange={(e) => handlePackDataChange("version", e.target.value)}
                  placeholder="1.0.0"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>License</InputLabel>
                  <Select
                    value={packData.license}
                    label="License"
                    onChange={(e) => handlePackDataChange("license", e.target.value)}
                  >
                    <MenuItem value="MIT">MIT</MenuItem>
                    <MenuItem value="Apache-2.0">Apache 2.0</MenuItem>
                    <MenuItem value="GPL-3.0">GPL 3.0</MenuItem>
                    <MenuItem value="BSD-3-Clause">BSD 3-Clause</MenuItem>
                    <MenuItem value="CC0-1.0">CC0 1.0</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={packData.isPublic}
                  onChange={(e) => handlePackDataChange("isPublic", e.target.checked)}
                />
              }
              label="Make this pack public"
            />
          </Box>
        )

      case 1:
        return (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">Prompts ({prompts.length})</Typography>
              <Button variant="outlined" startIcon={<Plus size={20} />} onClick={handleAddPrompt}>
                Add Prompt
              </Button>
            </Box>

            {errors.prompts && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.prompts}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {prompts.map((prompt, index) => (
                <Card key={prompt.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle1">Prompt {index + 1}</Typography>
                      <IconButton color="error" onClick={() => handleDeletePrompt(prompt.id)} size="small">
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                    <PromptEditor prompt={prompt} onChange={(updates) => handleUpdatePrompt(prompt.id, updates)} />
                  </CardContent>
                </Card>
              ))}

              {prompts.length === 0 && (
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      No prompts yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Add your first prompt to get started
                    </Typography>
                    <Button variant="contained" startIcon={<Plus size={20} />} onClick={handleAddPrompt}>
                      Add First Prompt
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Pack
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Review your prompt pack before publishing. You can always edit it later.
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Title:
                    </Typography>
                    <Typography variant="body1">{packData.title}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Category:
                    </Typography>
                    <Typography variant="body1">
                      {mockCategories.find((c) => c.id === packData.categoryId)?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Description:
                    </Typography>
                    <Typography variant="body1">{packData.description}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Tags:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                      {packData.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Prompts:
                    </Typography>
                    <Typography variant="body1">{prompts.length}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Visibility:
                    </Typography>
                    <Typography variant="body1">{packData.isPublic ? "Public" : "Private"}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Button
              variant="outlined"
              startIcon={<Eye size={20} />}
              onClick={() => setShowPreview(true)}
              sx={{ mb: 3 }}
            >
              Preview Pack
            </Button>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditing ? "Edit Pack" : "Create New Pack"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? "Update your prompt pack" : "Build and share your prompt pack with the community"}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<ArrowLeft size={20} />} onClick={() => router.back()}>
          Back
        </Button>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      {index === steps.length - 1 ? (
                        <>
                          <Button
                            variant="outlined"
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            startIcon={<Save size={20} />}
                          >
                            {saving ? "Saving..." : "Save Draft"}
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            startIcon={<Upload size={20} />}
                          >
                            {saving ? "Publishing..." : "Publish Pack"}
                          </Button>
                        </>
                      ) : (
                        <Button variant="contained" onClick={handleNext}>
                          Continue
                        </Button>
                      )}
                      {index > 0 && (
                        <Button variant="outlined" onClick={handleBack}>
                          Back
                        </Button>
                      )}
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Pack Preview</DialogTitle>
        <DialogContent>
          <PackPreview packData={packData} prompts={prompts} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
