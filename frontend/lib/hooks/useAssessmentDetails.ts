import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { updateFinding } from "../slices/findingsSlice"
import type { Assessment } from "../slices/assessmentsSlice"
import type { Finding } from "../slices/findingsSlice"

// Mock data for assessment details
const mockFindings: Finding[] = [
  {
    id: "f1",
    assessmentId: "1",
    kind: "REQUIREMENT",
    title: "Multi-factor authentication required for administrative access",
    description:
      "All administrative user accounts must implement multi-factor authentication (MFA) to comply with PCI DSS requirement 8.3. This includes privileged access to cardholder data environment systems.",
    requirementType: "must",
    severity: "high",
    impactArea: "security",
    confidence: 0.95,
    citationConfidence: 0.92,
    status: "CONFIRMED",
    evidence: {
      chunkId: "chunk_1",
      documentId: "1",
      page: 18,
      excerpt: "Requirement 8.3: Secure all individual non-console administrative access and all remote access...",
    },
    attestation: {
      status: "Partial",
      owner: "IT Security Team",
      notes: "MFA enabled for VPN access only, need to extend to all admin consoles",
    },
  },
  {
    id: "f2",
    assessmentId: "1",
    kind: "RISK",
    title: "Insufficient access logging for payment processing systems",
    description:
      "Current logging mechanisms may not capture all access events to payment processing systems, creating potential compliance gaps and security blind spots.",
    severity: "medium",
    likelihood: "possible",
    impactArea: "operational",
    confidence: 0.78,
    citationConfidence: 0.85,
    status: "CONFIRMED",
    evidence: {
      chunkId: "chunk_2",
      documentId: "1",
      page: 22,
      excerpt: "Requirement 10.2: Implement automated audit trails for all system components...",
    },
  },
  {
    id: "f3",
    assessmentId: "1",
    kind: "REQUIREMENT",
    title: "Regular vulnerability scanning of network infrastructure",
    description:
      "Network vulnerability scans must be performed quarterly and after any significant network changes to identify and address security vulnerabilities.",
    requirementType: "must",
    severity: "high",
    impactArea: "security",
    confidence: 0.88,
    citationConfidence: 0.91,
    status: "CONFIRMED",
    evidence: {
      chunkId: "chunk_3",
      documentId: "1",
      page: 35,
      excerpt: "Requirement 11.2: Run internal and external network vulnerability scans at least quarterly...",
    },
    attestation: {
      status: "Have",
      owner: "Infrastructure Team",
      evidenceUri: "https://internal.company.com/vuln-scan-reports",
      notes: "Quarterly scans performed using Nessus, reports available in security portal",
    },
  },
]

const fetchAssessmentDetails = async (assessmentId: string): Promise<Assessment | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock assessment data - in real app, this would come from API
  const mockAssessment: Assessment = {
    id: assessmentId,
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
  }

  return assessmentId === "1" ? mockAssessment : null
}

const fetchFindings = async (assessmentId: string): Promise<Finding[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockFindings.filter((f) => f.assessmentId === assessmentId)
}

const updateAttestation = async (
  findingId: string,
  attestation: Finding["attestation"],
): Promise<Finding["attestation"]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return attestation
}

export const useAssessmentDetails = (assessmentId: string) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const assessmentQuery = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => fetchAssessmentDetails(assessmentId),
  })

  const findingsQuery = useQuery({
    queryKey: ["findings", assessmentId],
    queryFn: () => fetchFindings(assessmentId),
  })

  const attestationMutation = useMutation({
    mutationFn: ({ findingId, attestation }: { findingId: string; attestation: Finding["attestation"] }) =>
      updateAttestation(findingId, attestation),
    onSuccess: (attestation, { findingId }) => {
      dispatch(updateFinding({ id: findingId, attestation }))
      queryClient.invalidateQueries({ queryKey: ["findings", assessmentId] })
    },
  })

  const findings = findingsQuery.data || []
  const requirements = findings.filter((f) => f.kind === "REQUIREMENT")
  const risks = findings.filter((f) => f.kind === "RISK")

  return {
    assessment: assessmentQuery.data,
    findings,
    requirements,
    risks,
    loading: assessmentQuery.isLoading || findingsQuery.isLoading,
    error: assessmentQuery.error || findingsQuery.error,
    updateAttestation: (findingId: string, attestation: Finding["attestation"]) =>
      attestationMutation.mutate({ findingId, attestation }),
    isUpdatingAttestation: attestationMutation.isPending,
  }
}
