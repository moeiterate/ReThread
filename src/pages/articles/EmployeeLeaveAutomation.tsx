import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const EmployeeLeaveAutomation = () => {
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
              Process Automation
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-main)] mb-4 leading-tight">
              Automating Employee Leave Management: A Practical Guide to No-Code Workflows
            </h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>February 4, 2026</span>
              <span>•</span>
              <span>10 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8">
              Most small to medium-sized businesses spend thousands annually on HR software they barely use. Employee leave management systems are expensive, bloated with features no one needs, and require dedicated IT resources. But there's a better way: building custom workflows with tools you already own.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              The Problem with Traditional HR Systems
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Enterprise HR platforms like BambooHR, Namely, or Workday charge per employee per month, making them prohibitively expensive for teams under 100 people. For a 35-person organization processing fewer than 500 leave requests annually, these systems are massive overkill.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              What businesses actually need is straightforward:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>A form where employees request time off</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Automated routing to the right manager for approval</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Email notifications at each stage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>A centralized log for auditing and reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Integration with existing scheduling or workforce management tools</span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              You can build all of this with Google Workspace and Zapier for a fraction of the cost.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Architecture: Building Blocks of a No-Code Leave System
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The system consists of four interconnected components that handle the entire request-to-approval lifecycle.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              1. Request Form (Google Forms)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Create a Google Form with these essential fields:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Employee Name</strong> (automatically populated via Google SSO)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Leave Type</strong> (dropdown: Vacation, Sick Leave, Personal, Bereavement, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Start Date & End Date</strong> (date pickers with validation)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Total Days</strong> (auto-calculated, excluding weekends)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Manager/Approver</strong> (dropdown or auto-populated from organization structure)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Reason/Notes</strong> (optional text field)</span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              <strong>Pro tip:</strong> Use conditional logic in Google Forms to show different fields based on leave type. For example, sick leave might require a doctor's note after 3 consecutive days.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              2. Central Database (Google Sheets)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Google Forms automatically pipes responses into a Google Sheet. Structure your sheet with these columns:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Timestamp</strong> (auto-generated)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Employee Email</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Leave Type, Start Date, End Date, Total Days</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Manager Email</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Status</strong> (Pending, Approved, Rejected, Requires More Info)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Approval Date</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Notes/Comments</strong></span>
              </li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Add data validation rules to ensure consistency. The Status column should be a dropdown with only allowed values. Use color-coding with conditional formatting: green for Approved, red for Rejected, yellow for Pending.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              3. Automation Layer (Zapier or Make)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              This is where the workflow comes alive. Set up these automated workflows (Zaps):
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>Workflow 1: New Request Notification</strong>
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Trigger:</strong> New row added to Google Sheets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Action 1:</strong> Send email to manager with request details and approve/reject links</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Action 2:</strong> Send confirmation email to employee</span>
              </li>
            </ul>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>Workflow 2: Approval/Rejection Process</strong>
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Trigger:</strong> Manager clicks approve/reject link (webhook or email reply parsing)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Action 1:</strong> Update Google Sheet status column</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Action 2:</strong> Send notification to employee with decision</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Action 3:</strong> If approved, trigger integration with scheduling system</span>
              </li>
            </ul>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>Workflow 3: Multi-Level Approval (if needed)</strong>
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Trigger:</strong> Manager approves request</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Condition:</strong> If leave exceeds X days or certain leave type</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Action:</strong> Route to secondary approver (HR, department head)</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              4. Integration with External Systems
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Connect your leave system to other business tools:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Workforce Management (e.g., SimPro):</strong> Use API webhooks to sync approved leave with scheduling software</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Calendar (Google Calendar):</strong> Automatically block out approved leave dates on team calendars</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Slack/Teams:</strong> Post notifications to team channels when key people are out</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Payroll Systems:</strong> Export monthly leave data for payroll processing</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Advanced Features to Consider
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Once your basic workflow is running, enhance it with these power-user features:
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Leave Balance Tracking
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              While the prompt mentioned accruals are out of scope, you can still add a simple balance tracker. Create a second sheet with employee names and remaining leave days. Use VLOOKUP formulas to check balance before approving requests.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Conflict Detection
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Add logic to flag when multiple team members from the same department request overlapping dates. Prevent coverage gaps with automated warnings to managers.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Audit Trail & Compliance
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Google Sheets automatically logs edit history, but for sensitive HR data, implement these safeguards:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Protect sheet ranges so only HR can edit certain columns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Enable version history and periodic backups to Google Drive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Create a separate audit log sheet that timestamps every status change</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Self-Service Dashboard
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Build a simple web interface using Google Apps Script or a low-code platform like Glide or Softr. Give employees a dashboard to:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>View their leave history and remaining balance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Check status of pending requests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>See team leave calendar to avoid conflicts</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Cost Comparison: DIY vs. Commercial Solutions
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Let's break down the economics for a 35-person team:
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>Commercial HR System:</strong>
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>$8-15 per employee/month = $3,360-$6,300 annually</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Implementation fees: $1,000-5,000</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Training time: 10-20 hours across the organization</span>
              </li>
            </ul>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              <strong>Google Workspace + Zapier Solution:</strong>
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Google Workspace: Already included (most businesses have this)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Zapier Starter Plan: $240/year (more than enough tasks for 500 requests)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Setup time: 8-12 hours for initial build + testing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Total annual cost: ~$240 (96% savings)</strong></span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Implementation Roadmap
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Build this system incrementally over 2-3 weeks:
            </p>
            <ol className="space-y-3 mb-6 text-[var(--text-muted)] list-decimal list-inside">
              <li className="leading-relaxed">
                <strong>Week 1: Core Workflow</strong> - Set up Google Form, Sheet, and basic Zapier automation for request submission and manager notification
              </li>
              <li className="leading-relaxed">
                <strong>Week 2: Approval Logic</strong> - Build approval/rejection workflows with email triggers and status updates
              </li>
              <li className="leading-relaxed">
                <strong>Week 3: Integration & Testing</strong> - Connect to external systems (calendar, scheduling software) and run user acceptance testing
              </li>
              <li className="leading-relaxed">
                <strong>Ongoing: Refinement</strong> - Add advanced features based on user feedback and pain points
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Common Mistakes to Avoid
            </h2>
            <ul className="space-y-3 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Over-engineering from the start:</strong> Launch with basic approve/reject flow, add complexity later</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Not testing edge cases:</strong> What happens if a manager is on leave? Who approves their requests?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Forgetting mobile users:</strong> Managers often approve requests from their phones—test the mobile experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>No documentation:</strong> Create a simple user guide for employees and troubleshooting doc for admins</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span><strong>Ignoring data privacy:</strong> Ensure only HR and relevant managers have access to the master sheet</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              When to Graduate to a Commercial Solution
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              This DIY approach works brilliantly for small to medium teams, but you might outgrow it when:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Your team exceeds 100 employees</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>You need complex leave accrual policies across multiple countries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>Regulatory compliance requires certified HR software</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>The system becomes too complex for non-technical staff to maintain</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Conclusion
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Building a custom leave management workflow with Google Workspace and Zapier gives you 90% of the functionality of expensive HR systems at 5% of the cost. For organizations processing hundreds—not thousands—of requests annually, this approach is faster to deploy, easier to customize, and trivial to maintain.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Start simple, iterate based on real usage, and only add complexity when you have concrete proof it's needed. Your employees will appreciate the streamlined process, your managers will appreciate the transparency, and your CFO will appreciate the cost savings.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
