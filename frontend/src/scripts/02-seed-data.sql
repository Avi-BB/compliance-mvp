-- Insert sample categories
INSERT INTO categories (name, description, color, icon) VALUES
('Writing & Content', 'Prompts for creative writing, copywriting, and content creation', '#3B82F6', 'PenTool'),
('Code & Development', 'Programming, debugging, and software development prompts', '#10B981', 'Code'),
('Business & Marketing', 'Business strategy, marketing, and sales prompts', '#F59E0B', 'Briefcase'),
('Education & Learning', 'Educational content, tutoring, and learning prompts', '#8B5CF6', 'GraduationCap'),
('Creative & Design', 'Design thinking, creative ideation, and artistic prompts', '#EF4444', 'Palette'),
('Data & Analysis', 'Data analysis, research, and analytical prompts', '#06B6D4', 'BarChart'),
('Personal & Productivity', 'Personal development, productivity, and life coaching', '#84CC16', 'User'),
('Technical & Support', 'Technical documentation, troubleshooting, and support', '#6B7280', 'Settings')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (email, username, full_name, bio, is_verified) VALUES
('john.doe@example.com', 'johndoe', 'John Doe', 'AI enthusiast and prompt engineer with 5+ years of experience in content creation.', true),
('sarah.smith@example.com', 'sarahsmith', 'Sarah Smith', 'Marketing professional specializing in AI-powered copywriting and brand strategy.', true),
('mike.chen@example.com', 'mikechen', 'Mike Chen', 'Full-stack developer and AI researcher, creating prompts for technical documentation.', false),
('emma.wilson@example.com', 'emmawilson', 'Emma Wilson', 'Creative writer and educator, passionate about using AI for learning and creativity.', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample prompt packs
INSERT INTO prompt_packs (title, description, author_id, category_id, tags, is_featured, version, download_count, view_count, like_count, average_rating, rating_count) VALUES
(
  'Ultimate Copywriting Toolkit',
  'A comprehensive collection of 25+ proven copywriting prompts for ads, emails, landing pages, and social media content. Perfect for marketers and business owners.',
  (SELECT id FROM users WHERE username = 'sarahsmith' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Business & Marketing' LIMIT 1),
  ARRAY['copywriting', 'marketing', 'ads', 'email', 'social-media'],
  true,
  '2.1.0',
  1247,
  3891,
  156,
  4.7,
  89
),
(
  'Code Documentation Master',
  'Professional prompts for generating clean, comprehensive technical documentation, API docs, and code comments. Essential for developers.',
  (SELECT id FROM users WHERE username = 'mikechen' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Code & Development' LIMIT 1),
  ARRAY['documentation', 'api', 'code', 'technical-writing'],
  true,
  '1.5.2',
  892,
  2156,
  98,
  4.5,
  67
),
(
  'Creative Writing Prompts',
  'Spark your imagination with 30+ creative writing prompts for stories, characters, world-building, and plot development.',
  (SELECT id FROM users WHERE username = 'emmawilson' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Writing & Content' LIMIT 1),
  ARRAY['creative-writing', 'storytelling', 'fiction', 'characters'],
  false,
  '1.0.0',
  456,
  1234,
  67,
  4.3,
  34
),
(
  'Data Analysis Assistant',
  'Powerful prompts for data interpretation, statistical analysis, and creating insightful reports from complex datasets.',
  (SELECT id FROM users WHERE username = 'johndoe' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Data & Analysis' LIMIT 1),
  ARRAY['data-analysis', 'statistics', 'reports', 'insights'],
  false,
  '1.2.1',
  234,
  789,
  23,
  4.1,
  18
);

-- Insert sample prompts for the first pack
INSERT INTO prompts (pack_id, title, content, description, category, variables, example_input, order_index) VALUES
(
  (SELECT id FROM prompt_packs WHERE title = 'Ultimate Copywriting Toolkit' LIMIT 1),
  'High-Converting Ad Headlines',
  'Create 5 compelling headlines for a {{product_type}} targeting {{target_audience}}. Each headline should:
- Address a specific pain point
- Include a clear benefit
- Create urgency or curiosity
- Be under 60 characters for optimal display

Product: {{product_name}}
Key benefits: {{key_benefits}}
Tone: {{tone}}',
  'Generate attention-grabbing headlines that drive clicks and conversions',
  'Advertising',
  '{"product_type": "text", "target_audience": "text", "product_name": "text", "key_benefits": "text", "tone": "select:professional,casual,urgent,friendly"}',
  'Product: Productivity App, Target: Busy professionals, Benefits: Save 2 hours daily',
  1
),
(
  (SELECT id FROM prompt_packs WHERE title = 'Ultimate Copywriting Toolkit' LIMIT 1),
  'Email Subject Line Generator',
  'Generate 10 email subject lines for {{email_type}} about {{topic}}. Mix these approaches:
- 3 curiosity-driven subjects
- 3 benefit-focused subjects  
- 2 urgency-based subjects
- 2 personalized subjects

Target audience: {{audience}}
Goal: {{goal}}
Tone: {{tone}}',
  'Create compelling email subject lines that improve open rates',
  'Email Marketing',
  '{"email_type": "select:newsletter,promotional,welcome,follow-up", "topic": "text", "audience": "text", "goal": "text", "tone": "select:professional,casual,urgent,friendly"}',
  'Email Type: Newsletter, Topic: New AI Features, Audience: SaaS users',
  2
);
