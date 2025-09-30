import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div style={{ 
        padding: "32px", 
        maxWidth: "1280px", 
        margin: "0 auto",
        minHeight: "100vh",
        background: "linear-gradient(135deg, rgba(69, 56, 202, 0.03) 0%, transparent 50%, rgba(16, 185, 129, 0.03) 100%)",
      }}>
        <DashboardContent />
      </div>
    </AuthGuard>
  )
}