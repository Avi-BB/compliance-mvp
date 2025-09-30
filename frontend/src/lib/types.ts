export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  bio?: string
  websiteUrl?: string
  githubUrl?: string
  twitterUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  createdAt: string
}

export interface PromptPack {
  id: string
  title: string
  description?: string
  authorId: string
  author?: User
  categoryId?: string
  category?: Category
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
  version: string
  license: string
  price: number
  downloadCount: number
  viewCount: number
  likeCount: number
  averageRating: number
  ratingCount: number
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
  prompts?: Prompt[]
}

export interface Prompt {
  id: string
  packId: string
  title: string
  content: string
  description?: string
  category?: string
  variables?: Record<string, any>
  exampleInput?: string
  exampleOutput?: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  packId: string
  userId: string
  user?: User
  rating: number
  review?: string
  createdAt: string
  updatedAt: string
}

export interface Like {
  id: string
  packId: string
  userId: string
  createdAt: string
}

export interface Collection {
  id: string
  userId: string
  user?: User
  name: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  packs?: PromptPack[]
}

export interface UsageAnalytics {
  id: string
  packId: string
  promptId?: string
  userId?: string
  action: "view" | "copy" | "download" | "share"
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: boolean
  message?: string
}

// Filter and search types
export interface PackFilters {
  category?: string
  tags?: string[]
  author?: string
  minRating?: number
  maxPrice?: number
  isFree?: boolean
  isFeatured?: boolean
  sortBy?: "newest" | "popular" | "rating" | "downloads"
  search?: string
}

export interface PackSearchParams {
  q?: string
  category?: string
  tags?: string
  author?: string
  rating?: string
  price?: string
  sort?: string
  page?: string
  limit?: string
}

// ============================================
// COMPLIANCE HEALTHCHECK MVP DATA MODELS
// ============================================

// Document & Processing
export interface Document {
  id: string
  tenantId: string
  name: string
  type: "regulation" | "policy" | "contract" | "vendor_doc" | "audit_letter"
  storageUri: string
  hash: string
  pages: number
  status: "uploading" | "processing" | "ready" | "failed"
  createdAt: string
  updatedAt: string
}

export interface DocumentChunk {
  id: string
  documentId: string
  page: number
  sectionPath: string
  text: string
  embedding?: number[]
  refs: Record<string, any>
}

// Assessment & Findings
export interface Assessment {
  id: string
  tenantId: string
  name: string
  promptPack: string[]
  documentIds: string[]
  jurisdiction?: string
  status: "draft" | "running" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  baselineId?: string
}

export interface Finding {
  id: string
  assessmentId: string
  kind: "risk" | "issue" | "requirement_gap"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  likelihood?: "low" | "medium" | "high"
  impactArea: "Financial" | "Regulatory" | "Operational" | "Reputation" | "Privacy"
  refs: DocumentReference[]
  citationConfidence: number
}

export interface Requirement {
  id: string
  assessmentId: string
  controlFamily: "Access" | "Data" | "Governance" | "IR" | "TPRM" | "BCP"
  controlIdExt?: string
  statement: string
  mustShould: "MUST" | "SHOULD"
  testProcedures: string[]
  refs: DocumentReference[]
  status?: "KNOWN" | "UNCERTAIN"
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Control {
  id: string
  assessmentId: string
  family: "Access Control" | "Data Protection" | "Governance" | "Incident Response" | "Third Party" | "Business Continuity"
  controlId: string
  title: string
  description: string
  implementationStatus: "Implemented" | "Partial" | "Not Implemented" | "Not Applicable"
  effectiveness: "Effective" | "Needs Improvement" | "Ineffective"
  testDate?: string
  tester?: string
  notes?: string
  refs: DocumentReference[]
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Obligation {
  id: string
  assessmentId: string
  legalText: string
  jurisdiction: string
  refs: DocumentReference[]
  tenantId: string
  category: "Compliance" | "Reporting" | "Data Protection" | "Security" | "Other"
  dueDate?: string
  status: "Pending" | "In Progress" | "Completed"
  owner?: string
  createdAt: string
  updatedAt: string
}

export interface Penalty {
  id: string
  assessmentId: string
  text: string
  penaltyType: "fine" | "sanction" | "license" | "civil" | "criminal"
  maxAmount?: string
  conditions: string
  refs: DocumentReference[]
  tenantId: string
  severity: "Low" | "Medium" | "High" | "Critical"
  applicableTo: string
  createdAt: string
  updatedAt: string
}

export interface Timeline {
  id: string
  assessmentId: string
  dateType: string
  deadline: string
  trigger: string
  refs: DocumentReference[]
  tenantId: string
  status: "Upcoming" | "Due Soon" | "Overdue" | "Completed"
  owner?: string
  reminderSet: boolean
  createdAt: string
  updatedAt: string
}

// Attestation & Evidence
export interface Attestation {
  id: string
  subjectId: string // finding_id or requirement_id
  subjectType: "finding" | "requirement" | "control" | "obligation"
  status: "Have" | "Partial" | "No"
  evidenceUri?: string
  evidenceDescription?: string
  owner?: string
  notes?: string
  attestedBy?: string
  attestedAt?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Clarification {
  id: string
  assessmentId: string
  subjectId: string
  subjectType: "requirement" | "finding" | "control" | "obligation"
  question: string
  context: string
  status: "Open" | "Under Review" | "Resolved" | "Closed"
  priority: "Low" | "Medium" | "High"
  resolution?: string
  resolvedBy?: string
  resolvedAt?: string
  assignedTo?: string
  refs: DocumentReference[]
  tenantId: string
  createdAt: string
  updatedAt: string
}

// Scoring
export interface Score {
  id: string
  assessmentId: string
  totalScore: number
  residualRisk: "Low" | "Medium" | "High" | "Critical"
  familyBreakdown: Record<string, number>
  topGaps: string[]
  quickWins: string[]
  clarifications: string[]
}

// Remediation Actions
export interface RemediationAction {
  id: string
  assessmentId: string
  title: string
  priority: "P0" | "P1" | "P2"
  owner: string
  effort: "S" | "M" | "L"
  dependency?: string
  dueBy?: string
  mappedSolution?: string
  status: "pending" | "in_progress" | "completed"
  refs: DocumentReference[]
}

// Audit Trail
export interface AuditLog {
  id: string
  tenantId: string
  actor: string
  actorEmail?: string
  action: "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "EXPORT" | "IMPORT" | "RUN_ASSESSMENT" | "ATTEST" | "RESOLVE"
  target: string
  targetType: "document" | "assessment" | "requirement" | "finding" | "remediation" | "attestation" | "clarification"
  targetId: string
  timestamp: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  details: Record<string, any>
}

// Utility Types
export interface DocumentReference {
  doc: string
  page: number
  clause?: string
  excerpt?: string
}

export interface AssessmentSummary {
  assessmentId: string
  scoreTotal: number
  residualRisk: "Low" | "Medium" | "High" | "Critical"
  familyBreakdown: Record<string, number>
  topGaps: string[]
  quickWins: string[]
  clarifications: string[]
}