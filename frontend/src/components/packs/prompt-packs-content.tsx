"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material"
import {
  TrendingUp,
  Download,
  Heart,
  Star,
  BookOpen,
  Plus,
  MoreVertical as MoreVert,
  Eye,
  Share,
  Edit,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { mockPromptPacks } from "@/lib/mock-data"
import type { PromptPack } from "@/lib/types"

interface DashboardStats {
  totalPacks: number
  totalDownloads: number
  totalLikes: number
  totalViews: number
  packGrowth: number
  downloadGrowth: number
}

export function PromptPacksContent() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPacks: 0,
    totalDownloads: 0,
    totalLikes: 0,
    totalViews: 0,
    packGrowth: 0,
    downloadGrowth: 0,
  })
  const [userPacks, setUserPacks] = useState<PromptPack[]>([])
  const [featuredPacks, setFeaturedPacks] = useState<PromptPack[]>([])
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    // For now, use the first user from mock data (you can update this when real auth is integrated)
    const currentUserId = user?.id || "1"
    const userPacksData = mockPromptPacks.filter((pack) => pack.authorId === currentUserId)
    const featuredPacksData = mockPromptPacks.filter((pack) => pack.isFeatured).slice(0, 6)

    setUserPacks(userPacksData)
    setFeaturedPacks(featuredPacksData)

    const totalDownloads = userPacksData.reduce((sum, pack) => sum + pack.downloadCount, 0)
    const totalLikes = userPacksData.reduce((sum, pack) => sum + pack.likeCount, 0)
    const totalViews = userPacksData.reduce((sum, pack) => sum + pack.viewCount, 0)

    setStats({
      totalPacks: userPacksData.length,
      totalDownloads,
      totalLikes,
      totalViews,
      packGrowth: 12,
      downloadGrowth: 23,
    })
  }, [user?.id])

  const handleMenuClick = (packId: string, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor((prev) => ({ ...prev, [packId]: event.currentTarget }))
  }

  const handleMenuClose = (packId: string) => {
    setMenuAnchor((prev) => ({ ...prev, [packId]: null }))
  }

  const StatCard = ({ title, value, change, icon: Icon, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        height: "100%",
        minHeight: 160,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(135deg, ${color === 'primary' ? 'rgba(69, 56, 202, 0.05)' : color === 'success' ? 'rgba(16, 185, 129, 0.05)' : color === 'error' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)'} 0%, transparent 100%)`,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: `${color}.main`,
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px rgba(69, 56, 202, 0.15)`,
        },
      }}>
        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
                {title}
              </Typography>
              <Typography variant="h3" component="div" color={`${color}.main`} sx={{ fontWeight: 700, mb: 1 }}>
                {typeof value === "number" ? value.toLocaleString() : value}
              </Typography>
            </Box>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              color: "white",
              display: "inline-flex",
              flexShrink: 0,
              ml: 2,
            }}>
              <Icon size={24} />
            </Box>
          </Box>
          {change !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingUp size={16} color={change > 0 ? "#10B981" : "#EF4444"} />
              <Typography variant="body2" color={change > 0 ? "success.main" : "error.main"} sx={{ ml: 0.5, fontWeight: 600 }}>
                {change > 0 ? "+" : ""}
                {change}%
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  const PackCard = ({ pack, showAuthor = false }: { pack: PromptPack; showAuthor?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(69, 56, 202, 0.15)",
        },
      }}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3 }}>
                {pack.title}
              </Typography>
              {showAuthor && pack.author && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar src={pack.author.avatarUrl} sx={{ width: 20, height: 20, mr: 1 }}>
                    {pack.author.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {pack.author.username}
                  </Typography>
                </Box>
              )}
            </Box>
            <IconButton size="small" onClick={(e) => handleMenuClick(pack.id, e)}>
              <MoreVert size={16} />
            </IconButton>
            <Menu
              anchorEl={menuAnchor[pack.id]}
              open={Boolean(menuAnchor[pack.id])}
              onClose={() => handleMenuClose(pack.id)}
            >
              <MenuItem component={Link} href={`/packs/${pack.id}`} onClick={() => handleMenuClose(pack.id)}>
                <Eye size={16} style={{ marginRight: 8 }} />
                View
              </MenuItem>
              {!showAuthor && (
                <MenuItem component={Link} href={`/packs/${pack.id}/edit`} onClick={() => handleMenuClose(pack.id)}>
                  <Edit size={16} style={{ marginRight: 8 }} />
                  Edit
                </MenuItem>
              )}
              <MenuItem onClick={() => handleMenuClose(pack.id)}>
                <Share size={16} style={{ marginRight: 8 }} />
                Share
              </MenuItem>
            </Menu>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
            {pack.description}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {pack.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
            {pack.tags.length > 3 && <Chip label={`+${pack.tags.length - 3}`} size="small" variant="outlined" />}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Download size={14} />
              <Typography variant="body2" color="text.secondary">
                {pack.downloadCount.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Heart size={14} />
              <Typography variant="body2" color="text.secondary">
                {pack.likeCount}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Star size={14} />
              <Typography variant="body2" color="text.secondary">
                {pack.averageRating.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                AI Prompt Packs
              </Typography>
              <Chip
                icon={<Sparkles size={14} />}
                label="AI-Powered"
                size="small"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "success.main",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              Manage your prompt packs and discover new ones from the community.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Plus size={20} />} 
            component={Link} 
            href="/create" 
            size="large"
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
              boxShadow: "0 4px 12px rgba(69, 56, 202, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, rgba(59, 46, 172, 1) 0%, rgba(14, 165, 115, 1) 100%)",
                boxShadow: "0 6px 20px rgba(69, 56, 202, 0.35)",
              },
            }}
          >
            Create Pack
          </Button>
        </Box>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Packs"
            value={stats.totalPacks}
            change={stats.packGrowth}
            icon={BookOpen}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Downloads"
            value={stats.totalDownloads}
            change={stats.downloadGrowth}
            icon={Download}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Likes" value={stats.totalLikes} icon={Heart} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Views" value={stats.totalViews} icon={Eye} color="info" />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            My Packs
          </Typography>
          <Button component={Link} href="/my-packs" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
            View All
          </Button>
        </Box>

        {userPacks.length > 0 ? (
          <Grid container spacing={3}>
            {userPacks.slice(0, 3).map((pack) => (
              <Grid item xs={12} md={4} key={pack.id}>
                <PackCard pack={pack} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <BookOpen size={48} style={{ color: "#9CA3AF", marginBottom: 16 }} />
              <Typography variant="h6" gutterBottom>
                No packs yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first prompt pack to get started
              </Typography>
              <Button variant="contained" component={Link} href="/create">
                Create Your First Pack
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            Featured Packs
          </Typography>
          <Button component={Link} href="/featured" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredPacks.map((pack) => (
            <Grid item xs={12} sm={6} md={4} key={pack.id}>
              <PackCard pack={pack} showAuthor={true} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}