"use client"

import { useState } from "react"
import { Box, Tabs, Tab, Typography } from "@mui/material"
import { FileText, Shield, AlertTriangle, Scale, Calendar, CheckCircle, HelpCircle, History } from "lucide-react"
import { RequirementsManager } from "../requirements/RequirementsManager"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ padding: "24px 0" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export const ComplianceTabsManager = ({ assessmentId }: { assessmentId?: string }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Box>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tab icon={<Shield size={18} />} label="Requirements & Controls" iconPosition="start" />
        <Tab icon={<AlertTriangle size={18} />} label="Penalties & Sanctions" iconPosition="start" />
        <Tab icon={<Scale size={18} />} label="Legal Obligations" iconPosition="start" />
        <Tab icon={<Calendar size={18} />} label="Timelines" iconPosition="start" />
        <Tab icon={<CheckCircle size={18} />} label="Attestations" iconPosition="start" />
        <Tab icon={<HelpCircle size={18} />} label="Clarifications" iconPosition="start" />
        <Tab icon={<History size={18} />} label="Audit Trail" iconPosition="start" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Typography variant="h6" gutterBottom>
          Requirements & Controls
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage extracted compliance requirements and control mappings from your documents
        </Typography>
        <RequirementsManager assessmentId={assessmentId} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>
          Penalties & Sanctions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track potential penalties, fines, and sanctions for non-compliance
        </Typography>
        <Typography color="text.secondary">Penalties manager coming soon...</Typography>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>
          Legal Obligations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Monitor legal obligations and reporting requirements by jurisdiction
        </Typography>
        <Typography color="text.secondary">Obligations manager coming soon...</Typography>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" gutterBottom>
          Compliance Timelines
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track important deadlines, milestones, and compliance triggers
        </Typography>
        <Typography color="text.secondary">Timelines manager coming soon...</Typography>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Typography variant="h6" gutterBottom>
          Attestations & Evidence
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Attest compliance status (Have/Partial/No) and link supporting evidence
        </Typography>
        <Typography color="text.secondary">Attestations interface coming soon...</Typography>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Typography variant="h6" gutterBottom>
          Clarifications & Uncertainties
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Resolve unclear requirements and track clarification requests
        </Typography>
        <Typography color="text.secondary">Clarifications manager coming soon...</Typography>
      </TabPanel>

      <TabPanel value={activeTab} index={6}>
        <Typography variant="h6" gutterBottom>
          Audit Trail
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View comprehensive history of all system activities and changes
        </Typography>
        <Typography color="text.secondary">Audit log viewer coming soon...</Typography>
      </TabPanel>
    </Box>
  )
}