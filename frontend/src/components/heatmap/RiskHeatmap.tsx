"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { Finding } from "@/lib/types"

interface RiskHeatmapProps {
  findings: Finding[]
}

type ImpactLevel = "Low" | "Medium" | "High" | "Critical"
type LikelihoodLevel = "Low" | "Medium" | "High"

export function RiskHeatmap({ findings }: RiskHeatmapProps) {
  const impactLevels: ImpactLevel[] = ["Critical", "High", "Medium", "Low"]
  const likelihoodLevels: LikelihoodLevel[] = ["Low", "Medium", "High"]

  const mapSeverityToImpact = (severity: string): ImpactLevel => {
    switch (severity.toUpperCase()) {
      case "C": return "Critical"
      case "H": return "High"
      case "M": return "Medium"
      case "L": return "Low"
      default: return "Medium"
    }
  }

  const mapLikelihoodLevel = (likelihood: string): LikelihoodLevel => {
    const l = likelihood.toLowerCase()
    if (l.includes("high") || l === "h") return "High"
    if (l.includes("low") || l === "l") return "Low"
    return "Medium"
  }

  const getFindingsForCell = (impact: ImpactLevel, likelihood: LikelihoodLevel): Finding[] => {
    return findings.filter(f => {
      const fImpact = mapSeverityToImpact(f.severity)
      const fLikelihood = mapLikelihoodLevel(f.likelihood)
      return fImpact === impact && fLikelihood === likelihood
    })
  }

  const getCellColor = (impact: ImpactLevel, likelihood: LikelihoodLevel, count: number): string => {
    if (count === 0) return "bg-muted/20 border-border"
    
    // Risk score calculation
    const impactScore = impact === "Critical" ? 4 : impact === "High" ? 3 : impact === "Medium" ? 2 : 1
    const likelihoodScore = likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1
    const riskScore = impactScore * likelihoodScore

    if (riskScore >= 9) return "bg-destructive text-destructive-foreground border-destructive"
    if (riskScore >= 6) return "bg-chart-1 text-white border-chart-1"
    if (riskScore >= 4) return "bg-chart-5 text-white border-chart-5"
    return "bg-chart-4 text-white border-chart-4"
  }

  const getCellRiskLevel = (impact: ImpactLevel, likelihood: LikelihoodLevel): string => {
    const impactScore = impact === "Critical" ? 4 : impact === "High" ? 3 : impact === "Medium" ? 2 : 1
    const likelihoodScore = likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1
    const riskScore = impactScore * likelihoodScore

    if (riskScore >= 9) return "Critical"
    if (riskScore >= 6) return "High"
    if (riskScore >= 4) return "Medium"
    return "Low"
  }

  const totalFindings = findings.length
  const criticalCount = findings.filter(f => {
    const impact = mapSeverityToImpact(f.severity)
    const likelihood = mapLikelihoodLevel(f.likelihood)
    const impactScore = impact === "Critical" ? 4 : impact === "High" ? 3 : impact === "Medium" ? 2 : 1
    const likelihoodScore = likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1
    return (impactScore * likelihoodScore) >= 9
  }).length

  const highCount = findings.filter(f => {
    const impact = mapSeverityToImpact(f.severity)
    const likelihood = mapLikelihoodLevel(f.likelihood)
    const impactScore = impact === "Critical" ? 4 : impact === "High" ? 3 : impact === "Medium" ? 2 : 1
    const likelihoodScore = likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1
    const score = impactScore * likelihoodScore
    return score >= 6 && score < 9
  }).length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalFindings}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{criticalCount}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-1/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1">{highCount}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-5/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-5">
              {totalFindings > 0 ? Math.round(((totalFindings - criticalCount - highCount) / totalFindings) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Risk Heatmap - Impact vs Likelihood
          </CardTitle>
          <CardDescription>
            Visual representation of risks by severity and probability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="text-sm font-semibold text-muted-foreground p-3">
                  Impact → Likelihood ↓
                </div>
                {likelihoodLevels.map(likelihood => (
                  <div key={likelihood} className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm font-semibold">{likelihood}</div>
                  </div>
                ))}
              </div>

              {/* Heatmap Grid */}
              {impactLevels.map(impact => (
                <div key={impact} className="grid grid-cols-4 gap-2 mb-2">
                  <div className="flex items-center p-3 bg-muted rounded-lg">
                    <div className="text-sm font-semibold">{impact}</div>
                  </div>
                  
                  {likelihoodLevels.map(likelihood => {
                    const cellFindings = getFindingsForCell(impact, likelihood)
                    const count = cellFindings.length
                    const color = getCellColor(impact, likelihood, count)
                    const riskLevel = getCellRiskLevel(impact, likelihood)

                    return (
                      <div
                        key={`${impact}-${likelihood}`}
                        className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${color}`}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">{count}</div>
                          <div className="text-xs opacity-90">{riskLevel} Risk</div>
                        </div>
                        
                        {count > 0 && (
                          <div className="absolute top-1 right-1">
                            <AlertTriangle className="h-4 w-4 opacity-70" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t">
            <div className="text-sm font-semibold mb-3">Risk Level Legend</div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-destructive border-2 border-destructive" />
                <span className="text-sm">Critical (9-12)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-chart-1 border-2 border-chart-1" />
                <span className="text-sm">High (6-8)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-chart-5 border-2 border-chart-5" />
                <span className="text-sm">Medium (4-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-chart-4 border-2 border-chart-4" />
                <span className="text-sm">Low (1-3)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Findings by Risk Level */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>High Priority Risks</CardTitle>
          <CardDescription>Findings requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {findings
              .filter(f => {
                const impact = mapSeverityToImpact(f.severity)
                const likelihood = mapLikelihoodLevel(f.likelihood)
                const impactScore = impact === "Critical" ? 4 : impact === "High" ? 3 : impact === "Medium" ? 2 : 1
                const likelihoodScore = likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1
                return (impactScore * likelihoodScore) >= 6
              })
              .slice(0, 10)
              .map(finding => (
                <div key={finding.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{finding.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{finding.description}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        {mapSeverityToImpact(finding.severity)} Impact
                      </Badge>
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                        {mapLikelihoodLevel(finding.likelihood)} Likelihood
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            
            {findings.filter(f => {
              const impact = mapSeverityToImpact(f.severity)
              const likelihood = mapLikelihoodLevel(f.likelihood)
              const impactScore = impact === "Critical" ? 4 : impact === "High" ? 3 : impact === "Medium" ? 2 : 1
              const likelihoodScore = likelihood === "High" ? 3 : likelihood === "Medium" ? 2 : 1
              return (impactScore * likelihoodScore) >= 6
            }).length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                No high priority risks identified
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}