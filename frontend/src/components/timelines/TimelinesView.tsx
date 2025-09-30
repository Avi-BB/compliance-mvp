"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { Timeline } from "@/lib/types"

interface TimelinesViewProps {
  timelines: Timeline[]
}

export function TimelinesView({ timelines }: TimelinesViewProps) {
  const now = new Date()
  
  const parseDeadline = (deadline: string): Date | null => {
    try {
      return new Date(deadline)
    } catch {
      return null
    }
  }

  const getTimeStatus = (deadline: string) => {
    const deadlineDate = parseDeadline(deadline)
    if (!deadlineDate) return { status: "unknown", color: "bg-muted text-muted-foreground", daysUntil: null }
    
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { status: "overdue", color: "bg-destructive/10 text-destructive border-destructive/20", daysUntil: diffDays }
    } else if (diffDays <= 30) {
      return { status: "urgent", color: "bg-chart-1/10 text-chart-1 border-chart-1/20", daysUntil: diffDays }
    } else if (diffDays <= 90) {
      return { status: "upcoming", color: "bg-chart-4/10 text-chart-4 border-chart-4/20", daysUntil: diffDays }
    } else {
      return { status: "future", color: "bg-chart-2/10 text-chart-2 border-chart-2/20", daysUntil: diffDays }
    }
  }

  const sortedTimelines = [...timelines].sort((a, b) => {
    const dateA = parseDeadline(a.deadline)
    const dateB = parseDeadline(b.deadline)
    if (!dateA) return 1
    if (!dateB) return -1
    return dateA.getTime() - dateB.getTime()
  })

  const overdueCount = timelines.filter(t => getTimeStatus(t.deadline).status === "overdue").length
  const urgentCount = timelines.filter(t => getTimeStatus(t.deadline).status === "urgent").length
  const upcomingCount = timelines.filter(t => getTimeStatus(t.deadline).status === "upcoming").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{timelines.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{overdueCount}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-1/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Urgent (≤30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1">{urgentCount}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-4/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">{upcomingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline View */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Compliance Timelines & Milestones
          </CardTitle>
          <CardDescription>
            Statutory deadlines and internal milestones for compliance activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timelines.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No timelines or deadlines identified in this assessment
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTimelines.map((timeline) => {
                const timeStatus = getTimeStatus(timeline.deadline)
                const deadlineDate = parseDeadline(timeline.deadline)
                
                return (
                  <div
                    key={timeline.id}
                    className="flex items-start gap-4 p-4 rounded-lg border-2 hover:bg-muted/50 transition-colors"
                  >
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {timeStatus.status === "overdue" ? (
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      ) : timeStatus.status === "urgent" ? (
                        <Clock className="h-6 w-6 text-chart-1" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-chart-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Badge className={timeStatus.color}>
                            {timeline.date_type.toUpperCase()}
                          </Badge>
                          <div className="mt-2 font-medium">
                            {deadlineDate ? deadlineDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            }) : timeline.deadline}
                          </div>
                        </div>
                        
                        {timeStatus.daysUntil !== null && (
                          <Badge variant="outline" className={timeStatus.color}>
                            {timeStatus.daysUntil < 0 
                              ? `${Math.abs(timeStatus.daysUntil)} days overdue`
                              : `${timeStatus.daysUntil} days remaining`
                            }
                          </Badge>
                        )}
                      </div>

                      {timeline.trigger && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Trigger:</span> {timeline.trigger}
                        </div>
                      )}

                      {/* Citations */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {timeline.refs.map((ref, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ref.doc} p{ref.page} {ref.clause}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Chart (Visual Representation) */}
      {timelines.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Timeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {sortedTimelines.slice(0, 10).map((timeline, index) => {
                  const timeStatus = getTimeStatus(timeline.deadline)
                  const deadlineDate = parseDeadline(timeline.deadline)
                  
                  return (
                    <div key={timeline.id} className="relative flex items-center gap-4 pl-16">
                      <div className={`absolute left-6 w-5 h-5 rounded-full border-2 ${
                        timeStatus.status === "overdue" ? "bg-destructive border-destructive" :
                        timeStatus.status === "urgent" ? "bg-chart-1 border-chart-1" :
                        "bg-chart-2 border-chart-2"
                      }`} />
                      
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {deadlineDate?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || timeline.deadline}
                        </div>
                        <div className="text-xs text-muted-foreground">{timeline.date_type}</div>
                      </div>
                      
                      <Badge className={timeStatus.color}>
                        {timeStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}