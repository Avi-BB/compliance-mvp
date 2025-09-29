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
  assessmentId?: string
}

export interface CreateFindingRequest {
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  framework: string
  category: string
  assignee: string
  dueDate: string
}

export interface UpdateFindingRequest {
  id: string
  title?: string
  description?: string
  severity?: "critical" | "high" | "medium" | "low"
  status?: "open" | "in-progress" | "resolved" | "closed"
  framework?: string
  category?: string
  assignee?: string
  dueDate?: string
}

// Mock API functions
export const findingsAPI = {
  getAll: async (): Promise<Finding[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "1",
        title: "Inadequate Access Control Implementation",
        description: "User access controls do not meet PCI DSS requirements for privileged access management.",
        severity: "critical",
        status: "open",
        framework: "PCI DSS",
        category: "Access Control",
        assignee: "John Smith",
        dueDate: "2024-02-15",
        createdDate: "2024-01-15",
        riskScore: 95,
      },
      {
        id: "2",
        title: "Missing Data Encryption at Rest",
        description: "Sensitive customer data is not encrypted when stored in the database.",
        severity: "high",
        status: "in-progress",
        framework: "GDPR",
        category: "Data Protection",
        assignee: "Sarah Johnson",
        dueDate: "2024-02-20",
        createdDate: "2024-01-10",
        riskScore: 85,
      },
    ]
  },

  create: async (data: CreateFindingRequest): Promise<Finding> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newFinding: Finding = {
      id: Date.now().toString(),
      ...data,
      status: "open",
      createdDate: new Date().toISOString().split("T")[0],
      riskScore:
        data.severity === "critical" ? 95 : data.severity === "high" ? 80 : data.severity === "medium" ? 60 : 30,
    }

    return newFinding
  },

  update: async (data: UpdateFindingRequest): Promise<Finding> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock updated finding
    const existingFindings = await findingsAPI.getAll()
    const existing = existingFindings.find((f) => f.id === data.id)

    if (!existing) {
      throw new Error("Finding not found")
    }

    return {
      ...existing,
      ...data,
    }
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("[v0] Deleting finding:", id)
  },

  getById: async (id: string): Promise<Finding | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const findings = await findingsAPI.getAll()
    return findings.find((finding) => finding.id === id) || null
  },
}
