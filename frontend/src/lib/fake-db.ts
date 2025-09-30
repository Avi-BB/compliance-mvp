/**
 * Centralized Fake Database Service
 * Provides full CRUD operations for all entities with localStorage persistence
 */

import type { Assessment } from "./slices/assessmentsSlice"
import type { Document } from "./slices/documentsSlice"
import type { PromptPack, Prompt, Rating, Requirement, Control, Obligation, Penalty, Timeline, Attestation, Clarification, AuditLog } from "./types"

// Storage keys
const STORAGE_KEYS = {
  ASSESSMENTS: "fake_db_assessments",
  DOCUMENTS: "fake_db_documents",
  PACKS: "fake_db_packs",
  PROMPTS: "fake_db_prompts",
  RATINGS: "fake_db_ratings",
  FINDINGS: "fake_db_findings",
  REMEDIATION: "fake_db_remediation",
  REQUIREMENTS: "fake_db_requirements",
  CONTROLS: "fake_db_controls",
  OBLIGATIONS: "fake_db_obligations",
  PENALTIES: "fake_db_penalties",
  TIMELINES: "fake_db_timelines",
  ATTESTATIONS: "fake_db_attestations",
  CLARIFICATIONS: "fake_db_clarifications",
  AUDIT_LOGS: "fake_db_audit_logs",
}

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// Initial mock data
const initialAssessments: Assessment[] = [
  {
    id: "1",
    name: "Q1 2024 PCI DSS Assessment",
    promptPacks: ["pci_dss", "iso_27001"],
    documentIds: ["1", "2"],
    jurisdiction: "US",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T11:45:00Z",
    tenantId: "tenant_1",
    score: {
      total: 78,
      residualRisk: "Medium",
      familyBreakdown: {
        "Access Control": 85,
        "Data Protection": 70,
        Governance: 60,
        "Incident Response": 90,
        "Third Party": 55,
        "Business Continuity": 65,
      },
    },
  },
  {
    id: "2",
    name: "SOX Compliance Review",
    promptPacks: ["sox"],
    documentIds: ["4"],
    jurisdiction: "US",
    status: "completed",
    createdAt: "2024-01-12T16:45:00Z",
    completedAt: "2024-01-12T17:30:00Z",
    tenantId: "tenant_1",
    score: {
      total: 92,
      residualRisk: "Low",
      familyBreakdown: {
        "Financial Controls": 95,
        "Audit Trail": 88,
        "Access Management": 94,
      },
    },
  },
]

const initialDocuments: Document[] = [
  {
    id: "1",
    name: "PCI DSS Requirements v4.0.pdf",
    type: "regulation",
    size: 2048000,
    uploadedAt: "2024-01-15T10:30:00Z",
    status: "ready",
    pages: 45,
    tenantId: "tenant_1",
    hash: "abc123",
  },
  {
    id: "2",
    name: "Third Party Vendor Agreement.pdf",
    type: "contract",
    size: 1024000,
    uploadedAt: "2024-01-14T14:20:00Z",
    status: "ready",
    pages: 12,
    tenantId: "tenant_1",
    hash: "def456",
  },
]

// Database class
class FakeDatabase {
  // ASSESSMENTS CRUD
  async getAssessments(): Promise<Assessment[]> {
    await this.simulateDelay()
    const stored = getFromStorage(STORAGE_KEYS.ASSESSMENTS, initialAssessments)
    return stored
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    await this.simulateDelay()
    const assessments = getFromStorage(STORAGE_KEYS.ASSESSMENTS, initialAssessments)
    return assessments.find((a) => a.id === id) || null
  }

