import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const MarketingROIDashboard = () => {
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
              Analytics & Dashboard Design
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-main)] mb-4 leading-tight">
              How to Build a Marketing ROI Dashboard That Actually Drives Decisions
            </h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>February 4, 2026</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8">
              Marketing agencies and in-house teams struggle with the same challenge: translating campaign data into clear, actionable insights. A well-designed ROI dashboard bridges this gap by surfacing the metrics that matter most—without overwhelming stakeholders with raw data.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Why Most Marketing Dashboards Fail
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The typical marketing dashboard suffers from metric overload. Teams track vanity metrics like impressions and clicks without connecting them to revenue outcomes. Decision-makers need to see three core questions answered at a glance:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>How much did we spend?</strong> Total marketing investment across all channels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>What revenue did it generate?</strong> Attributed revenue with proper multi-touch modeling</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Which channels performed best?</strong> ROI breakdown by source (SEO, paid ads, email, etc.)</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Essential Metrics for ROI Tracking
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Build your dashboard around these high-impact metrics that directly tie marketing activity to business outcomes:
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Top-Level KPIs
            </h3>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Total Marketing ROI:</strong> (Revenue - Spend) / Spend × 100</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Cost Per Acquisition (CPA):</strong> Total spend / conversions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Customer Lifetime Value (CLV):</strong> Average customer value over their relationship</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Payback Period:</strong> Time to recover acquisition cost</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Channel-Specific Performance
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Break down performance by marketing channel to identify where to double down and where to cut spend:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Organic Search (SEO):</strong> Track rankings, organic traffic, and conversion rates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Paid Advertising:</strong> Google Ads, Meta Ads—monitor CPC, CTR, and conversion rate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Email Marketing:</strong> Open rates, click-through rates, and attributed revenue</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Direct Outreach:</strong> Response rates and conversion from cold outreach campaigns</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Technical Architecture: Building the Dashboard
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The most effective marketing dashboards follow a three-layer architecture that separates data collection, processing, and presentation.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              1. Data Collection Layer
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Integrate data sources using APIs and webhooks:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Google Analytics:</strong> Track website conversions and user behavior</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Ad Platform APIs:</strong> Pull spend and performance data from Google Ads, Meta, LinkedIn</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>CRM Integration:</strong> Connect to Salesforce, HubSpot, or Pipedrive for revenue attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Email Marketing Platforms:</strong> Mailchimp, SendGrid, or ConvertKit for campaign performance</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              2. Processing & Attribution Layer
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              This is where the magic happens. Implement multi-touch attribution to accurately credit each channel:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>First-Touch Attribution:</strong> Credit the initial touchpoint</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Last-Touch Attribution:</strong> Credit the final conversion touchpoint</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Linear Attribution:</strong> Equal credit to all touchpoints in the customer journey</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Time-Decay Attribution:</strong> More weight to recent interactions</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              3. Presentation Layer: UI/UX Best Practices
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Design dashboards that communicate insights instantly:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Hero Metrics:</strong> Display total ROI, revenue, and spend prominently at the top</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Trend Visualization:</strong> Use line charts to show performance over time (week/month/quarter)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Channel Comparison:</strong> Bar charts or tables comparing channel performance side-by-side</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Dark Mode Support:</strong> Reduce eye strain for users monitoring dashboards frequently</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Recommended Tech Stack
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              For a production-ready marketing dashboard, consider this modern stack:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Frontend:</strong> React or Next.js with Tailwind CSS for rapid UI development</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Charting:</strong> Recharts or Chart.js for interactive data visualizations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Backend:</strong> Node.js or Python for API integrations and data processing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Database:</strong> PostgreSQL for relational data or MongoDB for flexible schema</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Caching:</strong> Redis for fast metric retrieval</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Common Pitfalls to Avoid
            </h2>
            <ul className="space-y-3 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Over-complicating the interface:</strong> Show 5-7 key metrics, not 50</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Ignoring mobile users:</strong> Ensure responsive design for executives checking on phones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Static snapshots:</strong> Build real-time or near-real-time updates (refresh every 15-30 minutes)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>No context for numbers:</strong> Always include comparison periods (vs. last month, vs. last year)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Missing export functionality:</strong> Add CSV/PDF exports for reports and presentations</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Actionable Implementation Checklist
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Follow this step-by-step roadmap to build your dashboard:
            </p>
            <ol className="space-y-3 mb-6 text-[var(--text-muted)] list-decimal list-inside">
              <li className="leading-relaxed">
                <strong>Define your core metrics</strong> based on business goals (revenue, leads, pipeline)
              </li>
              <li className="leading-relaxed">
                <strong>Audit data sources</strong> and confirm API access to ad platforms, analytics, CRM
              </li>
              <li className="leading-relaxed">
                <strong>Design wireframes</strong> focusing on hierarchy and information architecture
              </li>
              <li className="leading-relaxed">
                <strong>Build data pipelines</strong> with scheduled jobs to fetch and process data
              </li>
              <li className="leading-relaxed">
                <strong>Implement attribution logic</strong> to accurately credit marketing channels
              </li>
              <li className="leading-relaxed">
                <strong>Create the frontend</strong> with real-time or cached data rendering
              </li>
              <li className="leading-relaxed">
                <strong>Test with stakeholders</strong> and iterate based on feedback
              </li>
              <li className="leading-relaxed">
                <strong>Deploy and monitor</strong> dashboard performance and data accuracy
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Conclusion
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              A well-architected marketing ROI dashboard transforms raw data into strategic advantage. By focusing on essential metrics, implementing proper attribution, and designing for clarity, you create a tool that drives better marketing decisions and demonstrates clear business impact.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              The key is starting simple—track spend, revenue, and ROI by channel—then expanding based on actual stakeholder needs. Build for insight, not ego. Your dashboard should answer questions, not raise new ones.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
