"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material"
import { Upload, Plus, Sparkles, FileText, CheckCircle2, Clock, Files } from "lucide-react"
import { useDocuments } from "../../lib/hooks/useDocuments"
import { DocumentUpload } from "../../components/documents/DocumentUpload"
import { DocumentList } from "../../components/documents/DocumentList"
import { ComplianceTabsManager } from "../../components/compliance/ComplianceTabsManager"

export default function DocumentsPage() {
  const { documents, loading, uploadDocument, isUploading } = useDocuments()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const statCards = [
    {
      label: "Total Documents",
      value: documents.length,
      icon: FileText,
      color: "#2563eb",
      bgColor: "rgba(37, 99, 235, 0.1)",
      gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.02) 100%)",
    },
    {
      label: "Ready for Analysis",
      value: documents.filter((d) => d.status === "ready").length,
      icon: CheckCircle2,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)",
    },
    {
      label: "Processing",
      value: documents.filter((d) => d.status === "processing").length,
      icon: Clock,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)",
    },
    {
      label: "Total Pages",
      value: documents.reduce((sum, d) => sum + (d.pages || 0), 0),
      icon: Files,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)",
    },
  ]

  return (
    <Box sx={{ 
      flexGrow: 1, 
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, transparent 50%, rgba(16, 185, 129, 0.03) 100%)",
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  Document Management
                </Typography>
                <Chip
                  icon={<Sparkles size={14} />}
                  label="AI-Ready"
                  size="small"
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    fontWeight: 600,
                    borderRadius: 2,
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
                Upload and manage regulatory documents, contracts, and policies for AI-powered compliance assessment.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Plus />} 
              onClick={() => setUploadDialogOpen(true)} 
              size="large"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: "linear-gradient(135deg, #2563eb 0%, #10b981 100%)",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                transition: "all 0.3s",
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8 0%, #059669 100%)",
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Upload Document
            </Button>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    minHeight: 160,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    background: stat.gradient,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: stat.color,
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${stat.bgColor}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: stat.bgColor,
                          display: "inline-flex",
                          flexShrink: 0,
                          ml: 2,
                          border: "1px solid",
                          borderColor: `${stat.color}20`,
                        }}
                      >
                        <stat.icon size={24} style={{ color: stat.color }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Document List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{ 
            borderRadius: 3, 
            border: "1px solid", 
            borderColor: "divider", 
            mb: 4,
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your uploaded regulatory documents and policies
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  startIcon={<Upload />} 
                  onClick={() => setUploadDialogOpen(true)} 
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  Upload
                </Button>
              </Box>
              <DocumentList documents={documents} loading={loading} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card sx={{ 
            borderRadius: 3, 
            border: "1px solid", 
            borderColor: "divider",
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Compliance Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage requirements, obligations, penalties, timelines, attestations, and more
                </Typography>
              </Box>
              <ComplianceTabsManager />
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
          } 
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 2, 
              bgcolor: "rgba(16, 185, 129, 0.1)",
              display: "inline-flex"
            }}>
              <Sparkles size={20} style={{ color: "#10b981" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Upload Document
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Upload regulations, contracts, or policies for AI-powered analysis
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DocumentUpload
            onUpload={(file, metadata) => {
              uploadDocument(file, metadata)
              setUploadDialogOpen(false)
            }}
            isUploading={isUploading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setUploadDialogOpen(false)} 
            sx={{ 
              textTransform: "none",
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}