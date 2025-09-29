export interface PromptPackConfig {
  id: string
  name: string
  version: string
  description: string
  systemPrompt: string
  userPromptTemplate: string
  outputSchema: Record<string, any>
  domains: string[]
  jurisdiction?: string[]
  estimatedProcessingTime: number
}

export interface PromptPackResult {
  packId: string
  findings: Finding[]
  requirements: Requirement[]
  risks: Risk[]
  obligations: Obligation[]
  penalties: Penalty[]
  timelines: Timeline[]
  confidence: number
  processingTime: number
}

export interface Finding {
  id: string
  kind: "requirement" | "risk" | "issue"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  likelihood?: "low" | "medium" | "high"
  impactArea: "financial" | "regulatory" | "operational" | "reputation" | "privacy"
  refs: DocumentReference[]
  citationConfidence: number
}

export interface Requirement {
  id: string
  controlFamily: "access" | "data" | "governance" | "incident_response" | "third_party" | "business_continuity"
  statement: string
  mustShould: "MUST" | "SHOULD"
  testProcedures: string[]
  refs: DocumentReference[]
}

export interface Risk {
  id: string
  title: string
  description: string
  likelihood: "low" | "medium" | "high"
  impact: "low" | "medium" | "high"
  impactArea: "financial" | "regulatory" | "operational" | "reputation" | "privacy"
  refs: DocumentReference[]
}

export interface Obligation {
  id: string
  obligation: string
  jurisdiction: string
  refs: DocumentReference[]
}

export interface Penalty {
  id: string
  penaltyType: "fine" | "sanction" | "license" | "civil" | "criminal"
  maxAmount?: string
  conditions: string
  refs: DocumentReference[]
}

export interface Timeline {
  id: string
  deadline: string
  trigger: string
  refs: DocumentReference[]
}

export interface DocumentReference {
  documentId: string
  page: number
  clause?: string
  excerpt: string
}