  async createAssessment(data: Omit<Assessment, "id" | "createdAt" | "tenantId">): Promise<Assessment> {
    await this.simulateDelay()
    const assessments = getFromStorage(STORAGE_KEYS.ASSESSMENTS, initialAssessments)
    const newAssessment: Assessment = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      tenantId: "tenant_1",
    }
    assessments.push(newAssessment)
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, assessments)
    return newAssessment
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    await this.simulateDelay()
    const assessments = getFromStorage(STORAGE_KEYS.ASSESSMENTS, initialAssessments)
    const index = assessments.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Assessment not found")
    
    assessments[index] = { ...assessments[index], ...updates }
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, assessments)
    return assessments[index]
  }

  async deleteAssessment(id: string): Promise<void> {
    await this.simulateDelay()
    const assessments = getFromStorage(STORAGE_KEYS.ASSESSMENTS, initialAssessments)
    const filtered = assessments.filter((a) => a.id !== id)
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, filtered)
  }

  async runAssessment(id: string): Promise<Assessment> {
    await this.simulateDelay(3000) // Longer delay for running
    const assessments = getFromStorage(STORAGE_KEYS.ASSESSMENTS, initialAssessments)
    const index = assessments.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Assessment not found")

    assessments[index] = {
      ...assessments[index],
      status: "completed",
      completedAt: new Date().toISOString(),
      score: {
        total: Math.floor(Math.random() * 40) + 60,
        residualRisk: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
        familyBreakdown: {
          "Access Control": Math.floor(Math.random() * 40) + 60,
          "Data Protection": Math.floor(Math.random() * 40) + 60,
          Governance: Math.floor(Math.random() * 40) + 60,
          "Incident Response": Math.floor(Math.random() * 40) + 60,
          "Third Party": Math.floor(Math.random() * 40) + 60,
          "Business Continuity": Math.floor(Math.random() * 40) + 60,
        },
      },
    }
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, assessments)
    return assessments[index]
  }

  // DOCUMENTS CRUD
  async getDocuments(): Promise<Document[]> {
    await this.simulateDelay()
    return getFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments)
  }

  async getDocument(id: string): Promise<Document | null> {
    await this.simulateDelay()
    const documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments)
    return documents.find((d) => d.id === id) || null
  }

  async createDocument(file: File, metadata: { type: Document["type"]; description?: string }): Promise<Document> {
    await this.simulateDelay(2000)
    const documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments)
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: metadata.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "ready",
      tenantId: "tenant_1",
      hash: Math.random().toString(36).substring(7),
      pages: Math.floor(Math.random() * 50) + 5,
    }
    documents.push(newDocument)
    saveToStorage(STORAGE_KEYS.DOCUMENTS, documents)
    return newDocument
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    await this.simulateDelay()
    const documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments)
    const index = documents.findIndex((d) => d.id === id)
    if (index === -1) throw new Error("Document not found")
    
    documents[index] = { ...documents[index], ...updates }
    saveToStorage(STORAGE_KEYS.DOCUMENTS, documents)
    return documents[index]
  }

  async deleteDocument(id: string): Promise<void> {
    await this.simulateDelay()
    const documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments)
    const filtered = documents.filter((d) => d.id !== id)
    saveToStorage(STORAGE_KEYS.DOCUMENTS, filtered)
  }

  // PACKS CRUD
  async getPacks(): Promise<PromptPack[]> {
    await this.simulateDelay()
    // Return from mock-data
    return []
  }

  async getPack(id: string): Promise<PromptPack | null> {
    await this.simulateDelay()
    return null
  }

  async createPack(data: Omit<PromptPack, "id" | "createdAt" | "updatedAt">): Promise<PromptPack> {
    await this.simulateDelay()
    const packs = getFromStorage<PromptPack>(STORAGE_KEYS.PACKS, [])
    const newPack: PromptPack = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    packs.push(newPack)
    saveToStorage(STORAGE_KEYS.PACKS, packs)
    return newPack
  }

  async updatePack(id: string, updates: Partial<PromptPack>): Promise<PromptPack> {
    await this.simulateDelay()
    const packs = getFromStorage<PromptPack>(STORAGE_KEYS.PACKS, [])
    const index = packs.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Pack not found")
    
    packs[index] = { ...packs[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.PACKS, packs)
    return packs[index]
  }

  async deletePack(id: string): Promise<void> {
    await this.simulateDelay()
    const packs = getFromStorage<PromptPack>(STORAGE_KEYS.PACKS, [])
    const filtered = packs.filter((p) => p.id !== id)
    saveToStorage(STORAGE_KEYS.PACKS, filtered)
  }

  async likePack(id: string, userId: string): Promise<void> {
    await this.simulateDelay()
    // Increment like count
  }

  async ratePack(packId: string, rating: number, comment: string, userId: string): Promise<Rating> {
    await this.simulateDelay()
    const ratings = getFromStorage<Rating>(STORAGE_KEYS.RATINGS, [])
    const newRating: Rating = {
      id: Date.now().toString(),
      packId,
      userId,
      username: "User",
      rating,
      comment,
      createdAt: new Date().toISOString(),
      helpful: 0,
    }
    ratings.push(newRating)
    saveToStorage(STORAGE_KEYS.RATINGS, ratings)
    return newRating
  }

  // FINDINGS CRUD
  async getFindings(): Promise<any[]> {
    await this.simulateDelay()
    return getFromStorage(STORAGE_KEYS.FINDINGS, [])
  }

  async createFinding(data: any): Promise<any> {
    await this.simulateDelay()
    const findings = getFromStorage(STORAGE_KEYS.FINDINGS, [])
    const newFinding = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    findings.push(newFinding)
    saveToStorage(STORAGE_KEYS.FINDINGS, findings)
    return newFinding
  }

  async updateFinding(id: string, updates: any): Promise<any> {
    await this.simulateDelay()
    const findings = getFromStorage(STORAGE_KEYS.FINDINGS, [])
    const index = findings.findIndex((f: any) => f.id === id)
    if (index === -1) throw new Error("Finding not found")
    
    findings[index] = { ...findings[index], ...updates }
    saveToStorage(STORAGE_KEYS.FINDINGS, findings)
    return findings[index]
  }

  async deleteFinding(id: string): Promise<void> {
    await this.simulateDelay()
    const findings = getFromStorage(STORAGE_KEYS.FINDINGS, [])
    const filtered = findings.filter((f: any) => f.id !== id)
    saveToStorage(STORAGE_KEYS.FINDINGS, filtered)
  }

  // REMEDIATION CRUD
  async getRemediations(): Promise<any[]> {
    await this.simulateDelay()
    return getFromStorage(STORAGE_KEYS.REMEDIATION, [])
  }

  async createRemediation(data: any): Promise<any> {
    await this.simulateDelay()
    const remediations = getFromStorage(STORAGE_KEYS.REMEDIATION, [])
    const newRemediation = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    remediations.push(newRemediation)
    saveToStorage(STORAGE_KEYS.REMEDIATION, remediations)
    return newRemediation
  }

  async updateRemediation(id: string, updates: any): Promise<any> {
    await this.simulateDelay()
    const remediations = getFromStorage(STORAGE_KEYS.REMEDIATION, [])
    const index = remediations.findIndex((r: any) => r.id === id)
    if (index === -1) throw new Error("Remediation not found")
    
    remediations[index] = { ...remediations[index], ...updates }
    saveToStorage(STORAGE_KEYS.REMEDIATION, remediations)
    return remediations[index]
  }

  async deleteRemediation(id: string): Promise<void> {
    await this.simulateDelay()
    const remediations = getFromStorage(STORAGE_KEYS.REMEDIATION, [])
    const filtered = remediations.filter((r: any) => r.id !== id)
    saveToStorage(STORAGE_KEYS.REMEDIATION, filtered)
  }

  // REQUIREMENTS CRUD
  async getRequirements(assessmentId?: string): Promise<Requirement[]> {
    await this.simulateDelay()
    const requirements = getFromStorage<Requirement>(STORAGE_KEYS.REQUIREMENTS, [])
    return assessmentId ? requirements.filter(r => r.assessmentId === assessmentId) : requirements
  }

  async getRequirement(id: string): Promise<Requirement | null> {
    await this.simulateDelay()
    const requirements = getFromStorage<Requirement>(STORAGE_KEYS.REQUIREMENTS, [])
    return requirements.find(r => r.id === id) || null
  }

  async createRequirement(data: Omit<Requirement, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Requirement> {
    await this.simulateDelay()
    const requirements = getFromStorage<Requirement>(STORAGE_KEYS.REQUIREMENTS, [])
    const newRequirement: Requirement = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    requirements.push(newRequirement)
    saveToStorage(STORAGE_KEYS.REQUIREMENTS, requirements)
    await this.createAuditLog("system", "CREATE", "requirement", newRequirement.id, { requirement: newRequirement })
    return newRequirement
  }

  async updateRequirement(id: string, updates: Partial<Requirement>): Promise<Requirement> {
    await this.simulateDelay()
    const requirements = getFromStorage<Requirement>(STORAGE_KEYS.REQUIREMENTS, [])
    const index = requirements.findIndex(r => r.id === id)
    if (index === -1) throw new Error("Requirement not found")
    
    const oldData = { ...requirements[index] }
    requirements[index] = { ...requirements[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.REQUIREMENTS, requirements)
    await this.createAuditLog("system", "UPDATE", "requirement", id, { before: oldData, after: requirements[index] })
    return requirements[index]
  }

  async deleteRequirement(id: string): Promise<void> {
    await this.simulateDelay()
    const requirements = getFromStorage<Requirement>(STORAGE_KEYS.REQUIREMENTS, [])
    const requirement = requirements.find(r => r.id === id)
    const filtered = requirements.filter(r => r.id !== id)
    saveToStorage(STORAGE_KEYS.REQUIREMENTS, filtered)
    if (requirement) {
      await this.createAuditLog("system", "DELETE", "requirement", id, { requirement })
    }
  }

  // CONTROLS CRUD
  async getControls(assessmentId?: string): Promise<Control[]> {
    await this.simulateDelay()
    const controls = getFromStorage<Control>(STORAGE_KEYS.CONTROLS, [])
    return assessmentId ? controls.filter(c => c.assessmentId === assessmentId) : controls
  }

  async getControl(id: string): Promise<Control | null> {
    await this.simulateDelay()
    const controls = getFromStorage<Control>(STORAGE_KEYS.CONTROLS, [])
    return controls.find(c => c.id === id) || null
  }

  async createControl(data: Omit<Control, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Control> {
    await this.simulateDelay()
    const controls = getFromStorage<Control>(STORAGE_KEYS.CONTROLS, [])
    const newControl: Control = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    controls.push(newControl)
    saveToStorage(STORAGE_KEYS.CONTROLS, controls)
    await this.createAuditLog("system", "CREATE", "control", newControl.id, { control: newControl })
    return newControl
  }

  async updateControl(id: string, updates: Partial<Control>): Promise<Control> {
    await this.simulateDelay()
    const controls = getFromStorage<Control>(STORAGE_KEYS.CONTROLS, [])
    const index = controls.findIndex(c => c.id === id)
    if (index === -1) throw new Error("Control not found")
    
    const oldData = { ...controls[index] }
    controls[index] = { ...controls[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.CONTROLS, controls)
    await this.createAuditLog("system", "UPDATE", "control", id, { before: oldData, after: controls[index] })
    return controls[index]
  }

  async deleteControl(id: string): Promise<void> {
    await this.simulateDelay()
    const controls = getFromStorage<Control>(STORAGE_KEYS.CONTROLS, [])
    const control = controls.find(c => c.id === id)
    const filtered = controls.filter(c => c.id !== id)
    saveToStorage(STORAGE_KEYS.CONTROLS, filtered)
    if (control) {
      await this.createAuditLog("system", "DELETE", "control", id, { control })
    }
  }

  // OBLIGATIONS CRUD
  async getObligations(assessmentId?: string): Promise<Obligation[]> {
    await this.simulateDelay()
    const obligations = getFromStorage<Obligation>(STORAGE_KEYS.OBLIGATIONS, [])
    return assessmentId ? obligations.filter(o => o.assessmentId === assessmentId) : obligations
  }

  async getObligation(id: string): Promise<Obligation | null> {
    await this.simulateDelay()
    const obligations = getFromStorage<Obligation>(STORAGE_KEYS.OBLIGATIONS, [])
    return obligations.find(o => o.id === id) || null
  }

  async createObligation(data: Omit<Obligation, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Obligation> {
    await this.simulateDelay()
    const obligations = getFromStorage<Obligation>(STORAGE_KEYS.OBLIGATIONS, [])
    const newObligation: Obligation = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    obligations.push(newObligation)
    saveToStorage(STORAGE_KEYS.OBLIGATIONS, obligations)
    await this.createAuditLog("system", "CREATE", "obligation", newObligation.id, { obligation: newObligation })
    return newObligation
  }

  async updateObligation(id: string, updates: Partial<Obligation>): Promise<Obligation> {
    await this.simulateDelay()
    const obligations = getFromStorage<Obligation>(STORAGE_KEYS.OBLIGATIONS, [])
    const index = obligations.findIndex(o => o.id === id)
    if (index === -1) throw new Error("Obligation not found")
    
    const oldData = { ...obligations[index] }
    obligations[index] = { ...obligations[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.OBLIGATIONS, obligations)
    await this.createAuditLog("system", "UPDATE", "obligation", id, { before: oldData, after: obligations[index] })
    return obligations[index]
  }

  async deleteObligation(id: string): Promise<void> {
    await this.simulateDelay()
    const obligations = getFromStorage<Obligation>(STORAGE_KEYS.OBLIGATIONS, [])
    const obligation = obligations.find(o => o.id === id)
    const filtered = obligations.filter(o => o.id !== id)
    saveToStorage(STORAGE_KEYS.OBLIGATIONS, filtered)
    if (obligation) {
      await this.createAuditLog("system", "DELETE", "obligation", id, { obligation })
    }
  }

  // PENALTIES CRUD
  async getPenalties(assessmentId?: string): Promise<Penalty[]> {
    await this.simulateDelay()
    const penalties = getFromStorage<Penalty>(STORAGE_KEYS.PENALTIES, [])
    return assessmentId ? penalties.filter(p => p.assessmentId === assessmentId) : penalties
  }

  async getPenalty(id: string): Promise<Penalty | null> {
    await this.simulateDelay()
    const penalties = getFromStorage<Penalty>(STORAGE_KEYS.PENALTIES, [])
    return penalties.find(p => p.id === id) || null
  }

  async createPenalty(data: Omit<Penalty, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Penalty> {
    await this.simulateDelay()
    const penalties = getFromStorage<Penalty>(STORAGE_KEYS.PENALTIES, [])
    const newPenalty: Penalty = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    penalties.push(newPenalty)
    saveToStorage(STORAGE_KEYS.PENALTIES, penalties)
    await this.createAuditLog("system", "CREATE", "penalty", newPenalty.id, { penalty: newPenalty })
    return newPenalty
  }

  async updatePenalty(id: string, updates: Partial<Penalty>): Promise<Penalty> {
    await this.simulateDelay()
    const penalties = getFromStorage<Penalty>(STORAGE_KEYS.PENALTIES, [])
    const index = penalties.findIndex(p => p.id === id)
    if (index === -1) throw new Error("Penalty not found")
    
    const oldData = { ...penalties[index] }
    penalties[index] = { ...penalties[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.PENALTIES, penalties)
    await this.createAuditLog("system", "UPDATE", "penalty", id, { before: oldData, after: penalties[index] })
    return penalties[index]
  }

  async deletePenalty(id: string): Promise<void> {
    await this.simulateDelay()
    const penalties = getFromStorage<Penalty>(STORAGE_KEYS.PENALTIES, [])
    const penalty = penalties.find(p => p.id === id)
    const filtered = penalties.filter(p => p.id !== id)
    saveToStorage(STORAGE_KEYS.PENALTIES, filtered)
    if (penalty) {
      await this.createAuditLog("system", "DELETE", "penalty", id, { penalty })
    }
  }

  // TIMELINES CRUD
  async getTimelines(assessmentId?: string): Promise<Timeline[]> {
    await this.simulateDelay()
    const timelines = getFromStorage<Timeline>(STORAGE_KEYS.TIMELINES, [])
    return assessmentId ? timelines.filter(t => t.assessmentId === assessmentId) : timelines
  }

  async getTimeline(id: string): Promise<Timeline | null> {
    await this.simulateDelay()
    const timelines = getFromStorage<Timeline>(STORAGE_KEYS.TIMELINES, [])
    return timelines.find(t => t.id === id) || null
  }

  async createTimeline(data: Omit<Timeline, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Timeline> {
    await this.simulateDelay()
    const timelines = getFromStorage<Timeline>(STORAGE_KEYS.TIMELINES, [])
    const newTimeline: Timeline = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    timelines.push(newTimeline)
    saveToStorage(STORAGE_KEYS.TIMELINES, timelines)
    await this.createAuditLog("system", "CREATE", "timeline", newTimeline.id, { timeline: newTimeline })
    return newTimeline
  }

  async updateTimeline(id: string, updates: Partial<Timeline>): Promise<Timeline> {
    await this.simulateDelay()
    const timelines = getFromStorage<Timeline>(STORAGE_KEYS.TIMELINES, [])
    const index = timelines.findIndex(t => t.id === id)
    if (index === -1) throw new Error("Timeline not found")
    
    const oldData = { ...timelines[index] }
    timelines[index] = { ...timelines[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.TIMELINES, timelines)
    await this.createAuditLog("system", "UPDATE", "timeline", id, { before: oldData, after: timelines[index] })
    return timelines[index]
  }

  async deleteTimeline(id: string): Promise<void> {
    await this.simulateDelay()
    const timelines = getFromStorage<Timeline>(STORAGE_KEYS.TIMELINES, [])
    const timeline = timelines.find(t => t.id === id)
    const filtered = timelines.filter(t => t.id !== id)
    saveToStorage(STORAGE_KEYS.TIMELINES, filtered)
    if (timeline) {
      await this.createAuditLog("system", "DELETE", "timeline", id, { timeline })
    }
  }

  // ATTESTATIONS CRUD
  async getAttestations(subjectId?: string): Promise<Attestation[]> {
    await this.simulateDelay()
    const attestations = getFromStorage<Attestation>(STORAGE_KEYS.ATTESTATIONS, [])
    return subjectId ? attestations.filter(a => a.subjectId === subjectId) : attestations
  }

  async getAttestation(id: string): Promise<Attestation | null> {
    await this.simulateDelay()
    const attestations = getFromStorage<Attestation>(STORAGE_KEYS.ATTESTATIONS, [])
    return attestations.find(a => a.id === id) || null
  }

  async createAttestation(data: Omit<Attestation, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Attestation> {
    await this.simulateDelay()
    const attestations = getFromStorage<Attestation>(STORAGE_KEYS.ATTESTATIONS, [])
    const newAttestation: Attestation = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    attestations.push(newAttestation)
    saveToStorage(STORAGE_KEYS.ATTESTATIONS, attestations)
    await this.createAuditLog(data.attestedBy || "system", "ATTEST", "attestation", newAttestation.id, { attestation: newAttestation })
    return newAttestation
  }

  async updateAttestation(id: string, updates: Partial<Attestation>): Promise<Attestation> {
    await this.simulateDelay()
    const attestations = getFromStorage<Attestation>(STORAGE_KEYS.ATTESTATIONS, [])
    const index = attestations.findIndex(a => a.id === id)
    if (index === -1) throw new Error("Attestation not found")
    
    const oldData = { ...attestations[index] }
    attestations[index] = { ...attestations[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.ATTESTATIONS, attestations)
    await this.createAuditLog("system", "UPDATE", "attestation", id, { before: oldData, after: attestations[index] })
    return attestations[index]
  }

  async deleteAttestation(id: string): Promise<void> {
    await this.simulateDelay()
    const attestations = getFromStorage<Attestation>(STORAGE_KEYS.ATTESTATIONS, [])
    const attestation = attestations.find(a => a.id === id)
    const filtered = attestations.filter(a => a.id !== id)
    saveToStorage(STORAGE_KEYS.ATTESTATIONS, filtered)
    if (attestation) {
      await this.createAuditLog("system", "DELETE", "attestation", id, { attestation })
    }
  }

  // CLARIFICATIONS CRUD
  async getClarifications(assessmentId?: string): Promise<Clarification[]> {
    await this.simulateDelay()
    const clarifications = getFromStorage<Clarification>(STORAGE_KEYS.CLARIFICATIONS, [])
    return assessmentId ? clarifications.filter(c => c.assessmentId === assessmentId) : clarifications
  }

  async getClarification(id: string): Promise<Clarification | null> {
    await this.simulateDelay()
    const clarifications = getFromStorage<Clarification>(STORAGE_KEYS.CLARIFICATIONS, [])
    return clarifications.find(c => c.id === id) || null
  }

  async createClarification(data: Omit<Clarification, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Clarification> {
    await this.simulateDelay()
    const clarifications = getFromStorage<Clarification>(STORAGE_KEYS.CLARIFICATIONS, [])
    const newClarification: Clarification = {
      ...data,
      id: Date.now().toString(),
      tenantId: "tenant_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    clarifications.push(newClarification)
    saveToStorage(STORAGE_KEYS.CLARIFICATIONS, clarifications)
    await this.createAuditLog("system", "CREATE", "clarification", newClarification.id, { clarification: newClarification })
    return newClarification
  }

  async updateClarification(id: string, updates: Partial<Clarification>): Promise<Clarification> {
    await this.simulateDelay()
    const clarifications = getFromStorage<Clarification>(STORAGE_KEYS.CLARIFICATIONS, [])
    const index = clarifications.findIndex(c => c.id === id)
    if (index === -1) throw new Error("Clarification not found")
    
    const oldData = { ...clarifications[index] }
    clarifications[index] = { ...clarifications[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.CLARIFICATIONS, clarifications)
    
    if (updates.status === "Resolved") {
      await this.createAuditLog(updates.resolvedBy || "system", "RESOLVE", "clarification", id, { before: oldData, after: clarifications[index] })
    } else {
      await this.createAuditLog("system", "UPDATE", "clarification", id, { before: oldData, after: clarifications[index] })
    }
    return clarifications[index]
  }

  async deleteClarification(id: string): Promise<void> {
    await this.simulateDelay()
    const clarifications = getFromStorage<Clarification>(STORAGE_KEYS.CLARIFICATIONS, [])
    const clarification = clarifications.find(c => c.id === id)
    const filtered = clarifications.filter(c => c.id !== id)
    saveToStorage(STORAGE_KEYS.CLARIFICATIONS, filtered)
    if (clarification) {
      await this.createAuditLog("system", "DELETE", "clarification", id, { clarification })
    }
  }

  // AUDIT LOGS CRUD
  async getAuditLogs(filters?: { targetType?: string; targetId?: string; actor?: string }): Promise<AuditLog[]> {
    await this.simulateDelay()
    let logs = getFromStorage<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, [])
    
    if (filters) {
      if (filters.targetType) {
        logs = logs.filter(l => l.targetType === filters.targetType)
      }
      if (filters.targetId) {
        logs = logs.filter(l => l.targetId === filters.targetId)
      }
      if (filters.actor) {
        logs = logs.filter(l => l.actor === filters.actor)
      }
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  async createAuditLog(
    actor: string,
    action: AuditLog["action"],
    targetType: AuditLog["targetType"],
    targetId: string,
    details: Record<string, any>
  ): Promise<AuditLog> {
    // No delay for audit logs to avoid performance issues
    const logs = getFromStorage<AuditLog>(STORAGE_KEYS.AUDIT_LOGS, [])
    const newLog: AuditLog = {
      id: Date.now().toString() + Math.random(),
      tenantId: "tenant_1",
      actor,
      action,
      target: `${targetType}:${targetId}`,
      targetType,
      targetId,
      timestamp: new Date().toISOString(),
      details,
    }
    logs.push(newLog)
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs)
    return newLog
  }

  // Helper
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const fakeDB = new FakeDatabase()