"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import {
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Schedule,
  PlayArrow,
  Person,
  CalendarToday,
  Assignment,
  Edit,
  Delete,
} from "@mui/icons-material"

interface Task {
  id: string
  title: string
  status: "completed" | "in-progress" | "pending"
}

interface RemediationPlan {
  id: string
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  status: "completed" | "in-progress" | "not-started"
  progress: number
  assignee: string
  dueDate: string
  estimatedEffort: string
  framework: string
  findings: string[]
  tasks: Task[]
}

interface RemediationPlanCardProps {
  plan: RemediationPlan
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "error"
    case "high":
      return "warning"
    case "medium":
      return "info"
    case "low":
      return "success"
    default:
      return "default"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success"
    case "in-progress":
      return "warning"
    case "not-started":
      return "default"
    default:
      return "default"
  }
}

const getTaskIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle color="success" />
    case "in-progress":
      return <PlayArrow color="warning" />
    case "pending":
      return <Schedule color="action" />
    default:
      return <Schedule color="action" />
  }
}

export default function RemediationPlanCard({ plan, onEdit, onDelete }: RemediationPlanCardProps) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const isOverdue = new Date(plan.dueDate) < new Date() && plan.status !== "completed"

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box flexGrow={1}>
            <Typography variant="h6" component="div" gutterBottom>
              {plan.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {plan.description}
            </Typography>
          </Box>
          <Box display="flex" gap={1} ml={2}>
            <Chip label={plan.priority} size="small" color={getPriorityColor(plan.priority)} variant="outlined" />
            <Chip
              label={plan.status.replace("-", " ")}
              size="small"
              color={isOverdue ? "error" : getStatusColor(plan.status)}
            />
          </Box>
        </Box>

        {/* Progress */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {plan.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={plan.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Details */}
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2">{plan.assignee}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2" color={isOverdue ? "error" : "textPrimary"}>
              {new Date(plan.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Assignment fontSize="small" color="action" />
            <Typography variant="body2">{plan.estimatedEffort}</Typography>
          </Box>
        </Box>

        {/* Framework and Findings */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Chip label={plan.framework} size="small" variant="outlined" />
          <Typography variant="body2" color="textSecondary">
            Addresses {plan.findings.length} finding{plan.findings.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button onClick={handleExpandClick} endIcon={expanded ? <ExpandLess /> : <ExpandMore />} size="small">
          {expanded ? "Hide" : "Show"} Tasks ({plan.tasks.length})
        </Button>
        <Box>
          <IconButton size="small" onClick={() => onEdit?.(plan.id)}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete?.(plan.id)}>
            <Delete />
          </IconButton>
        </Box>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tasks
          </Typography>
          <List dense>
            {plan.tasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemIcon sx={{ minWidth: 36 }}>{getTaskIcon(task.status)}</ListItemIcon>
                <ListItemText
                  primary={task.title}
                  primaryTypographyProps={{
                    variant: "body2",
                    style: {
                      textDecoration: task.status === "completed" ? "line-through" : "none",
                      color: task.status === "completed" ? "#666" : "inherit",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Related Findings
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {plan.findings.map((finding) => (
              <Chip key={finding} label={finding} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  )
}
