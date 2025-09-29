"use client"
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material"
import { Upload, FileText, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "white", borderBottom: 1, borderColor: "grey.200", py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Shield size={32} color="#4338ca" />
              <Typography variant="h5" fontWeight={700} color="primary">
                Compliance HealthCheck
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" href="/login">
                Sign In
              </Button>
              <Button variant="contained" href="/dashboard">
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h1" sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}>
            AI-Powered Compliance Assessment
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              for Regulated Enterprises
            </Box>
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "text.secondary", maxWidth: 600, mx: "auto" }}>
            Rapidly assess regulatory compliance gaps with document-driven AI analysis. Get actionable insights, risk
            ratings, and prioritized remediation plans.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Upload />}
              component={Link}
              href="/documents"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Assessment
            </Button>
            <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5 }}>
              View Demo
            </Button>
          </Box>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <FileText size={48} color="#4338ca" />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Document Analysis
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upload regulations, contracts, and policies. Our AI extracts requirements, risks, and obligations with
                  precise citations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Shield size={48} color="#059669" />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Risk Assessment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Automated risk scoring with impact analysis. Identify critical gaps and prioritize remediation efforts
                  based on regulatory impact.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TrendingUp size={48} color="#d97706" />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Action Planning
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get prioritized remediation plans with effort estimates, ownership suggestions, and timeline
                  recommendations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Supported Frameworks */}
        <Box sx={{ textAlign: "center", py: 6, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Supported Compliance Frameworks
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            {["PCI DSS", "ISO 27001", "SOX", "GDPR", "AML/KYC", "Basel III", "MiFID II", "CCPA"].map((framework) => (
              <Chip key={framework} label={framework} variant="outlined" sx={{ fontWeight: 500 }} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
