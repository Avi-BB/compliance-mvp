"use client"

import { motion } from "framer-motion"
import { 
  Shield, 
  Upload, 
  FileText, 
  TrendingUp, 
  Check, 
  ArrowRight,
  Sparkles,
  Brain,
  Lock,
  Zap,
  FileCheck,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" strokeWidth={2.5} />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Compliance HealthCheck
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/login" 
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link 
              style = {{
                paddingLeft: "12px",
                paddingRight: "12px", 
                paddingTop: "6px",
                paddingBottom: "6px",
                borderRadius: "8px",
                fontWeight: 600,
                background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                boxShadow: "0 4px 12px rgba(69, 56, 202, 0.25)",
              }}
                href="/dashboard" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Compliance Intelligence</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Transform Compliance
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                From Burden to Advantage
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Upload regulations, contracts, or policies. Our AI instantly extracts requirements, identifies gaps, 
              and delivers a prioritized remediation roadmap—all with clause-level citations.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
               style = {{
              
                fontWeight: 600,
                background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
                boxShadow: "0 4px 12px rgba(69, 56, 202, 0.25)",
              }}
                href="/documents" 
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-all hover:shadow-2xl hover:shadow-primary/30 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Upload className="h-5 w-5" />
                Start Free Assessment
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-card border-2 border-border text-foreground rounded-xl text-base font-semibold hover:border-primary/50 hover:bg-card/80 transition-all w-full sm:w-auto">
                Watch Demo
              </button>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-success" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-success" />
                <span>Results in Minutes</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Document to Action in{" "}
              <span className="text-primary">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered engine handles the heavy lifting so you can focus on what matters
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload Documents",
                description: "Drop your PDFs, regulations, contracts, or policies. We support OCR and multi-language processing.",
                color: "text-chart-1"
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Advanced LLM extracts requirements, risks, obligations, penalties, and timelines with precise citations.",
                color: "text-chart-2"
              },
              {
                icon: FileCheck,
                title: "Attest Controls",
                description: "Mark requirements as Have/Partial/Don't Have. Add evidence and notes for each control.",
                color: "text-chart-4"
              },
              {
                icon: BarChart3,
                title: "Get Roadmap",
                description: "Receive compliance scores, risk heatmaps, and prioritized remediation plans with effort estimates.",
                color: "text-chart-5"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10">
                  <div className={`inline-flex p-3 bg-muted rounded-xl mb-4 ${step.color}`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute top-4 right-4 text-5xl font-bold text-muted/10">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Regulated Enterprises
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade capabilities designed for BFSI, healthcare, and critical infrastructure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Pre-Built Prompt Packs",
                description: "Ready-to-use templates for PCI DSS, ISO 27001, GDPR, AML/KYC, SOX, Basel III, and more.",
                gradient: "from-chart-1/20 to-chart-1/5"
              },
              {
                icon: FileText,
                title: "Clause-Level Citations",
                description: "Every finding includes document name, page number, and clause reference for audit trails.",
                gradient: "from-chart-2/20 to-chart-2/5"
              },
              {
                icon: AlertTriangle,
                title: "Risk Scoring Engine",
                description: "Impact × Likelihood analysis with control family weighting and residual risk calculation.",
                gradient: "from-chart-3/20 to-chart-3/5"
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "AES-256 encryption, tenant isolation, audit logs, and region-locked processing available.",
                gradient: "from-chart-2/20 to-chart-2/5"
              },
              {
                icon: Zap,
                title: "Automated Remediation",
                description: "Prioritized action plans with effort estimates, ownership suggestions, and dependency tracking.",
                gradient: "from-chart-4/20 to-chart-4/5"
              },
              {
                icon: TrendingUp,
                title: "Compliance Trends",
                description: "Track scores over time, compare assessments, and demonstrate continuous improvement.",
                gradient: "from-chart-5/20 to-chart-5/5"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} border border-border rounded-2xl p-8 h-full hover:border-primary/50 transition-all hover:shadow-xl`}>
                  <div className="inline-flex p-3 bg-card border border-border rounded-xl mb-4 group-hover:border-primary/50 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Frameworks */}
      <section className="py-20 px-6 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pre-Tuned for Leading Frameworks
            </h2>
            <p className="text-lg text-muted-foreground">
              Industry-specific prompt packs and control mappings ready out of the box
            </p>
          </motion.div>

          <motion.div 
            className="bg-card border border-border rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "PCI DSS", category: "Payment" },
                { name: "ISO 27001", category: "InfoSec" },
                { name: "SOX", category: "Financial" },
                { name: "GDPR", category: "Privacy" },
                { name: "AML/KYC", category: "Banking" },
                { name: "Basel III", category: "Banking" },
                { name: "MiFID II", category: "Financial" },
                { name: "CCPA", category: "Privacy" },
                { name: "HIPAA", category: "Healthcare" },
                { name: "NIST CSF", category: "InfoSec" },
                { name: "FedRAMP", category: "Government" },
                { name: "AI Governance", category: "Emerging" }
              ].map((framework) => (
                <div
                  key={framework.name}
                  className="group px-4 py-2 bg-muted border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold">{framework.name}</span>
                    <span className="text-xs text-muted-foreground">{framework.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Ready to Accelerate Compliance?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join leading enterprises using AI to transform regulatory compliance from reactive to proactive
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
              
                  href="/register" 
                  className="group px-8 py-4 bg-background text-foreground rounded-xl text-base font-semibold hover:bg-background/90 transition-all hover:shadow-2xl flex items-center gap-2 justify-center"
                >
                  Start Free Assessment
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground rounded-xl text-base font-semibold hover:border-primary-foreground/50 hover:bg-primary-foreground/10 transition-all"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Compliance HealthCheck</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <span>© 2025 All rights reserved</span>
              <span>•</span>
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <span>•</span>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <span>•</span>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}