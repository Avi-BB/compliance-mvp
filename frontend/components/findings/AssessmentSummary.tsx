"use client"

import { Box, Typography, Card, CardContent, Grid, LinearProgress, Chip } from "@mui/material"
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import type { Assessment } from "../../lib/slices/assessmentsSlice"

interface AssessmentSummaryProps {
  assessment: Assessment
}

export function AssessmentSummary({ assessment }: AssessmentSummaryProps) {
  if (!assessment.score) {
    return null
  }

  const { score } = assessment

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "#059669"
      case "Medium":
        return "#d97706"
      case "High":
        return "#dc2626"
      case "Critical":
        return "#7c2d12"
      default:
        return "#6b7280"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#059669"
    if (score >= 75) return "#d97706"
    if (score >= 60) return "#dc2626"
    return "#7c2d12"
  }

  return (
    <Grid container spacing={3}>
      {/* Overall Score */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <TrendingUp size={32} color={getScoreColor(score.total)} style={{ marginBottom: 16 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: getScoreColor(score.total), mb: 1 }}>
              {score.total}%
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Compliance Score
            </Typography>
            <LinearProgress
              variant="determinate"
              value={score.total}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  bgcolor: getScoreColor(score.total),
                },
              }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Residual Risk */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <AlertTriangle size={32} color={getRiskColor(score.residualRisk)} style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Residual Risk Level
            </Typography>
            <Chip
              label={score.residualRisk}
              sx={{
                bgcolor: getRiskColor(score.residualRisk),
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                px: 2,
                py: 1,
              }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Assessment Info */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CheckCircle size={32} color="#4338ca" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Assessment Status
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {assessment.promptPacks.length} frameworks analyzed
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {assessment.documentIds.length} documents processed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Control Family Breakdown */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Control Family Breakdown
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(score.familyBreakdown).map(([family, familyScore]) => (
                <Grid item xs={12} sm={6} md={4} key={family}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {family}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: getScoreColor(familyScore) }}>
                        {familyScore}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={familyScore}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getScoreColor(familyScore),
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
