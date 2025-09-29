"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

export function DashboardContent() {
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
    // Mock data loading - in real app, fetch from API
    const userPacksData = mockPromptPacks.filter((pack) => pack.authorId === user?.id)
    const featuredPacksData = mockPromptPacks.filter((pack) => pack.isFeatured).slice(0, 6)

    setUserPacks(userPacksData)
    setFeaturedPacks(featuredPacksData)

    // Calculate stats
    const totalDownloads = userPacksData.reduce((sum, pack) => sum + pack.downloadCount, 0)
    const totalLikes = userPacksData.reduce((sum, pack) => sum + pack.likeCount, 0)
    const totalViews = userPacksData.reduce((sum, pack) => sum + pack.viewCount, 0)

    setStats({
      totalPacks: userPacksData.length,
      totalDownloads,
      totalLikes,
      totalViews,
      packGrowth: 12, // Mock growth percentage
      downloadGrowth: 23, // Mock growth percentage
    })
  }, [user?.id])

  const handleMenuClick = (packId: string, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor((prev) => ({ ...prev, [packId]: event.currentTarget }))
  }

  const handleMenuClose = (packId: string) => {
    setMenuAnchor((prev) => ({ ...prev, [packId]: null }))
  }

  const StatCard = ({ title, value, change, icon: Icon, color = "primary" }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUp size={16} color={change > 0 ? "#10B981" : "#EF4444"} />
                <Typography variant="body2" color={change > 0 ? "success.main" : "error.main"} sx={{ ml: 0.5 }}>
                  {change > 0 ? "+" : ""}
                  {change}%
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            <Icon size={24} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )

  const PackCard = ({ pack, showAuthor = false }: { pack: PromptPack; showAuthor?: boolean }) => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
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
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.fullName || user?.username}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your prompt packs and discover new ones from the community.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={20} />} component={Link} href="/create" size="large">
          Create Pack
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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

      {/* My Packs Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2">
            My Packs
          </Typography>
          <Button component={Link} href="/my-packs" variant="outlined">
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

      {/* Featured Packs Section */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2">
            Featured Packs
          </Typography>
          <Button component={Link} href="/featured" variant="outlined">
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
