"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle2, MinusCircle, Search, Link as LinkIcon, FileText } from "lucide-react"
import { Requirement, Attestation } from "@/lib/types"

interface GapAnalysisTableProps {
  requirements: Requirement[]
  attestations?: Attestation[]
  onUpdateAttestation?: (requirementId: string, status: "Have" | "Partial" | "No") => void
}

export function GapAnalysisTable({ requirements, attestations = [], onUpdateAttestation }: GapAnalysisTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFamily, setFilterFamily] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getAttestationForRequirement = (requirementId: string): Attestation | undefined => {
    return attestations.find(a => a.subject_id === requirementId)
  }

  const getStatusIcon = (status?: "Have" | "Partial" | "No") => {
    switch (status) {
      case "Have":
        return <CheckCircle2 className="h-4 w-4 text-chart-2" />
      case "Partial":
        return <MinusCircle className="h-4 w-4 text-chart-5" />
      case "No":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <MinusCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status?: "Have" | "Partial" | "No") => {
    switch (status) {
      case "Have":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      case "Partial":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20"
      case "No":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const controlFamilies = [...new Set(requirements.map(r => r.control_family))]

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.control_family.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFamily = filterFamily === "all" || req.control_family === filterFamily
    const attestation = getAttestationForRequirement(req.id)
    const matchesStatus = filterStatus === "all" || attestation?.status === filterStatus || (!attestation && filterStatus === "unknown")
    
    return matchesSearch && matchesFamily && matchesStatus
  })

  const stats = {
    total: requirements.length,
    have: attestations.filter(a => a.status === "Have").length,
    partial: attestations.filter(a => a.status === "Partial").length,
    no: attestations.filter(a => a.status === "No").length,
    unknown: requirements.length - attestations.length
  }

  const complianceScore = Math.round(((stats.have + stats.partial * 0.5) / stats.total) * 100) || 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-2/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Have</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{stats.have}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-5/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Partial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-5">{stats.partial}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Don't Have</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.no}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{complianceScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Gap Analysis Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Gap Analysis - Requirements vs Current State
          </CardTitle>
          <CardDescription>
            Track compliance status for each requirement with evidence and ownership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterFamily} onValueChange={setFilterFamily}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Control Family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                {controlFamilies.map(family => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Have">Have</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="No">Don't Have</SelectItem>
                <SelectItem value="unknown">Not Assessed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Status</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Control Family</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Citations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequirements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No requirements found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequirements.map((requirement) => {
                    const attestation = getAttestationForRequirement(requirement.id)
                    
                    return (
                      <TableRow key={requirement.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Badge className={getStatusColor(attestation?.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(attestation?.status)}
                              {attestation?.status || "Unknown"}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-lg">
                          <div className="text-sm font-medium line-clamp-2">{requirement.statement}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            requirement.must_should === "MUST" 
                              ? "bg-destructive/10 text-destructive border-destructive/20" 
                              : "bg-chart-4/10 text-chart-4 border-chart-4/20"
                          }>
                            {requirement.must_should}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{requirement.control_family}</Badge>
                        </TableCell>
                        <TableCell>
                          {attestation?.evidence_uri ? (
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <LinkIcon className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">No evidence</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{attestation?.owner || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {requirement.refs.slice(0, 2).map((ref, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                p{ref.page} {ref.clause}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Open attestation modal/form
                              console.log("Attest requirement:", requirement.id)
                            }}
                          >
                            {attestation ? "Update" : "Attest"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results Info */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredRequirements.length} of {requirements.length} requirements
          </div>
        </CardContent>
      </Card>
    </div>
  )
}