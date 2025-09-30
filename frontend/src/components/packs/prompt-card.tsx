"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Collapse,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material"
import { Copy, ChevronDown, ChevronUp, Wand2 } from "lucide-react"
import type { Prompt } from "@/lib/types"

interface PromptCardProps {
  prompt: Prompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [processedPrompt, setProcessedPrompt] = useState(prompt.content)
  const [copied, setCopied] = useState(false)

  const handleVariableChange = (key: string, value: string) => {
    const newVariables = { ...variables, [key]: value }
    setVariables(newVariables)

    // Process the prompt with variables
    let processed = prompt.content
    Object.entries(newVariables).forEach(([varKey, varValue]) => {
      const regex = new RegExp(`{{${varKey}}}`, "g")
      processed = processed.replace(regex, varValue || `{{${varKey}}}`)
    })
    setProcessedPrompt(processed)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getVariableInput = (key: string, config: any) => {
    if (typeof config === "string") {
      if (config.startsWith("select:")) {
        const options = config.replace("select:", "").split(",")
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{key}</InputLabel>
            <Select
              value={variables[key] || ""}
              label={key}
              onChange={(e) => handleVariableChange(key, e.target.value)}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      } else {
        return (
          <TextField
            fullWidth
            size="small"
            label={key}
            value={variables[key] || ""}
            onChange={(e) => handleVariableChange(key, e.target.value)}
            placeholder={`Enter ${key}`}
          />
        )
      }
    }

    return (
      <TextField
        fullWidth
        size="small"
        label={key}
        value={variables[key] || ""}
        onChange={(e) => handleVariableChange(key, e.target.value)}
        placeholder={`Enter ${key}`}
      />
    )
  }

  const hasVariables = prompt.variables && Object.keys(prompt.variables).length > 0

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {prompt.title}
            </Typography>
            {prompt.description && (
              <Typography variant="body2" color="text.secondary" paragraph>
                {prompt.description}
              </Typography>
            )}
            {prompt.category && <Chip label={prompt.category} size="small" variant="outlined" sx={{ mb: 2 }} />}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Copy size={16} />}
              onClick={handleCopy}
              color={copied ? "success" : "primary"}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            {hasVariables && (
              <IconButton onClick={() => setExpanded(!expanded)} size="small">
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Variables Section */}
        {hasVariables && (
          <Collapse in={expanded}>
            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Wand2 size={16} />
                Customize Variables
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(prompt.variables || {}).map(([key, config]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    {getVariableInput(key, config)}
                  </Grid>
                ))}
              </Grid>
              {prompt.exampleInput && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Example:</strong> {prompt.exampleInput}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Collapse>
        )}

        {/* Prompt Content */}
        <Box
          sx={{
            bgcolor: "grey.900",
            color: "white",
            p: 2,
            borderRadius: 1,
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            position: "relative",
          }}
        >
          {processedPrompt}
        </Box>

        {/* Example Output */}
        {prompt.exampleOutput && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Example Output:
            </Typography>
            <Box
              sx={{
                bgcolor: "success.light",
                color: "success.contrastText",
                p: 2,
                borderRadius: 1,
                fontSize: "0.875rem",
                lineHeight: 1.6,
              }}
            >
              {prompt.exampleOutput}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
