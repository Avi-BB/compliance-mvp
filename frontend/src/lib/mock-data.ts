import type { PromptPack, User, Category, Prompt, Rating } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    username: "johndoe",
    fullName: "John Doe",
    avatarUrl: "/professional-man-avatar.png",
    bio: "AI enthusiast and prompt engineer with 5+ years of experience in content creation.",
    websiteUrl: "https://johndoe.dev",
    githubUrl: "https://github.com/johndoe",
    twitterUrl: "https://twitter.com/johndoe",
    isVerified: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "sarah.smith@example.com",
    username: "sarahsmith",
    fullName: "Sarah Smith",
    avatarUrl: "/professional-woman-avatar.png",
    bio: "Marketing professional specializing in AI-powered copywriting and brand strategy.",
    isVerified: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    email: "mike.chen@example.com",
    username: "mikechen",
    fullName: "Mike Chen",
    avatarUrl: "/developer-man-avatar.jpg",
    bio: "Full-stack developer and AI researcher, creating prompts for technical documentation.",
    githubUrl: "https://github.com/mikechen",
    isVerified: false,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
]

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Writing & Content",
    description: "Prompts for creative writing, copywriting, and content creation",
    color: "#3B82F6",
    icon: "PenTool",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Code & Development",
    description: "Programming, debugging, and software development prompts",
    color: "#10B981",
    icon: "Code",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "3",
    name: "Business & Marketing",
    description: "Business strategy, marketing, and sales prompts",
    color: "#F59E0B",
    icon: "Briefcase",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Education & Learning",
    description: "Educational content, tutoring, and learning prompts",
    color: "#8B5CF6",
    icon: "GraduationCap",
    createdAt: "2024-01-01T10:00:00Z",
  },
]

export const mockPrompts: Prompt[] = [
  {
    id: "1",
    packId: "1",
    title: "High-Converting Ad Headlines",
    content: `Create 5 compelling headlines for a {{product_type}} targeting {{target_audience}}. Each headline should:
- Address a specific pain point
- Include a clear benefit
- Create urgency or curiosity
- Be under 60 characters for optimal display

Product: {{product_name}}
Key benefits: {{key_benefits}}
Tone: {{tone}}`,
    description: "Generate attention-grabbing headlines that drive clicks and conversions",
    category: "Advertising",
    variables: {
      product_type: "text",
      target_audience: "text",
      product_name: "text",
      key_benefits: "text",
      tone: "select:professional,casual,urgent,friendly",
    },
    exampleInput: "Product: Productivity App, Target: Busy professionals, Benefits: Save 2 hours daily",
    orderIndex: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    packId: "1",
    title: "Email Subject Line Generator",
    content: `Generate 10 email subject lines for {{email_type}} about {{topic}}. Mix these approaches:
- 3 curiosity-driven subjects
- 3 benefit-focused subjects  
- 2 urgency-based subjects
- 2 personalized subjects

Target audience: {{audience}}
Goal: {{goal}}
Tone: {{tone}}`,
    description: "Create compelling email subject lines that improve open rates",
    category: "Email Marketing",
    variables: {
      email_type: "select:newsletter,promotional,welcome,follow-up",
      topic: "text",
      audience: "text",
      goal: "text",
      tone: "select:professional,casual,urgent,friendly",
    },
    exampleInput: "Email Type: Newsletter, Topic: New AI Features, Audience: SaaS users",
    orderIndex: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]

export const mockPromptPacks: PromptPack[] = [
  {
    id: "1",
    title: "Ultimate Copywriting Toolkit",
    description:
      "A comprehensive collection of 25+ proven copywriting prompts for ads, emails, landing pages, and social media content. Perfect for marketers and business owners.",
    authorId: "2",
    author: mockUsers[1],
    categoryId: "3",
    category: mockCategories[2],
    tags: ["copywriting", "marketing", "ads", "email", "social-media"],
    isPublic: true,
    isFeatured: true,
    version: "2.1.0",
    license: "MIT",
    price: 0,
    downloadCount: 1247,
    viewCount: 3891,
    likeCount: 156,
    averageRating: 4.7,
    ratingCount: 89,
    thumbnailUrl: "/copywriting-toolkit-thumbnail.jpg",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    prompts: mockPrompts.filter((p) => p.packId === "1"),
  },
  {
    id: "2",
    title: "Code Documentation Master",
    description:
      "Professional prompts for generating clean, comprehensive technical documentation, API docs, and code comments. Essential for developers.",
    authorId: "3",
    author: mockUsers[2],
    categoryId: "2",
    category: mockCategories[1],
    tags: ["documentation", "api", "code", "technical-writing"],
    isPublic: true,
    isFeatured: true,
    version: "1.5.2",
    license: "MIT",
    price: 0,
    downloadCount: 892,
    viewCount: 2156,
    likeCount: 98,
    averageRating: 4.5,
    ratingCount: 67,
    thumbnailUrl: "/code-documentation-thumbnail.jpg",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "3",
    title: "Creative Writing Prompts",
    description:
      "Spark your imagination with 30+ creative writing prompts for stories, characters, world-building, and plot development.",
    authorId: "1",
    author: mockUsers[0],
    categoryId: "1",
    category: mockCategories[0],
    tags: ["creative-writing", "storytelling", "fiction", "characters"],
    isPublic: true,
    isFeatured: false,
    version: "1.0.0",
    license: "MIT",
    price: 0,
    downloadCount: 456,
    viewCount: 1234,
    likeCount: 67,
    averageRating: 4.3,
    ratingCount: 34,
    thumbnailUrl: "/creative-writing-prompts-thumbnail.jpg",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "4",
    title: "Data Analysis Assistant",
    description:
      "Powerful prompts for data interpretation, statistical analysis, and creating insightful reports from complex datasets.",
    authorId: "1",
    author: mockUsers[0],
    categoryId: "4",
    category: mockCategories[3],
    tags: ["data-analysis", "statistics", "reports", "insights"],
    isPublic: true,
    isFeatured: false,
    version: "1.2.1",
    license: "MIT",
    price: 0,
    downloadCount: 234,
    viewCount: 789,
    likeCount: 23,
    averageRating: 4.1,
    ratingCount: 18,
    thumbnailUrl: "/data-analysis-assistant-thumbnail.jpg",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
]

export const mockRatings: Rating[] = [
  {
    id: "1",
    packId: "1",
    userId: "1",
    user: mockUsers[0],
    rating: 5,
    review:
      "Absolutely fantastic collection! These prompts have transformed my copywriting workflow. The email subject line generator alone has improved my open rates by 40%.",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    packId: "1",
    userId: "3",
    user: mockUsers[2],
    rating: 4,
    review: "Great prompts with clear instructions. Would love to see more technical copywriting examples.",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "3",
    packId: "2",
    userId: "1",
    user: mockUsers[0],
    rating: 5,
    review: "Perfect for developers who struggle with documentation. Clean, professional output every time.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]
