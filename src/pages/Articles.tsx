import { Link } from 'react-router-dom';
import { FileText, Calendar, Clock } from 'lucide-react';

const articles = [
  {
    id: 1,
    slug: 'marketing-roi-dashboard-guide',
    title: 'How to Build a Marketing ROI Dashboard That Actually Drives Decisions',
    excerpt: 'Learn the essential metrics, design principles, and technical architecture for creating actionable marketing analytics dashboards that help agencies and businesses track real ROI.',
    date: 'February 4, 2026',
    readTime: '8 min read',
    category: 'Analytics & Dashboard Design'
  },
  {
    id: 2,
    slug: 'employee-leave-management-automation',
    title: 'Automating Employee Leave Management: A Practical Guide to No-Code Workflows',
    excerpt: 'Discover how to design and implement cost-effective leave management systems using Google Workspace, Zapier, and API integrations—without expensive HR software.',
    date: 'February 4, 2026',
    readTime: '10 min read',
    category: 'Process Automation'
  },
  {
    id: 3,
    slug: 'building-custom-crm-supabase',
    title: 'Building Custom CRM Solutions with Supabase and Next.js: A Developer\'s Blueprint',
    excerpt: 'A comprehensive guide to architecting and deploying custom CRM systems that scale—from database design to real-time updates and API integrations.',
    date: 'February 4, 2026',
    readTime: '12 min read',
    category: 'Full-Stack Development'
  },
  {
    id: 4,
    slug: 'upwork-automation-analysis',
    title: 'What SMBs and Startups Actually Want from Automation: A Data-Driven Upwork Analysis',
    excerpt: 'We analyzed 920 automation jobs on Upwork to uncover recurring pain points, validated opportunities, and emerging trends in the micro-SaaS and automation space.',
    date: 'February 4, 2026',
    readTime: '14 min read',
    category: 'Market Research & Data Analysis'
  }
];

export const Articles = () => {
  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-main)] mb-3">SaaS Development Articles</h1>
          <p className="text-[var(--text-muted)] text-lg">
            Technical guides and insights on building modern SaaS applications, automation workflows, and data-driven dashboards.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              className="block bg-white border border-[var(--line-color)] rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-[var(--primary)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-[var(--primary)] mb-2 uppercase tracking-wider">
                    {article.category}
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 hover:text-[var(--primary)] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-[var(--text-muted)] mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
