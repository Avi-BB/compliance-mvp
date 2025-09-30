"use client"

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ScoreBreakdown {
  category: string
  score: number
  weight: number
  trend: "up" | "down" | "stable"
  findings: number
}

interface ScoringEngineProps {
  overallScore: number
  breakdown: ScoreBreakdown[]
  riskFactors: {
    name: string
    impact: "high" | "medium" | "low"
    likelihood: "high" | "medium" | "low"
    score: number
  }[]
}

const getRiskColor = (level: string) => {
  switch (level) {
    case "high":
      return "error"
    case "medium":
      return "warning"
    case "low":
      return "success"
    default:
      return "default"
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "success.main"
  if (score >= 60) return "warning.main"
  return "error.main"
}

export default function ScoringEngine({ overallScore, breakdown, riskFactors }: ScoringEngineProps) {
  return (
    <Box>
      {/* Overall Score */}
      <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Overall Compliance Score
            </Typography>
            <Typography variant="h3" color={getScoreColor(overallScore)} sx={{ fontWeight: 700 }}>
              {overallScore}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallScore}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                background: `linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)`,
                borderRadius: 6,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Based on {breakdown.reduce((sum, item) => sum + item.findings, 0)} findings across {breakdown.length}{" "}
            categories
          </Typography>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Score Breakdown by Category
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Weight</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trend</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Findings</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {breakdown.map((item) => (
                  <TableRow key={item.category} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={getScoreColor(item.score)} fontWeight="medium">
                        {item.score}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.weight}%</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {item.trend === "up" && <TrendingUp color="#10B981" size={18} />}
                        {item.trend === "down" && <TrendingDown color="#EF4444" size={18} />}
                        {item.trend === "stable" && <TrendingUp color="#9CA3AF" size={18} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.findings}</Typography>
                    </TableCell>
                    <TableCell sx={{ width: 120 }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.score}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            background: `linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)`,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Key Risk Factors
          </Typography>
          <Grid container spacing={2}>
            {riskFactors.map((risk, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {risk.name}
                      </Typography>
                      <Typography variant="body2" color={getScoreColor(risk.score)} fontWeight="medium">
                        {risk.score}%
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} mb={1.5}>
                      <Chip
                        label={`Impact: ${risk.impact}`}
                        size="small"
                        color={getRiskColor(risk.impact)}
                        variant="outlined"
                      />
                      <Chip
                        label={`Likelihood: ${risk.likelihood}`}
                        size="small"
                        color={getRiskColor(risk.likelihood)}
                        variant="outlined"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={risk.score}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)`,
                          borderRadius: 2,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}