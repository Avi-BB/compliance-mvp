"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, DollarSign, FileText, Scale, TrendingUp } from "lucide-react"
import { Penalty } from "@/lib/types"

interface PenaltiesTableProps {
  penalties: Penalty[]
}

export function PenaltiesTable({ penalties }: PenaltiesTableProps) {
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null)

  const getPenaltyTypeIcon = (type: string) => {
    switch (type) {
      case "fine":
        return <DollarSign className="h-4 w-4" />
      case "sanction":
        return <AlertTriangle className="h-4 w-4" />
      case "licence":
        return <FileText className="h-4 w-4" />
      case "civil":
      case "criminal":
        return <Scale className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getPenaltyTypeColor = (type: string) => {
    switch (type) {
      case "fine":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20"
      case "sanction":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "licence":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
      case "civil":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20"
      case "criminal":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const totalFinancialExposure = penalties.reduce((acc, penalty) => {
    if (penalty.penalty_type === "fine" && penalty.max_amount) {
      const amount = typeof penalty.max_amount === "string" 
        ? parseFloat(penalty.max_amount.replace(/[^0-9.]/g, '')) 
        : penalty.max_amount
      return acc + (isNaN(amount) ? 0 : amount)
    }
    return acc
  }, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Penalties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{penalties.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Financial Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-5">
              ${totalFinancialExposure.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {penalties.filter(p => p.penalty_type === "criminal" || p.penalty_type === "sanction").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Licence Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1">
              {penalties.filter(p => p.penalty_type === "licence").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Penalties Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Penalties & Sanctions
          </CardTitle>
          <CardDescription>
            Financial, regulatory, and legal consequences of non-compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Max Amount</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Citations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {penalties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No penalties identified in this assessment
                    </TableCell>
                  </TableRow>
                ) : (
                  penalties.map((penalty) => (
                    <TableRow key={penalty.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge className={getPenaltyTypeColor(penalty.penalty_type)}>
                          <span className="flex items-center gap-1">
                            {getPenaltyTypeIcon(penalty.penalty_type)}
                            {penalty.penalty_type.toUpperCase()}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2 text-sm">{penalty.text}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-chart-5">
                          {penalty.max_amount || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                          {penalty.conditions}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {penalty.refs.map((ref, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ref.doc} p{ref.page} {ref.clause}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPenalty(penalty)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Penalty Details Modal (if needed) */}
      {selectedPenalty && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Penalty Details</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPenalty(null)}
              className="absolute right-4 top-4"
            >
              Close
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Type</div>
              <Badge className={getPenaltyTypeColor(selectedPenalty.penalty_type)}>
                {selectedPenalty.penalty_type.toUpperCase()}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
              <p className="text-sm">{selectedPenalty.text}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Maximum Amount</div>
              <p className="text-lg font-semibold text-chart-5">{selectedPenalty.max_amount || "N/A"}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Conditions</div>
              <p className="text-sm">{selectedPenalty.conditions}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Citations</div>
              <div className="flex flex-wrap gap-2">
                {selectedPenalty.refs.map((ref, idx) => (
                  <Badge key={idx} variant="outline">
                    {ref.doc} - Page {ref.page}, {ref.clause}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}