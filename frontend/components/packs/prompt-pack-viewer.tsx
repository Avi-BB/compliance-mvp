"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Rating,
  LinearProgress,
} from "@mui/material"
import { Download, Heart, Share, Star, Eye, Crown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { PromptCard } from "./prompt-card"
import { RatingsList } from "./ratings-list"
import type { PromptPack, Prompt, Rating as RatingType } from "@/lib/types"

interface PromptPackViewerProps {
  pack: PromptPack
  prompts: Prompt[]
  ratings: RatingType[]
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pack-tabpanel-${index}`}
      aria-labelledby={`pack-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export function PromptPackViewer({ pack, prompts, ratings }: PromptPackViewerProps) {
  const [currentTab, setCurrentTab] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(pack.likeCount)
  const { user, isAuthenticated } = useAuth()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  const handleLike = () => {
    if (!isAuthenticated) return

    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))

    // In real app, make API call to toggle like
  }

  const handleDownload = () => {
    // In real app, trigger download and track analytics
    console.log("Downloading pack:", pack.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pack.title,
        text: pack.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: ratings.filter((r) => r.rating === rating).length,
    percentage: ratings.length > 0 ? (ratings.filter((r) => r.rating === rating).length / ratings.length) * 100 : 0,
  }))

  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {pack.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              {pack.description}
            </Typography>

            {/* Author Info */}
            {pack.author && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar src={pack.author.avatarUrl} sx={{ width: 40, height: 40, mr: 2 }}>
                  {pack.author.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {pack.author.fullName || pack.author.username}
                    </Typography>
                    {pack.author.isVerified && <Crown size={16} color="#F59E0B" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    @{pack.author.username}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Tags */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {pack.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" size="small" />
              ))}
            </Box>

            {/* Stats */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Download size={16} />
                <Typography variant="body2">{pack.downloadCount.toLocaleString()} downloads</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Heart size={16} />
                <Typography variant="body2">{likeCount} likes</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Eye size={16} />
                <Typography variant="body2">{pack.viewCount.toLocaleString()} views</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Star size={16} />
                <Typography variant="body2">
                  {pack.averageRating.toFixed(1)} ({pack.ratingCount} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" size="large" startIcon={<Download size={20} />} onClick={handleDownload}>
              Download Pack
            </Button>
            <Button
              variant={isLiked ? "contained" : "outlined"}
              color={isLiked ? "error" : "inherit"}
              startIcon={<Heart size={20} />}
              onClick={handleLike}
              disabled={!isAuthenticated}
            >
              {isLiked ? "Liked" : "Like"}
            </Button>
            <IconButton onClick={handleShare} size="large">
              <Share size={20} />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pack Details
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Version:
                </Typography>
                <Typography variant="body2">{pack.version}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  License:
                </Typography>
                <Typography variant="body2">{pack.license}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Prompts:
                </Typography>
                <Typography variant="body2">{prompts.length}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body2">{new Date(pack.createdAt).toLocaleDateString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Updated:
                </Typography>
                <Typography variant="body2">{new Date(pack.updatedAt).toLocaleDateString()}</Typography>
              </Box>

              {pack.category && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category:
                  </Typography>
                  <Chip label={pack.category.name} color="primary" variant="outlined" sx={{ mb: 2 }} />
                </Box>
              )}

              {/* Rating Overview */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ratings
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" sx={{ mr: 2 }}>
                  {pack.averageRating.toFixed(1)}
                </Typography>
                <Box>
                  <Rating value={pack.averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    {pack.ratingCount} reviews
                  </Typography>
                </Box>
              </Box>

              {/* Rating Distribution */}
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <Box key={rating} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 20 }}>
                    {rating}
                  </Typography>
                  <Star size={14} style={{ margin: "0 4px" }} />
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{ flexGrow: 1, mx: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                    {count}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label={`Prompts (${prompts.length})`} />
            <Tab label={`Reviews (${ratings.length})`} />
            <Tab label="About" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {prompts.map((prompt) => (
              <Grid item xs={12} key={prompt.id}>
                <PromptCard prompt={prompt} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <RatingsList ratings={ratings} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Box sx={{ maxWidth: 800 }}>
            <Typography variant="h6" gutterBottom>
              About this Pack
            </Typography>
            <Typography variant="body1" paragraph>
              {pack.description}
            </Typography>

            {pack.author?.bio && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  About the Author
                </Typography>
                <Typography variant="body1" paragraph>
                  {pack.author.bio}
                </Typography>
              </>
            )}
          </Box>
        </TabPanel>
      </Card>
    </Box>
  )
}
