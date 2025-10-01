export interface Finding {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved" | "closed"
  framework: string
  category: string
  assignee: string
  dueDate: string
  createdDate: string
  riskScore: number
}

export interface FindingFormData {
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  framework: string
  category: string
  assignee: string
  dueDate: string
}