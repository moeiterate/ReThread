import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CustomCRMSupabase = () => {
  return (
    <div className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/articles" 
          className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <header className="mb-8 pb-8 border-b border-gray-200">
            <div className="text-xs font-semibold text-[var(--primary)] mb-3 uppercase tracking-wider">
              Full-Stack Development
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-main)] mb-4 leading-tight">
              Building Custom CRM Solutions with Supabase and Next.js: A Developer's Blueprint
            </h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>February 4, 2026</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8">
              Off-the-shelf CRM platforms work for general sales teams, but specialized industries—influencer marketing, freelance networks, niche B2B services—need custom data models and workflows. Building a bespoke CRM with Supabase and Next.js gives you complete control, scales effortlessly, and costs a fraction of Salesforce or HubSpot Enterprise.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Why Custom CRMs Make Sense for Niche Use Cases
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Traditional CRM platforms are built for generic B2B sales cycles: lead capture, pipeline management, deal closure. But what if your "contacts" aren't companies—they're influencers with engagement rates, audience demographics, and content performance metrics? Or real estate agents with property portfolios? Or contractors with project timelines?
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Generic CRMs force you to shoehorn specialized data into custom fields and workaround workflows. A custom-built solution lets you design exactly what you need:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Custom data models:</strong> Track metrics that matter to your industry</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Tailored workflows:</strong> Automation that matches your actual process, not vendor assumptions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Direct API control:</strong> Pull data from third-party services without middleware</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Cost efficiency:</strong> Pay only for infrastructure usage, not per-seat licensing</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              The Tech Stack: Why Supabase + Next.js?
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              This combination strikes the right balance between developer velocity and production-grade scalability.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Supabase: Postgres on Steroids
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Supabase provides everything you need for backend infrastructure:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>PostgreSQL database:</strong> Relational structure with JSON support for flexible schemas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Built-in authentication:</strong> Email, OAuth, magic links out of the box</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Real-time subscriptions:</strong> WebSocket-based updates when data changes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Row-level security:</strong> Fine-grained permissions at the database layer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Auto-generated REST APIs:</strong> Instant CRUD endpoints based on your schema</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Storage:</strong> For files, documents, or media (profile pictures, contracts, etc.)</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Next.js 15: Modern React Framework
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Next.js handles the frontend and middleware layers:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Server-side rendering (SSR):</strong> Fast initial page loads and SEO-friendly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>API routes:</strong> Backend logic without a separate server</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>File-based routing:</strong> Intuitive page structure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>React Server Components:</strong> Efficient data fetching and rendering</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Database Schema Design: The Foundation
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Let's design a CRM for influencer marketing as a concrete example. The principles apply to any custom CRM.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Core Tables
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>1. creators</strong> (the "contacts" table)
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'tiktok', 'youtube'
  full_name VARCHAR(255),
  email VARCHAR(255),
  followers_count INTEGER,
  engagement_rate DECIMAL(5,2), -- e.g., 3.45%
  niche VARCHAR(100), -- 'fashion', 'tech', 'fitness'
  location VARCHAR(255),
  rates JSONB, -- { "post": 500, "story": 200, "reel": 800 }
  demographics JSONB, -- { "age_18_24": 35, "age_25_34": 50, ... }
  notes TEXT,
  outreach_status VARCHAR(50) DEFAULT 'prospect', -- 'prospect', 'contacted', 'negotiating', 'roster', 'inactive'
  tags TEXT[], -- array of tags for filtering
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>2. posts</strong> (content performance tracking)
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  post_type VARCHAR(50), -- 'post', 'story', 'reel', 'video'
  views INTEGER,
  likes INTEGER,
  comments INTEGER,
  shares INTEGER,
  engagement_rate DECIMAL(5,2), -- calculated from metrics
  cost_per_engagement DECIMAL(10,2), -- if paid post
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>3. campaigns</strong> (organizing collaborations)
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'completed', 'cancelled'
  kpis JSONB, -- target metrics
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>4. campaign_creators</strong> (many-to-many relationship)
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`CREATE TABLE campaign_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  agreed_rate DECIMAL(10,2),
  deliverables JSONB, -- { "posts": 2, "stories": 5 }
  status VARCHAR(50) DEFAULT 'invited', -- 'invited', 'accepted', 'completed', 'paid'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);`}
            </pre>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Indexes for Performance
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Add indexes on frequently queried columns:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`CREATE INDEX idx_creators_username ON creators(username);
CREATE INDEX idx_creators_outreach_status ON creators(outreach_status);
CREATE INDEX idx_creators_tags ON creators USING GIN(tags);
CREATE INDEX idx_posts_creator_id ON posts(creator_id);
CREATE INDEX idx_campaign_creators_campaign_id ON campaign_creators(campaign_id);`}
            </pre>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              API Integration: Auto-Updating Data
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              One of the biggest advantages of custom CRMs is direct API integration. Automatically fetch follower counts, post metrics, and audience demographics.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Data Sources
            </h3>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Official Platform APIs:</strong> Instagram Graph API, YouTube Data API, TikTok for Business API (requires approval)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Third-Party Services:</strong> Phyllo (influencer data aggregation), HypeAuditor, Social Blade</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Scraping (use cautiously):</strong> For public data when APIs aren't available</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Automation with Next.js API Routes
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Create scheduled jobs to refresh creator data:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`// app/api/cron/update-creators/route.ts
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // server-side key
  );

  // Fetch creators that need updating (e.g., not updated in 24 hours)
  const { data: creators } = await supabase
    .from('creators')
    .select('id, username, platform')
    .lt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  // Update each creator
  for (const creator of creators || []) {
    const freshData = await fetchCreatorData(creator.platform, creator.username);
    
    await supabase
      .from('creators')
      .update({
        followers_count: freshData.followers,
        engagement_rate: freshData.engagementRate,
        demographics: freshData.demographics,
        updated_at: new Date().toISOString()
      })
      .eq('id', creator.id);
  }

  return Response.json({ updated: creators?.length || 0 });
}`}
            </pre>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Building the Dashboard UI
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Design your CRM interface with these core views:
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              1. Creator List/Table View
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              The main hub for browsing your database:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Sortable columns:</strong> Username, followers, engagement rate, outreach status</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Filters:</strong> By platform, niche, status, follower count ranges</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Search:</strong> Full-text search by name, username, or tags</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Bulk actions:</strong> Tag multiple creators, change status, export to CSV</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              2. Creator Detail Page
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Deep dive into individual profiles:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Profile overview:</strong> Avatar, bio, contact info, social links</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Metrics dashboard:</strong> Followers over time, engagement trends, audience demographics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Post history:</strong> Past collaborations with performance metrics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Activity log:</strong> Timeline of outreach attempts, responses, negotiations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Notes section:</strong> Internal team notes about the creator</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              3. Analytics Dashboard
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              High-level insights across your roster:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Pipeline overview:</strong> Prospects → Contacted → Roster conversion funnel</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Performance metrics:</strong> Average engagement rate, top-performing creators</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Campaign ROI:</strong> Cost vs. engagement across campaigns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Growth trends:</strong> How your database and engagement evolve over time</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Real-Time Updates with Supabase Subscriptions
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Enable collaborative features where multiple team members see live updates:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`// In your React component
useEffect(() => {
  const subscription = supabase
    .channel('creators-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'creators'
      },
      (payload) => {
        // Update local state when data changes
        console.log('Change received!', payload);
        refetchCreators();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);`}
            </pre>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Security: Row-Level Security Policies
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Protect sensitive data with Postgres RLS policies. For example, restrict access based on user roles:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
{`-- Enable RLS
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Allow all reads for authenticated users
CREATE POLICY "Authenticated users can view creators"
  ON creators FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can manage creators"
  ON creators FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );`}
            </pre>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Deployment & Scaling
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Deploy your CRM to production with confidence:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Hosting:</strong> Vercel for Next.js (automatic deployments from GitHub)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Database:</strong> Supabase (managed Postgres, automatic backups)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Cron jobs:</strong> Vercel Cron or GitHub Actions for scheduled data updates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Monitoring:</strong> Sentry for error tracking, Vercel Analytics for performance</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Performance Optimization
            </h3>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Caching:</strong> Use Next.js ISR (Incremental Static Regeneration) for creator pages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Pagination:</strong> Load 50-100 records at a time, not entire tables</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Database queries:</strong> Use Supabase's query builder efficiently (select only needed columns)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Image optimization:</strong> Next.js Image component for profile pictures</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Cost Breakdown
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              For a CRM managing 1,000+ contacts with 5 team members:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Supabase Pro:</strong> $25/month (includes 8GB database, 250GB bandwidth)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Vercel Pro:</strong> $20/month (custom domain, analytics, priority support)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Third-Party APIs:</strong> $50-200/month (Phyllo or similar for data enrichment)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Total: ~$100-250/month</strong></span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Compare this to Salesforce ($75/user/month = $375 for 5 users) or HubSpot Professional ($800/month for 5 users). You save 70-90% while maintaining complete control.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              When to Build vs. Buy
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Building a custom CRM makes sense when:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Your data model is specialized and doesn't fit generic CRMs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>You need direct API integrations with niche services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Per-seat licensing costs would be prohibitive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>You have development resources (or budget to hire)</span>
              </li>
            </ul>

            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Stick with off-the-shelf CRMs when:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Your needs fit standard B2B sales workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>You need enterprise features like advanced reporting, third-party marketplace integrations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Compliance requirements mandate certified platforms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>You don't have technical resources to maintain custom code</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Implementation Roadmap
            </h2>
            <ol className="space-y-3 mb-6 text-[var(--text-muted)] list-decimal list-inside">
              <li className="leading-relaxed">
                <strong>Design the database schema</strong> (2-3 days) - Map out tables, relationships, and fields
              </li>
              <li className="leading-relaxed">
                <strong>Set up Supabase project</strong> (1 day) - Create database, configure auth, set RLS policies
              </li>
              <li className="leading-relaxed">
                <strong>Build Next.js foundation</strong> (2-3 days) - Set up project structure, routing, auth flow
              </li>
              <li className="leading-relaxed">
                <strong>Create core CRUD operations</strong> (3-4 days) - List view, detail pages, create/edit forms
              </li>
              <li className="leading-relaxed">
                <strong>Implement search & filters</strong> (2-3 days) - Full-text search, multi-select filters
              </li>
              <li className="leading-relaxed">
                <strong>Build analytics dashboard</strong> (3-4 days) - Charts, metrics, summary views
              </li>
              <li className="leading-relaxed">
                <strong>Integrate external APIs</strong> (4-5 days) - Connect data sources, build sync jobs
              </li>
              <li className="leading-relaxed">
                <strong>Polish UI/UX</strong> (2-3 days) - Responsive design, loading states, error handling
              </li>
              <li className="leading-relaxed">
                <strong>Testing & deployment</strong> (2-3 days) - QA, performance optimization, production launch
              </li>
            </ol>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>Total timeline: 3-4 weeks</strong> for an MVP with core features.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Conclusion
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Custom CRM development with Supabase and Next.js offers unmatched flexibility for specialized use cases. You control the data model, own the infrastructure, and pay a fraction of enterprise CRM costs. The upfront development investment pays off quickly—typically within 6 months for teams of 5+.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Start with core functionality: contacts, search, and notes. Add API integrations, analytics, and automation as you validate the system with real users. Build iteratively, not all at once. Your CRM should grow with your business, not constrain it.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
