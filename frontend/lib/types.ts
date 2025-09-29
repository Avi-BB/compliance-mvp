export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  bio?: string
  websiteUrl?: string
  githubUrl?: string
  twitterUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  createdAt: string
}

export interface PromptPack {
  id: string
  title: string
  description?: string
  authorId: string
  author?: User
  categoryId?: string
  category?: Category
  tags: string[]
  isPublic: boolean
  isFeatured: boolean
  version: string
  license: string
  price: number
  downloadCount: number
  viewCount: number
  likeCount: number
  averageRating: number
  ratingCount: number
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
  prompts?: Prompt[]
}

export interface Prompt {
  id: string
  packId: string
  title: string
  content: string
  description?: string
  category?: string
  variables?: Record<string, any>
  exampleInput?: string
  exampleOutput?: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  packId: string
  userId: string
  user?: User
  rating: number
  review?: string
  createdAt: string
  updatedAt: string
}

export interface Like {
  id: string
  packId: string
  userId: string
  createdAt: string
}

export interface Collection {
  id: string
  userId: string
  user?: User
  name: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  packs?: PromptPack[]
}

export interface UsageAnalytics {
  id: string
  packId: string
  promptId?: string
  userId?: string
  action: "view" | "copy" | "download" | "share"
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: boolean
  message?: string
}

// Filter and search types
export interface PackFilters {
  category?: string
  tags?: string[]
  author?: string
  minRating?: number
  maxPrice?: number
  isFree?: boolean
  isFeatured?: boolean
  sortBy?: "newest" | "popular" | "rating" | "downloads"
  search?: string
}

export interface PackSearchParams {
  q?: string
  category?: string
  tags?: string
  author?: string
  rating?: string
  price?: string
  sort?: string
  page?: string
  limit?: string
}
