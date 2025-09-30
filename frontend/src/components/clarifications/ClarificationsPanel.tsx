"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, MessageSquare, CheckCircle2, AlertCircle, Send } from "lucide-react"
import { AssessmentSummary } from "@/lib/types"

interface Clarification {
  id: string
  question: string
  context: string
  status: "UNCERTAIN" | "RESOLVED"
  response?: string
  refs?: Array<{ doc: string; page: number; clause: string }>
}

interface ClarificationsPanelProps {
  assessmentSummary: AssessmentSummary
  onResolveClarification?: (clarificationId: string, response: string) => void
}

export function ClarificationsPanel({ assessmentSummary, onResolveClarification }: ClarificationsPanelProps) {
  const [selectedClarification, setSelectedClarification] = useState<Clarification | null>(null)
  const [response, setResponse] = useState("")

  // Extract clarifications from assessment summary
  const clarifications: Clarification[] = (assessmentSummary.clarifications || []).map((q, idx) => ({
    id: `clarification-${idx}`,
    question: q,
    context: "From LLM analysis",
    status: "UNCERTAIN" as const,
    refs: []
  }))

  const handleResolve = () => {
    if (selectedClarification && response.trim()) {
      onResolveClarification?.(selectedClarification.id, response)
      setResponse("")
      setSelectedClarification(null)
    }
  }

  const unresolvedCount = clarifications.filter(c => c.status === "UNCERTAIN").length
  const resolvedCount = clarifications.filter(c => c.status === "RESOLVED").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clarifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clarifications.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-1/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1">{unresolvedCount}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-2/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clarifications List */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Clarification Requests
          </CardTitle>
          <CardDescription>
            Questions from LLM analysis requiring manual review and input
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clarifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-chart-2" />
              <div className="text-lg font-semibold mb-2">All Clear!</div>
              <div className="text-sm">No clarifications needed for this assessment</div>
            </div>
          ) : (
            <div className="space-y-4">
              {clarifications.map((clarification) => (
                <div
                  key={clarification.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedClarification?.id === clarification.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedClarification(clarification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {clarification.status === "UNCERTAIN" ? (
                        <AlertCircle className="h-5 w-5 text-chart-1" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-chart-2" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-medium">{clarification.question}</div>
                        <Badge className={
                          clarification.status === "UNCERTAIN"
                            ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                            : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                        }>
                          {clarification.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {clarification.context}
                      </div>

                      {clarification.refs && clarification.refs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {clarification.refs.map((ref, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ref.doc} p{ref.page} {ref.clause}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {clarification.response && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <div className="text-xs font-medium text-muted-foreground mb-1">Response:</div>
                          <div className="text-sm">{clarification.response}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Form */}
      {selectedClarification && selectedClarification.status === "UNCERTAIN" && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Provide Clarification
            </CardTitle>
            <CardDescription>
              Answer the question to help improve assessment accuracy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Question:</div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                {selectedClarification.question}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Your Response:</div>
              <Textarea
                placeholder="Provide details, evidence, or clarification..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleResolve} disabled={!response.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Submit Response
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedClarification(null)
                  setResponse("")
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <Card className="border-2 bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <div className="font-medium text-foreground mb-1">About Clarifications</div>
              <p>
                The AI may request clarifications when it encounters ambiguous information or needs additional context.
                Providing clear responses helps improve the accuracy of your compliance assessment and ensures all requirements
                are properly identified and categorized.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}