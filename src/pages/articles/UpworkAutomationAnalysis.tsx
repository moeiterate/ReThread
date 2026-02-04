import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const UpworkAutomationAnalysis = () => {
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
              Market Research & Data Analysis
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-main)] mb-4 leading-tight">
              What SMBs and Startups Actually Want from Automation: A Data-Driven Upwork Analysis
            </h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>February 4, 2026</span>
              <span>•</span>
              <span>14 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8">
              We analyzed 920 automation jobs posted on Upwork to understand what small and medium businesses are actually willing to pay to solve. The findings reveal recurring pain points, emerging trends, and validated opportunities in the automation and micro-SaaS space.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Why Upwork Data Matters for Product Validation
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Most market research relies on surveys, interviews, or indirect signals. Upwork job postings are different—they represent real businesses with budgets, actively searching for solutions to specific problems. When someone posts a job asking for help automating quote generation or building a custom dashboard, they're revealing unmet needs in the market.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Our analysis covers:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>780 jobs</strong> from the general automation feed (February 2, 2026)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>140 jobs</strong> from targeted "api automation" searches (February 3, 2026)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Pattern matching across job descriptions to identify recurring problems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Tool and platform mentions to understand the existing ecosystem</span>
              </li>
            </ul>

            <div className="my-8 rounded-lg border border-gray-200 overflow-hidden">
              <img 
                src="/upwork-research-dashboard-kpis.png" 
                alt="Upwork Research Dashboard showing key metrics: 780 unique jobs analyzed, 503 automation tool mentions, 610 system integrations"
                className="w-full"
              />
              <p className="text-sm text-[var(--text-muted)] px-4 py-3 bg-gray-50 italic">
                Dashboard overview: 920 total jobs analyzed across two independent datasets
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Methodology: How We Collected and Analyzed the Data
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              We captured network traffic (HAR files) from Upwork's job feeds using browser DevTools, then parsed the JSON responses to extract job metadata. The analysis involved:
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Data Collection
            </h3>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Feed dataset:</strong> 780 jobs from the general "find-jobs" feed (broad automation queries)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Search dataset:</strong> 140 jobs from targeted "api automation" searches (more specific intent)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Both datasets captured in early February 2026</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Pattern Analysis
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              We used regex pattern matching on job titles and descriptions to identify recurring themes. Each job could match multiple patterns (e.g., a job asking for "CRM → PDF quote generation" would match both "Document/PDF" and "CRM" patterns). Key focus areas:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Problem patterns:</strong> What pain points are mentioned (manual work, reporting, lead follow-up)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Tool mentions:</strong> Which automation platforms appear (Zapier, n8n, Make.com)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>System integrations:</strong> Which software needs connecting (CRMs, spreadsheets, accounting tools)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Industry signals:</strong> Vertical-specific language (construction, real estate, agencies)</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Key Finding: The Most In-Demand Automation Patterns
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Six problem patterns dominated the dataset, appearing in over 10% of jobs each. These represent the core automation needs businesses are actively hiring for.
            </p>

            <div className="my-8 rounded-lg border border-gray-200 overflow-hidden">
              <img 
                src="/upwork-research-problem-patterns.png" 
                alt="Problem patterns analysis showing AI/GPT at 31.5%, Reports/Dashboards at 16.9%, and Document/PDF generation as validated opportunity"
                className="w-full"
              />
              <p className="text-sm text-[var(--text-muted)] px-4 py-3 bg-gray-50 italic">
                Problem pattern frequency and validated opportunities from 920 jobs
              </p>
            </div>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              1. AI Integration (246 jobs, 31.5%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Nearly one-third of automation jobs mention AI, GPT, chatbots, or AI agents. Businesses want to add conversational interfaces, automate responses, or leverage LLMs for data processing. However, "add AI" is a capability, not a specific product—these jobs vary widely in scope.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>What they're building:</strong> Customer support chatbots, lead qualification bots, document summarization tools, GPT-powered content generation, AI research assistants.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              2. Reporting and Dashboards (132 jobs, 16.9%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Businesses struggle to consolidate data from multiple sources into actionable views. They hire freelancers to build custom dashboards pulling from CRMs, ad platforms, analytics tools, and databases.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>Common requests:</strong> Client reporting dashboards, KPI automation, donor/grant reporting for nonprofits, marketing ROI dashboards, operational metrics for field services.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              3. Lead Management and Follow-Up (105 jobs, 13.5%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Sales automation dominates this category. Businesses want automated lead nurturing sequences, CRM data entry from calls or forms, and attribution tracking to understand which marketing channels drive conversions.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>Pain points:</strong> Manual follow-up, leads falling through cracks, no visibility into pipeline health, disconnected tools (website form → spreadsheet → CRM).
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              4. Document and PDF Generation (102 jobs, 13.1%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              This is where our analysis gets interesting. Document generation appeared at <strong>13.1% in the general feed and 37.1% in the targeted search query</strong>—making it the #1 pattern in the API automation dataset. Businesses need automated quote generation, proposal templates, contract creation, and branded PDF reports.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>Why this matters:</strong> Tools like PandaDoc exist but are expensive and overkill for simple use cases. Businesses hire freelancers to build custom Zapier → PDF workflows because existing solutions don't fit their budget or workflow.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              5. CRM Data Management (101 jobs, 12.9%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Keeping CRM data clean, updated, and connected to other systems is a persistent challenge. Jobs request automated data entry, duplicate detection, contact enrichment, and syncing CRM with external tools.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              6. Manual Work and Copy-Paste Pain (83 jobs, 10.6%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Direct pain language appears in 10%+ of jobs—descriptions explicitly mention "tedious," "manual," "copy-paste," or "repetitive" work. This validates that businesses recognize automation opportunities even if they can't articulate the technical solution.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              The Automation Tool Landscape
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Zapier dominates with 165 mentions (21% of jobs), but open-source and self-hosted alternatives are gaining traction.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Top Automation Platforms
            </h3>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Zapier:</strong> 165 jobs (21.2%) — Market leader, easiest for non-technical users</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>n8n:</strong> 109 jobs (14.0%) — Open-source, developer-friendly, self-hosted</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Power Automate:</strong> 76 jobs (9.7%) — Microsoft ecosystem, enterprise adoption</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Make.com (formerly Integromat):</strong> 76 jobs (9.7%) — Visual workflow builder</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Power Apps:</strong> 39 jobs (5.0%) — No-code app development</span>
              </li>
            </ul>

            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>Insight:</strong> The high mention rate for n8n (14%) shows businesses are willing to use open-source tools to avoid per-task pricing. This suggests cost sensitivity and openness to technical solutions.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Most Integrated Systems (Write-To)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              These are the destinations where businesses want data to land:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Airtable:</strong> 75 jobs — Flexible database for operations, project management</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Slack:</strong> 41 jobs — Team notifications and alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>HubSpot:</strong> 38 jobs — CRM and marketing automation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Power BI:</strong> 34 jobs — Business intelligence and reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Salesforce:</strong> 28 jobs — Enterprise CRM</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>QuickBooks:</strong> 21 jobs — Accounting and invoicing</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Validated Micro-SaaS Opportunity: Document Generation
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The strongest signal from our analysis is <strong>Form → Branded PDF Quote/Proposal Generation</strong>. This pattern appeared consistently across both datasets:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Feed data:</strong> 102 jobs (13.1%)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Search data:</strong> 52 jobs (37.1%) — #1 pattern in API automation queries</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              What Businesses Are Asking For
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              After analyzing 52 document-related jobs in detail, we identified three main categories:
            </p>
            <ul className="space-y-3 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Proposal/Quote Generation (44%):</strong> "CRM data → branded quote PDF," "form submission → insurance quote," "pricing calculator → proposal document"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Contract Management (33%):</strong> Template-based contract generation, e-signature workflows, document versioning</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Report PDFs (23%):</strong> Automated client reports, performance summaries, invoices with line items</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              The Gap in the Market
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              PandaDoc, DocuSign, and Proposify exist but face adoption barriers:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Cost:</strong> $49-99/user/month is expensive for small businesses sending 20-50 quotes monthly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Complexity:</strong> Enterprise features create friction for simple use cases</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Integration friction:</strong> Requires manual setup, no pre-built workflows for vertical-specific tools</span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Businesses hire freelancers to build custom Zapier/n8n workflows instead of buying software. This signals willingness to pay for solutions, but existing products don't fit the need.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Potential Product Angle
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              A focused micro-SaaS targeting specific verticals could capture this market:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Insurance agencies:</strong> Form data → branded policy quotes with pricing tables</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Construction/contractors:</strong> Project estimates with line-item breakdowns, scope of work templates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>B2B services:</strong> Proposal automation from CRM data (Pipedrive → PDF, HubSpot → branded proposal)</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Other Validated Patterns Worth Exploring
            </h2>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Lead Nurturing and CRM Automation
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>148 jobs</strong> across datasets mention lead follow-up, pipeline management, or CRM updates. Many existing tools serve this space (ActiveCampaign, HubSpot sequences), but vertical-specific solutions could differentiate:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Real estate agent follow-up sequences (tailored to buyer/seller journeys)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Call → CRM data entry for field service businesses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Attribution tracking for agencies managing multiple client campaigns</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Reporting and Dashboard Automation
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>175 jobs</strong> request custom dashboards or automated reporting. Common themes:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Client-facing dashboards for agencies (marketing ROI, ad performance)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Operational dashboards for construction/field service (job costs, project status)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Donor/grant reporting for nonprofits</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Invoice and Billing Automation
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>52 jobs</strong> (19.3% in the search dataset) mention invoice generation or QuickBooks/Xero integrations. Businesses want automated invoicing triggered by project milestones, recurring billing, or time tracking data.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Vertical Signals: Industry-Specific Opportunities
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Certain industries appeared frequently enough to suggest vertical SaaS opportunities:
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Construction and Field Services (29 jobs, 3.7%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Common requests: job costing automation, scheduling coordination, project status dashboards, QuickBooks integration, estimate → invoice workflows.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Real Estate (27 jobs, 3.5%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Lead management for agents, automated property listing syndication, buyer/seller CRM workflows, open house follow-up sequences.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Agency Operations (45 jobs, 5.8%)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Client reporting automation, campaign management, time tracking → invoicing, white-label dashboards agencies can resell.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Weaker Signals: Patterns That Don't Validate (Yet)
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Some commonly discussed micro-SaaS ideas appeared infrequently in our data:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Missed call/AI receptionist:</strong> Only 8 jobs (1.0%) — Not a strong pattern here</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Timesheet/time tracking:</strong> Only 8 jobs (1.0%) — Existing tools (Harvest, Toggl) likely cover this well</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Email parsing/inbox automation:</strong> 10-16 jobs (1.3-4.3%) — Lower frequency than expected</span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              These might still be viable, but this dataset doesn't strongly support them. Consider validating through other channels before building.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              How to Use This Data for Product Decisions
            </h2>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              1. Look for Pattern Overlap
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The strongest opportunities appear at the intersection of multiple patterns. For example:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Form (38 jobs) + Document/PDF (102 jobs) = Quote generator</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Lead management (105 jobs) + SMS (37 jobs) = Automated follow-up via text</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Construction (29 jobs) + Dashboard (132 jobs) = Contractor ops dashboard</strong></span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              2. Validate Across Datasets
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Patterns that appear in <em>both</em> the general feed and targeted search queries have stronger signals. Document/PDF generation appeared at 13% in feed and 37% in search—this consistency validates demand.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              3. Focus on Vertical Niches
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Generic automation tools exist. The opportunity is in building for specific industries that have unique workflows:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>"Dashboard for construction project managers"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>"Quote generator for insurance agencies"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>"Client reporting automation for marketing agencies"</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              4. Consider Build vs. Buy Economics
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              When businesses hire freelancers instead of buying software, they're signaling that existing solutions are too expensive or complex. Target the "hire a freelancer to build a Zapier workflow" market with productized solutions.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Limitations and Caveats
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              This analysis has important limitations:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Single snapshot:</strong> Data captured over 2 days in February 2026. Job mix varies by season and trends.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Selection bias:</strong> Seed queries were automation-focused, which skews toward integration work.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Pattern matching errors:</strong> Regex can miss synonyms or catch false positives.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>No conversion data:</strong> We don't know which jobs got filled, at what price, or client satisfaction.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Job counts ≠ market size:</strong> Demand exists, but pricing, competition, and willingness to adopt SaaS are unknowns.</span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Use this as directional insight, not gospel. Validate through customer interviews, MVPs, and real sales.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Conclusion: What This Means for Builders
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Our analysis of 920 Upwork automation jobs reveals clear patterns in what SMBs are willing to pay to solve. The strongest signals point to:
            </p>
            <ol className="space-y-3 mb-6 text-[var(--text-muted)] list-decimal list-inside">
              <li className="leading-relaxed">
                <strong>Document/PDF generation</strong> (especially quote/proposal automation)
              </li>
              <li className="leading-relaxed">
                <strong>Reporting and dashboards</strong> tailored to specific industries
              </li>
              <li className="leading-relaxed">
                <strong>Lead nurturing and CRM automation</strong> with vertical focus
              </li>
            </ol>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The opportunity isn't in building "another Zapier" or generic automation—it's in solving specific workflows for specific industries. Construction companies, real estate agents, insurance agencies, and marketing agencies all need automation, but their workflows differ enough that generic tools fall short.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              The fact that businesses hire freelancers to build custom workflows signals a market gap. They're willing to pay, but existing products don't fit. That's where focused micro-SaaS wins.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
