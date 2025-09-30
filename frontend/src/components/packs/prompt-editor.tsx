"use client"

import { useState } from "react"
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Collapse,
} from "@mui/material"
import { Plus, ChevronDown, ChevronUp, Wand2 } from "lucide-react"
import type { Prompt } from "@/lib/types"

interface PromptEditorProps {
  prompt: Prompt
  onChange: (updates: Partial<Prompt>) => void
}

interface Variable {
  key: string
  type: "text" | "select"
  options?: string[]
}

export function PromptEditor({ prompt, onChange }: PromptEditorProps) {
  const [showVariables, setShowVariables] = useState(false)
  const [newVariableKey, setNewVariableKey] = useState("")
  const [newVariableType, setNewVariableType] = useState<"text" | "select">("text")
  const [newVariableOptions, setNewVariableOptions] = useState("")

  const variables: Variable[] = Object.entries(prompt.variables || {}).map(([key, config]) => {
    if (typeof config === "string" && config.startsWith("select:")) {
      return {
        key,
        type: "select",
        options: config.replace("select:", "").split(","),
      }
    }
    return { key, type: "text" }
  })

  const handleAddVariable = () => {
    if (!newVariableKey.trim()) return

    const newVariables = { ...prompt.variables }
    if (newVariableType === "select" && newVariableOptions.trim()) {
      newVariables[newVariableKey] = `select:${newVariableOptions}`
    } else {
      newVariables[newVariableKey] = "text"
    }

    onChange({ variables: newVariables })
    setNewVariableKey("")
    setNewVariableOptions("")
  }

  const handleRemoveVariable = (keyToRemove: string) => {
    const newVariables = { ...prompt.variables }
    delete newVariables[keyToRemove]
    onChange({ variables: newVariables })
  }

  const handleUpdateVariable = (oldKey: string, newKey: string, type: "text" | "select", options?: string[]) => {
    const newVariables = { ...prompt.variables }
    delete newVariables[oldKey]

    if (type === "select" && options) {
      newVariables[newKey] = `select:${options.join(",")}`
    } else {
      newVariables[newKey] = "text"
    }

    onChange({ variables: newVariables })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Prompt Title"
            value={prompt.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Enter a descriptive title"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Category"
            value={prompt.category || ""}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="e.g., Email, Social Media"
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        multiline
        rows={2}
        label="Description"
        value={prompt.description || ""}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Briefly describe what this prompt does"
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Prompt Content
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          value={prompt.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Enter your prompt here. Use {{variable_name}} for dynamic variables."
          sx={{
            "& .MuiInputBase-input": {
              fontFamily: "monospace",
              fontSize: "0.875rem",
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Use double curly braces like {"{{variable_name}}"} to create dynamic variables
        </Typography>
      </Box>

      {/* Variables Section */}
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Wand2 size={16} />
              Variables ({variables.length})
            </Typography>
            <IconButton size="small" onClick={() => setShowVariables(!showVariables)}>
              {showVariables ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </IconButton>
          </Box>

          <Collapse in={showVariables}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {variables.map((variable) => (
                <Box key={variable.key} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={`{{${variable.key}}}`}
                    variant="outlined"
                    size="small"
                    onDelete={() => handleRemoveVariable(variable.key)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {variable.type === "select" ? `Select: ${variable.options?.join(", ")}` : "Text input"}
                  </Typography>
                </Box>
              ))}

              {/* Add Variable Form */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "end", pt: 2, borderTop: 1, borderColor: "divider" }}>
                <TextField
                  size="small"
                  label="Variable Name"
                  value={newVariableKey}
                  onChange={(e) => setNewVariableKey(e.target.value)}
                  placeholder="variable_name"
                />
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newVariableType}
                    label="Type"
                    onChange={(e) => setNewVariableType(e.target.value as "text" | "select")}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="select">Select</MenuItem>
                  </Select>
                </FormControl>
                {newVariableType === "select" && (
                  <TextField
                    size="small"
                    label="Options"
                    value={newVariableOptions}
                    onChange={(e) => setNewVariableOptions(e.target.value)}
                    placeholder="option1,option2,option3"
                  />
                )}
                <Button variant="outlined" size="small" onClick={handleAddVariable} disabled={!newVariableKey.trim()}>
                  <Plus size={16} />
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Example Input/Output */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Example Input"
            value={prompt.exampleInput || ""}
            onChange={(e) => onChange({ exampleInput: e.target.value })}
            placeholder="Show an example of how to use this prompt"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Example Output"
            value={prompt.exampleOutput || ""}
            onChange={(e) => onChange({ exampleOutput: e.target.value })}
            placeholder="Show what the expected output looks like"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
