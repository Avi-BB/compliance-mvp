"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Scale, MapPin, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Obligation } from "@/lib/types"

interface ObligationsTableProps {
  obligations: Obligation[]
}

export function ObligationsTable({ obligations }: ObligationsTableProps) {
  const jurisdictions = [...new Set(obligations.map(o => o.jurisdiction))]

  const getJurisdictionColor = (jurisdiction: string) => {
    const colors: Record<string, string> = {
      "AU": "bg-chart-1/10 text-chart-1 border-chart-1/20",
      "SG": "bg-chart-2/10 text-chart-2 border-chart-2/20",
      "EU": "bg-chart-3/10 text-chart-3 border-chart-3/20",
      "US": "bg-chart-4/10 text-chart-4 border-chart-4/20",
      "UK": "bg-chart-5/10 text-chart-5 border-chart-5/20",
      "Global": "bg-primary/10 text-primary border-primary/20"
    }
    return colors[jurisdiction] || "bg-muted text-muted-foreground border-border"
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Obligations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{obligations.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jurisdictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{jurisdictions.length}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {jurisdictions.map((j) => (
                <Badge key={j} variant="outline" className="text-xs">
                  {j}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-chart-1" />
              <span className="text-lg font-semibold">Review Required</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Obligations Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Legal Obligations
          </CardTitle>
          <CardDescription>
            Regulatory and contractual obligations requiring compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Obligation</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Citations</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obligations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No legal obligations identified in this assessment
                    </TableCell>
                  </TableRow>
                ) : (
                  obligations.map((obligation) => (
                    <TableRow key={obligation.id} className="hover:bg-muted/50">
                      <TableCell className="max-w-lg">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">{obligation.legal_text}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getJurisdictionColor(obligation.jurisdiction)}>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {obligation.jurisdiction}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {obligation.refs.map((ref, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ref.doc} p{ref.page} {ref.clause}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          To Review
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}