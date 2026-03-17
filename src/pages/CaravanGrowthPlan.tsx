import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle2, Circle, ChevronDown, Target, TrendingUp,
  Mail, Calendar, BarChart2, Zap, Globe, Search, Share2,
  ClipboardList, Trophy, Flag, ChevronRight, UserCircle, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Data ────────────────────────────────────────────────────────────────────

type Track = 'A' | 'B' | 'C' | 'D';

interface Task {
  id: string;
  text: string;
  subTasks?: string[];
}

interface TrackSection {
  track: Track;
  tasks: Task[];
}

interface Day {
  id: string;
  dayNumber: number;
  date: string;
  dayName: string;
  title: string;
  subtitle: string;
  week: 1 | 2;
  lightDay?: boolean;
  reviewDay?: boolean;
  doneWhen?: string[];
  sections: TrackSection[];
}

interface MetricTarget {
  id: string;
  label: string;
  target: string;
  week?: 1 | 2 | 'both';
}

const TRACK_META: Record<Track, { label: string; desc: string; color: string; bg: string; light: string; icon: React.ComponentType<{ className?: string }> }> = {
  A: { label: 'Pipeline & Trials', desc: 'Get operators onto the product', color: 'text-orange-700', bg: 'bg-orange-500', light: 'bg-orange-50 border-orange-200', icon: TrendingUp },
  B: { label: 'SEO & Content', desc: 'Pages and posts that make Caravan findable', color: 'text-emerald-700', bg: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200', icon: Globe },
  C: { label: 'Intelligence & Proof', desc: 'Enrichment, review scraping, mystery shopping', color: 'text-blue-700', bg: 'bg-blue-500', light: 'bg-blue-50 border-blue-200', icon: Search },
  D: { label: 'Distribution', desc: 'Directories, Reddit, partnerships', color: 'text-violet-700', bg: 'bg-violet-500', light: 'bg-violet-50 border-violet-200', icon: Share2 },
};

const DAYS: Day[] = [
  // ── Week 1 ────────────────────────────────────────────────────────────────
  {
    id: 'day-1', dayNumber: 1, date: 'Mon, Mar 16', dayName: 'Monday', week: 1,
    title: 'Make the Trial Offer Real',
    subtitle: 'Start Outreach Immediately',
    doneWhen: [
      'Trial page live with Calendly embed',
      '20 operators emailed, 10 called',
      'Midnight Audit results processed & matched to leads',
      'All 8 directory submissions filed (approval clock starts today)',
      'You could onboard someone tomorrow if they said yes',
    ],
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd1a1', text: 'Create Calendly event: "Caravan 7-Day After-Hours Coverage Setup" (20-min slot, separate from demo booking)' },
          { id: 'd1a2', text: 'Write 3 email templates (under 120 words each)', subTasks: ['Angle 1 — Missed calls: "The 2 AM call from Sky Harbor you never got"', 'Angle 2 — Closes too early: "[Company] is unavailable 62% of every week"', 'Angle 3 — Website voicemail language: "If you get our voicemail, please leave a message"'] },
          { id: 'd1a3', text: 'Segment the existing 200+ leads: tag shuttles, limo/black car, other' },
          { id: 'd1a4', text: 'Send 20 free-trial emails to best shuttle prospects using Angle 1' },
          { id: 'd1a5', text: 'Call 10 prospects' },
          { id: 'd1a6', text: 'Log every contact in Outreach tracker with pain signal and angle used' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd1b1', text: 'Publish /free-after-hours-trial page (promise, "what you get each morning", Calendly, demo audio)' },
          { id: 'd1b2', text: 'Add free-trial CTA block to homepage (above the fold)' },
          { id: 'd1b3', text: 'Set up sitemap.xml, submit to Google Search Console' },
          { id: 'd1b4', text: 'Add Organization JSON-LD schema to homepage' },
          { id: 'd1b5', text: 'Add FAQPage JSON-LD schema to homepage' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd1c1', text: 'Process Midnight Audit results', subTasks: ['Match recordings to leads in the database', 'Transcribe voicemail greetings', 'Flag worst ones (default carrier greetings, outdated info, no callback promise)', 'Identify 2–3 operators who actually answered (competitive intel)'] },
        ],
      },
      {
        track: 'D', tasks: [
          { id: 'd1d1', text: 'Submit all 8 directories today — approval clocks vary from 24 hrs to 2+ weeks', subTasks: [
            'G2 — high-traffic SaaS directory, approval can take 1–2 weeks',
            'Capterra — covers GetApp + Software Advice automatically',
            'Crozdesk — typically approved within a few days',
            'AlternativeTo — list as alternative to My AI Front Desk, Rosie, Smith.ai',
            'NLA vendor directory (members.limo.org) — industry-specific, high signal',
            'LimousineWorldwide.Directory — niche vertical, fast turnaround',
            'SaaS Hub',
            'Uneed or Launching Next — startup discovery, submit today',
          ] },
        ],
      },
    ],
  },
  {
    id: 'day-2', dayNumber: 2, date: 'Tue, Mar 17', dayName: 'Tuesday', week: 1,
    title: 'Midnight Audit Emails',
    subtitle: '+ Vertical Pages',
    doneWhen: [
      '35 outreach emails sent today (55 cumulative)',
      '20+ Midnight Audit emails sent',
      '2 vertical pages live, 1 blog post live, all with trial CTAs',
      'At least 1–2 warm conversations or setup calls emerging',
    ],
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd2a1', text: 'Send 20 Midnight Audit emails to operators whose voicemails you recorded' },
          { id: 'd2a2', text: 'Send 5 Competitor Intel emails using the 2–3 operators who DID answer' },
          { id: 'd2a3', text: 'Send 10 standard Angle 1 emails to operators without audit data yet' },
          { id: 'd2a4', text: 'Call 15 prospects (prioritize Day 1 email opens/replies)' },
          { id: 'd2a5', text: 'Follow up Day 1 non-responders: one-line bump with sample call link' },
          { id: 'd2a6', text: 'Push any warm lead toward setup call Calendly' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd2b1', text: 'Publish /for/airport-shuttle-operators — vertical landing page (seat utilization pain, CTA → trial)' },
          { id: 'd2b2', text: 'Publish /for/limo-black-car-services — vertical landing page (answered at midnight pain, CTA → trial)' },
          { id: 'd2b3', text: 'Publish Blog Post 1: "How Many Bookings Does a Missed Call Cost Your Shuttle Company?" (ROI math, FAQPage schema, comparison table)' },
        ],
      },
      {
        track: 'D', tasks: [
          { id: 'd2d1', text: 'Confirm all 8 directory submissions went through — check for confirmation emails or pending status notices' },
          { id: 'd2d2', text: 'If any submission failed or was rejected, resubmit with corrected listing info' },
        ],
      },
    ],
  },
  {
    id: 'day-3', dayNumber: 3, date: 'Wed, Mar 18', dayName: 'Wednesday', week: 1,
    title: 'Enrichment Build',
    subtitle: '+ Outreach Continues',
    doneWhen: [
      '90 total prospects contacted',
      'Enrichment data flowing into lead database',
      'Negative review flags appearing on leads',
      'Blog Post 2 live',
      '1–2 setup calls booked',
    ],
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd3a1', text: 'Send 35 emails', subTasks: ['10 Midnight Audit emails (from last night\'s batch)', '10 using Angle 2 (GBP hours)', '10 using Angle 3 (website confession)', '5 follow-ups to warm leads from Day 1–2'] },
          { id: 'd3a2', text: 'Call 15 prospects' },
          { id: 'd3a3', text: 'Goal: book 1–2 setup calls for Day 4 or Day 5' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd3b1', text: 'Publish Blog Post 2: "How to Forward Your Business Phone to an AI Agent (Carrier-by-Carrier Guide)"' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd3c1', text: 'Build GBP hours enrichment for existing 200+ leads (pull hours, calculate % unavailable, flag operators closing before 7 PM)' },
          { id: 'd3c2', text: 'Build website confession scanner (crawl for "voicemail," "leave a message," "office hours," etc.)' },
          { id: 'd3c3', text: 'Build negative review scraper (scan Google Maps reviews, flag "no one answered," "voicemail," etc.)' },
          { id: 'd3c4', text: 'Tonight: Run Midnight Audit on fresh batch of 50 operators' },
        ],
      },
    ],
  },
  {
    id: 'day-4', dayNumber: 4, date: 'Thu, Mar 19', dayName: 'Thursday', week: 1,
    title: 'Enriched Outreach',
    subtitle: '+ Bad Review Evidence',
    doneWhen: [
      '125 total prospects contacted',
      'Multiple personalized angles in play',
      '2+ setup calls booked or 1 trial imminent',
    ],
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd4a1', text: 'Process new Midnight Audit results from last night' },
          { id: 'd4a2', text: 'Send 15 new Midnight Audit emails (fresh batch)' },
          { id: 'd4a3', text: 'Send 10 bad review evidence emails ("Saw a review where [Name] mentioned...")' },
          { id: 'd4a4', text: 'Send 5 GBP hours emails where enrichment shows a clear gap' },
          { id: 'd4a5', text: 'Send 5 website confession emails where scanner found voicemail language' },
          { id: 'd4a6', text: 'Call 15 prospects — prioritize Midnight Audit recipients and warm leads' },
          { id: 'd4a7', text: 'Push every engaged lead toward the free trial offer' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd4c1', text: 'Build bad review evidence file generator (auto-compile ready-to-send snippet per lead)' },
        ],
      },
    ],
  },
  {
    id: 'day-5', dayNumber: 5, date: 'Fri, Mar 20', dayName: 'Friday', week: 1,
    title: 'First Trial Goes Live',
    subtitle: 'Primary Objective: Get 1 Operator Live',
    doneWhen: [
      'At least 1 trial live with forwarding configured and agent answering calls tonight',
      'OR: a start date locked for Monday with a specific operator',
      '30 mystery shop records logged',
      '3 blog posts published',
      '150+ total prospects contacted',
    ],
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd5a1', text: 'Hold booked setup calls (walk through forwarding, configure agent, test with live call, confirm trial starts tonight)' },
          { id: 'd5a2', text: 'If no setup calls booked: call 5 warmest leads and offer to set up live on the phone now' },
          { id: 'd5a3', text: 'Send 15 bad review evidence emails to newly flagged leads' },
          { id: 'd5a4', text: 'Send 15 standard cold emails expanding to a new market segment' },
          { id: 'd5a5', text: 'Follow up all warm leads from the week' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd5b1', text: 'Publish Blog Post 3: "5 Signs Your Shuttle Company Is Losing Revenue to Missed Calls" (listicle, Reddit-shareable, anonymized data)' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd5c1', text: 'Mystery shop 30 operators as a customer trying to book airport pickup', subTasks: ['Call 15 during business hours (10 AM–2 PM)', 'Call 15 after business hours (6 PM–8 PM)', 'Log: answer type, rings, hold time, professionalism, booking completion'] },
        ],
      },
    ],
  },
  {
    id: 'day-6', dayNumber: 6, date: 'Sat, Mar 21', dayName: 'Saturday', week: 1,
    lightDay: true,
    title: 'Light Day',
    subtitle: '+ Fresh Audit Run',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd6a1', text: 'If trial is live: check first morning email — text operator "Your AI agent took its first call last night. Check your email."' },
          { id: 'd6a2', text: '20 min: follow up warm leads via text or short email' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd6c1', text: 'Run Midnight Audit on fresh batch of 50 untouched operators (automated overnight)' },
          { id: 'd6c2', text: 'Run negative review scraper on leads not yet scanned' },
        ],
      },
      {
        track: 'D', tasks: [
          { id: 'd6d1', text: '30 min: Reddit engagement (no original posts yet)', subTasks: ['Comment helpfully on 3–5 threads in r/smallbusiness, r/sweatystartup, or r/Entrepreneur', 'Search "answering service," "missed calls," "after hours" — reply helpfully', 'Do NOT mention Caravan yet. Build karma.'] },
        ],
      },
    ],
  },
  {
    id: 'day-7', dayNumber: 7, date: 'Sun, Mar 22', dayName: 'Sunday', week: 1,
    reviewDay: true,
    title: 'Week 1 Review',
    subtitle: 'Triage Session — 1–2 Hours',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd7a1', text: 'Review outreach by angle', subTasks: ['Which subject line got the highest open/reply rate?', 'Which pain signal performed best?', 'Which company type responded most?', 'Total: contacted → replies → setup calls → trials'] },
          { id: 'd7a2', text: 'Process Saturday night Midnight Audit results — draft personalized emails for Monday' },
          { id: 'd7a3', text: 'Decide Week 2 focus (expand if converting, diagnose if not, narrow by segment if one is warmer)' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd7c1', text: 'If mystery shop data complete: draft 1-page mini-report outline (% answered during/after hours, avg rings, voicemail vs. human vs. IVR)' },
        ],
      },
    ],
  },

  // ── Week 2 ────────────────────────────────────────────────────────────────
  {
    id: 'day-8', dayNumber: 8, date: 'Mon, Mar 23', dayName: 'Monday', week: 2,
    title: 'Expand What Worked',
    subtitle: 'Run the winning playbook harder',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd8a1', text: 'Send 20 new Midnight Audit emails from Saturday\'s batch' },
          { id: 'd8a2', text: 'Send 20 new emails using only the best-performing angle from Week 1' },
          { id: 'd8a3', text: 'Call 15 prospects — focus on segment that responded best' },
          { id: 'd8a4', text: 'Launch second trial (or book setup call) from warm leads' },
          { id: 'd8a5', text: 'Check in on live trial operators: "How\'s it going? Anything surprise you in the morning emails?"' },
          { id: 'd8a6', text: 'Offer free trial to engaged Week 1 leads who didn\'t convert ("7 days, no card, 20 min setup. Worst case, you see exactly how many calls you\'re missing.")' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd8b1', text: 'Publish the industry report: "We Called 50 Shuttle Companies. Here\'s What Happened." (aggregate data, Article schema, key findings, CTA)' },
          { id: 'd8b2', text: 'Send individual mystery shop results privately to each operator as a personalized email' },
        ],
      },
    ],
  },
  {
    id: 'day-9', dayNumber: 9, date: 'Tue, Mar 24', dayName: 'Tuesday', week: 2,
    title: 'Hotel Concierge Recon',
    subtitle: '+ Continued Push',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd9a1', text: 'Hotel concierge recon (1 hr max, PHX or best market)', subTasks: ['Call 8–10 hotels near major airport', 'Ask who they recommend for shuttles and who\'s hard to reach after hours', 'Log: concierge recommendations + "hard to reach" operators (= next outreach targets)'] },
          { id: 'd9a2', text: 'Send 30 outreach emails', subTasks: ['15 to new prospects using winning angle', '10 follow-ups to engaged-but-not-converted leads', '5 using hotel concierge intel where relevant'] },
          { id: 'd9a3', text: 'Call 15 prospects' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd9c1', text: 'Enrich next 50 best leads only (GBP hours, website confession scan, review check — targeted, not mass)' },
          { id: 'd9c2', text: 'Run Midnight Audit on newly enriched leads tonight' },
        ],
      },
    ],
  },
  {
    id: 'day-10', dayNumber: 10, date: 'Wed, Mar 25', dayName: 'Wednesday', week: 2,
    title: 'Partnerships Begin',
    subtitle: 'Now You Have Proof',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd10a1', text: 'Send new Midnight Audit emails from last night: 20 emails' },
          { id: 'd10a2', text: 'Continue standard outreach: 15 more emails, 15 calls, follow-ups' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd10b1', text: 'Publish Blog Post 4: "How to Connect Caravan to Your Limo Anywhere Workflow" (CSV import, long-tail SEO, Limo Anywhere integrations)' },
        ],
      },
      {
        track: 'D', tasks: [
          { id: 'd10d1', text: 'Consultant outreach (3 emails with industry report attached)', subTasks: ['414 Logistical Consultants (414logisticalconsultants.com)', '2 additional consultants', 'Pitch: referral arrangement / white-label option'] },
          { id: 'd10d2', text: 'Publication outreach (2 pitches with report)', subTasks: ['Chauffeur Driven', 'LCT Magazine', 'Pitch: "We mystery-shopped 50 shuttle companies — [X]% went to voicemail after hours"'] },
        ],
      },
    ],
  },
  {
    id: 'day-11', dayNumber: 11, date: 'Thu, Mar 26', dayName: 'Thursday', week: 2,
    title: 'Trial Check-Ins',
    subtitle: '+ Proof Snippets',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd11a1', text: 'Trial check-in calls (these are sales conversations)', subTasks: ['"What calls surprised you?"', '"How many would have gone to voicemail before?"', '"Any objections to keeping it running?"', 'If positive: send pricing this week', 'If very positive: ask for anonymous testimonial'] },
          { id: 'd11a2', text: 'Continue outreach: 30 emails, 15 calls' },
          { id: 'd11a3', text: 'Follow-up wave to all Week 1 touched accounts (share industry report as value-add, re-offer free trial)' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd11b1', text: 'Update trial page with one real proof snippet from a live trial ("Answered X after-hours calls in 7 days")' },
        ],
      },
      {
        track: 'C', tasks: [
          { id: 'd11c1', text: 'Build automated daily "Rides You Saved" value email (calls handled, caller details, estimated revenue, referral link at bottom)' },
        ],
      },
    ],
  },
  {
    id: 'day-12', dayNumber: 12, date: 'Fri, Mar 27', dayName: 'Friday', week: 2,
    title: 'Conversion Push',
    subtitle: '+ Reddit Debut',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd12a1', text: 'Conversion push on all active trials (operators approaching Day 7: call, present value summary, ask for commitment)' },
          { id: 'd12a2', text: 'Stalled-but-interested leads: offer 5-night pilot (lower commitment)' },
          { id: 'd12a3', text: 'Continue outreach: 30 emails, 15 calls' },
          { id: 'd12a4', text: 'Second follow-up wave to all touched accounts from both weeks' },
        ],
      },
      {
        track: 'B', tasks: [
          { id: 'd12b1', text: 'Review all pages for schema compliance' },
          { id: 'd12b2', text: 'Improve trial page conversion copy (winning pain point → headline; top objection → addressed on page)' },
        ],
      },
      {
        track: 'D', tasks: [
          { id: 'd12d1', text: 'Post first original Reddit content', subTasks: ['r/sweatystartup or r/smallbusiness: "We called 50 shuttle companies to test their after-hours phone experience. Here\'s what we found." (link to report)', 'If lands well: post build-in-public story to r/SaaS'] },
          { id: 'd12d2', text: 'Product Hunt launch — submit listing today for scheduled publish', subTasks: [
            'Reason for waiting: PHunt audience skews B2C/developer — launch when you have operator testimonials and real call data to show in the listing',
            'Write the tagline, description, and first comment using trial results as proof',
            'Line up upvote support from your network before going live',
            'Schedule launch for a Tuesday or Wednesday for maximum visibility',
          ] },
        ],
      },
    ],
  },
  {
    id: 'day-13', dayNumber: 13, date: 'Sat, Mar 28', dayName: 'Saturday', week: 2,
    lightDay: true,
    title: 'Light Day',
    subtitle: 'Compile Week 2 Results',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd13a1', text: 'If trials active: check morning emails, text operators if calls were captured' },
          { id: 'd13a2', text: 'Compile Week 2 results', subTasks: ['Total trials active', 'Total calls captured across all trials', 'Revenue estimated for trial operators', 'Best-performing outreach angle (cumulative)', 'Best-performing market and segment', 'Funnel: contacted → replied → call/demo → trial → likely-to-pay'] },
        ],
      },
      {
        track: 'D', tasks: [
          { id: 'd13d1', text: 'Reddit: respond to any engagement on Day 12 posts, comment on 2–3 more threads' },
        ],
      },
    ],
  },
  {
    id: 'day-14', dayNumber: 14, date: 'Sun, Mar 29', dayName: 'Sunday', week: 2,
    reviewDay: true,
    title: 'Decision Day',
    subtitle: 'Answer 3 Questions — 1–2 Hours',
    sections: [
      {
        track: 'A', tasks: [
          { id: 'd14a1', text: 'What converted?', subTasks: ['Which outreach angle produced setup calls? (Midnight Audit / Bad reviews / GBP / Standard cold / Competitor intel / Hotel concierge)', 'Which market had the highest response rate?', 'Which segment engaged most?'] },
          { id: 'd14a2', text: 'What do trials show?', subTasks: ['Are operators seeing value in morning emails?', 'How many calls is the AI capturing per operator per night?', 'Are any ready to convert to paid?', 'Did anyone refer another operator?'] },
          { id: 'd14a3', text: 'What gets cut?', subTasks: ['Continue only channels that produced: a demo, a trial start, a partner introduction, or a publication response', 'Cut or pause everything else'] },
        ],
      },
    ],
  },
];

const WEEK1_TARGETS: MetricTarget[] = [
  { id: 'w1-1', label: 'Prospects contacted (email + phone)', target: '150–200', week: 1 },
  { id: 'w1-2', label: 'Midnight Audit emails sent', target: '50+', week: 1 },
  { id: 'w1-3', label: 'Personalized angle emails (reviews/GBP/website)', target: '30+', week: 1 },
  { id: 'w1-4', label: 'Setup calls held', target: '3–5', week: 1 },
  { id: 'w1-5', label: 'Trials live or start-date-locked', target: '1–3', week: 1 },
  { id: 'w1-6', label: 'Blog posts published', target: '3', week: 1 },
  { id: 'w1-7', label: 'Vertical pages + trial page live', target: '3', week: 1 },
  { id: 'w1-8', label: 'Directories submitted', target: '8', week: 1 },
  { id: 'w1-9', label: 'Reddit comments', target: '5–8', week: 1 },
  { id: 'w1-10', label: 'Mystery shop records', target: '30', week: 1 },
];

const OVERALL_TARGETS: MetricTarget[] = [
  { id: 'ov-1', label: 'Total prospects contacted', target: '300–400' },
  { id: 'ov-2', label: 'Midnight Audit emails sent', target: '75+' },
  { id: 'ov-3', label: 'Personalized angle emails', target: '50+' },
  { id: 'ov-4', label: 'Setup calls held', target: '8–12' },
  { id: 'ov-5', label: 'Trials live', target: '3–5' },
  { id: 'ov-6', label: 'Trials with positive call capture data', target: '2+' },
  { id: 'ov-7', label: 'Conversion conversations (trial → paid)', target: '2+' },
  { id: 'ov-8', label: 'Blog posts + industry report published', target: '5' },
  { id: 'ov-9', label: 'Pages live (verticals + trial)', target: '3' },
  { id: 'ov-10', label: 'Directory submissions', target: '8' },
  { id: 'ov-11', label: 'Consultant/publication outreach', target: '5' },
  { id: 'ov-12', label: 'Reddit comments', target: '15–20' },
  { id: 'ov-13', label: 'Reddit original posts', target: '1–2' },
  { id: 'ov-14', label: 'Industry report published', target: '1' },
];

const TOOL_QUEUE = [
  { num: 1, name: 'Free trial page + CTA blocks', effort: '3 hrs', buildDay: 'Day 1' },
  { num: 2, name: 'Schema markup (FAQ, Organization, Article)', effort: '1–2 hrs', buildDay: 'Day 1' },
  { num: 3, name: 'GBP hours enrichment for existing 200+ leads', effort: '2–3 hrs', buildDay: 'Day 3' },
  { num: 4, name: 'Website confession scanner for existing leads', effort: '2 hrs', buildDay: 'Day 3' },
  { num: 5, name: 'Negative review scraper for existing leads', effort: '3 hrs', buildDay: 'Day 3' },
  { num: 6, name: 'Bad review evidence file generator', effort: '1–2 hrs', buildDay: 'Day 4' },
  { num: 7, name: 'Morning "Rides You Saved" value email', effort: '2–3 hrs', buildDay: 'Day 11' },
];

const START_DATE = new Date('2026-03-16T00:00:00');

// ─── Team members ─────────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  { email: 'ataleb52@gmail.com', name: 'Ahmad', initials: 'AT', color: 'bg-orange-500' },
  { email: 'moazgelhag@gmail.com', name: 'Moaz', initials: 'MG', color: 'bg-violet-500' },
] as const;

function memberByEmail(email: string | null | undefined) {
  return TEAM_MEMBERS.find(m => m.email === email) ?? null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CaravanGrowthPlan() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [owners, setOwners] = useState<Record<string, string>>({});
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [toolDone, setToolDone] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'week1' | 'week2' | 'tracks'>('week1');
  const activeWeek: 1 | 2 = activeTab === 'week2' ? 2 : 1;
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['day-1']));
  const [showTemplates, setShowTemplates] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);
  const currentUserEmail = useRef<string | null>(null);

  // ── Bootstrap: get current user + load all state from Supabase ──────────
  useEffect(() => {
    async function loadState() {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      currentUserEmail.current = user?.email ?? null;

      const { data, error } = await supabase
        .from('caravan_plan_state')
        .select('id, category, completed, owner_email, text_value');

      if (error) {
        console.error('Failed to load plan state from Supabase:', error);
        // Graceful fallback to localStorage
        try {
          const c = localStorage.getItem('caravan-plan-checked');
          const m = localStorage.getItem('caravan-plan-metrics');
          const t = localStorage.getItem('caravan-plan-tools');
          if (c) setChecked(JSON.parse(c));
          if (m) setMetrics(JSON.parse(m));
          if (t) setToolDone(JSON.parse(t));
        } catch {}
      } else if (data) {
        const newChecked: Record<string, boolean> = {};
        const newOwners: Record<string, string> = {};
        const newMetrics: Record<string, string> = {};
        const newTools: Record<number, boolean> = {};

        for (const row of data) {
          if (row.category === 'task') {
            newChecked[row.id] = row.completed;
            if (row.owner_email) newOwners[row.id] = row.owner_email;
          } else if (row.category === 'metric') {
            if (row.text_value) newMetrics[row.id] = row.text_value;
          } else if (row.category === 'tool') {
            const num = parseInt(row.id.replace('tool-', ''), 10);
            if (!isNaN(num)) newTools[num] = row.completed;
          }
        }
        setChecked(newChecked);
        setOwners(newOwners);
        setMetrics(newMetrics);
        setToolDone(newTools);
      }
      setDbLoading(false);
    }
    loadState();
  }, []);

  // ── Persist helpers (upsert to Supabase) ─────────────────────────────────
  const upsertTask = useCallback(async (
    id: string,
    completed: boolean,
    ownerEmail: string | null
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('caravan_plan_state').upsert(
      { id, category: 'task', completed, owner_email: ownerEmail, updated_by: user?.id ?? null },
      { onConflict: 'id' }
    );
  }, []);

  const upsertMetric = useCallback(async (id: string, value: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('caravan_plan_state').upsert(
      { id, category: 'metric', completed: false, text_value: value, updated_by: user?.id ?? null },
      { onConflict: 'id' }
    );
  }, []);

  const upsertTool = useCallback(async (num: number, completed: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('caravan_plan_state').upsert(
      { id: `tool-${num}`, category: 'tool', completed, updated_by: user?.id ?? null },
      { onConflict: 'id' }
    );
  }, []);

  // ── Action handlers ───────────────────────────────────────────────────────
  const toggleTask = (id: string) => {
    const next = !checked[id];
    setChecked(prev => ({ ...prev, [id]: next }));
    upsertTask(id, next, owners[id] ?? null);
  };

  const setOwner = (taskId: string, email: string | null) => {
    setOwners(prev => {
      const next = { ...prev };
      if (email) next[taskId] = email;
      else delete next[taskId];
      return next;
    });
    upsertTask(taskId, checked[taskId] ?? false, email);
  };

  const saveMetric = (id: string, value: string) => {
    setMetrics(prev => ({ ...prev, [id]: value }));
    upsertMetric(id, value);
  };

  const toggleTool = (num: number) => {
    const next = !toolDone[num];
    setToolDone(prev => ({ ...prev, [num]: next }));
    upsertTool(num, next);
  };

  const toggleDay = (id: string) => {
    const next = new Set(expandedDays);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedDays(next);
  };

  // Derived stats
  const allTasks = DAYS.flatMap(d => d.sections.flatMap(s => s.tasks));
  const subTaskCount = DAYS.flatMap(d => d.sections.flatMap(s => s.tasks.flatMap(t => (t.subTasks || []).map((_, i) => `${t.id}-sub-${i}`))));
  const totalItems = allTasks.length + subTaskCount.length;
  const doneItems = Object.values(checked).filter(Boolean).length;
  const overallPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const dayProgress = (day: Day) => {
    const tasks = day.sections.flatMap(s => s.tasks);
    const total = tasks.reduce((n, t) => n + 1 + (t.subTasks?.length ?? 0), 0);
    const done = tasks.reduce((n, t) => {
      let c = checked[t.id] ? 1 : 0;
      t.subTasks?.forEach((_, i) => { if (checked[`${t.id}-sub-${i}`]) c++; });
      return n + c;
    }, 0);
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const currentDay = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - START_DATE.getTime()) / 86400000);
    return Math.max(1, Math.min(14, diff + 1));
  };

  const today = currentDay();
  const filteredDays = DAYS.filter(d => d.week === activeWeek);
  const week1Days = DAYS.filter(d => d.week === 1);
  const week2Days = DAYS.filter(d => d.week === 2);
  const w1Done = week1Days.reduce((n, d) => n + dayProgress(d).done, 0);
  const w1Total = week1Days.reduce((n, d) => n + dayProgress(d).total, 0);
  const w2Done = week2Days.reduce((n, d) => n + dayProgress(d).done, 0);
  const w2Total = week2Days.reduce((n, d) => n + dayProgress(d).total, 0);

  if (dbLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-color)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-400">Loading plan state…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-color)' }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a202c 0%, #2d3460 50%, #1a202c 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-white/80 text-xs font-medium tracking-wide">Day {today} of 14</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                  <Calendar className="w-3 h-3 text-white/60" />
                  <span className="text-white/80 text-xs font-medium">Mar 16 – Mar 29, 2026</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
                Caravan 14-Day<br />
                <span style={{ color: '#dd6b20' }}>Execution Plan</span>
              </h1>
              <p className="text-white/60 text-sm max-w-md">
                Growth, outreach, and marketing sprint. Every task tracked. Every day accounted for.
              </p>
            </div>

            {/* Overall progress ring */}
            <div className="flex items-center gap-6">
              <ProgressRing pct={overallPct} size={96} stroke={7} color="#dd6b20" trackColor="rgba(255,255,255,0.1)">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{overallPct}%</div>
                  <div className="text-white/50 text-[10px]">overall</div>
                </div>
              </ProgressRing>
              <div className="space-y-3">
                <StatPill label="Week 1" done={w1Done} total={w1Total} color="bg-orange-400" />
                <StatPill label="Week 2" done={w2Done} total={w2Total} color="bg-violet-400" />
                <StatPill label="Tools Built" done={Object.values(toolDone).filter(Boolean).length} total={TOOL_QUEUE.length} color="bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Track Legend ────────────────────────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: 'var(--line-color)', background: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-4">
          {(Object.entries(TRACK_META) as [Track, typeof TRACK_META[Track]][]).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${meta.bg}`} />
              <span className="text-xs text-gray-500 font-medium">
                <span className="font-bold text-gray-700">Track {key}</span> — {meta.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border" style={{ borderColor: 'var(--line-color)', width: 'fit-content' }}>
          {([1, 2] as const).map(w => {
            const key = w === 1 ? 'week1' : 'week2';
            const days = w === 1 ? week1Days : week2Days;
            const done = days.reduce((n, d) => n + dayProgress(d).done, 0);
            const total = days.reduce((n, d) => n + dayProgress(d).total, 0);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isActive = activeTab === key;
            return (
              <button
                key={w}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <span>{w === 1 ? 'Week 1' : 'Week 2'}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{pct}%</span>
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'tracks' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Tracks</span>
          </button>
        </div>

        {activeTab === 'tracks' ? (
          <TracksOverview days={DAYS} checked={checked} />
        ) : (
          <>
        {/* ── Week Description ─────────────────────────────────────────────── */}
        <div className="rounded-xl border p-4 flex items-start gap-3" style={{ borderColor: 'var(--line-color)', background: 'white' }}>
          <div className="mt-0.5 p-2 rounded-lg bg-orange-50">
            {activeWeek === 1 ? <Zap className="w-4 h-4 text-orange-600" /> : <Trophy className="w-4 h-4 text-orange-600" />}
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900 mb-0.5">
              {activeWeek === 1 ? 'Week 1: Pipeline First, Everything Else Supports It' : 'Week 2: Proof, Expansion, Force Multipliers'}
            </div>
            <p className="text-xs text-gray-500">
              {activeWeek === 1
                ? 'Mar 16–22 · Build the trial offer, launch enrichment tools, run Midnight Audits, and get the first operator live.'
                : 'Mar 23–29 · Run the winning angle harder, publish the industry report, begin partnerships, push trials to conversion.'}
            </p>
          </div>
        </div>

        {/* ── Day Cards ────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filteredDays.map(day => {
            const { done, total, pct } = dayProgress(day);
            const isExpanded = expandedDays.has(day.id);
            const isToday = day.dayNumber === today;
            const isPast = day.dayNumber < today;
            const isComplete = pct === 100;

            return (
              <div
                key={day.id}
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${isToday ? 'ring-2 ring-orange-400 ring-offset-1' : ''} ${isComplete ? 'opacity-80' : ''}`}
                style={{ borderColor: isToday ? '#dd6b20' : 'var(--line-color)', background: 'white' }}
              >
                {/* Day header (always visible) */}
                <button
                  onClick={() => toggleDay(day.id)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  {/* Day number badge */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${isComplete ? 'bg-emerald-100 text-emerald-700' : isToday ? 'bg-orange-100 text-orange-700' : isPast ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : day.dayNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-medium">{day.date}</span>
                      {isToday && <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Today</span>}
                      {day.lightDay && <span className="text-[10px] font-medium bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">Light Day</span>}
                      {day.reviewDay && <span className="text-[10px] font-medium bg-violet-50 text-violet-500 px-2 py-0.5 rounded-full">Review Day</span>}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{day.title}</span>
                      <span className="text-xs text-gray-400 hidden sm:inline">— {day.subtitle}</span>
                    </div>
                    {/* Track pills */}
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {day.sections.map(s => (
                        <span key={s.track} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TRACK_META[s.track].light} ${TRACK_META[s.track].color}`}>
                          {s.track}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className={`text-sm font-bold ${isComplete ? 'text-emerald-600' : 'text-gray-700'}`}>{done}/{total}</div>
                      <div className="text-[10px] text-gray-400">tasks</div>
                    </div>
                    <MiniProgressBar pct={pct} />
                    <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t" style={{ borderColor: 'var(--line-color)' }}>
                    <div className="p-4 md:p-5 space-y-5">
                      {day.sections.map(section => {
                        const meta = TRACK_META[section.track];
                        const Icon = meta.icon;
                        return (
                          <div key={section.track} className={`rounded-lg border p-4 ${meta.light}`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-5 h-5 rounded flex items-center justify-center ${meta.bg}`}>
                                <Icon className="w-3 h-3 text-white" />
                              </div>
                              <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
                                Track {section.track} — {meta.label}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {section.tasks.map(task => (
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  checked={checked}
                                  owners={owners}
                                  onToggle={toggleTask}
                                  onSetOwner={setOwner}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Done When section */}
                      {day.doneWhen && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Flag className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold uppercase tracking-wider text-green-700">Done When</span>
                          </div>
                          <ul className="space-y-1">
                            {day.doneWhen.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-green-800">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
          </>
        )}

        {/* ── Metrics Tracker ──────────────────────────────────────────────── */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line-color)' }}>
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--line-color)', background: 'white' }}>
            <div className="p-2 rounded-lg bg-orange-50">
              <BarChart2 className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Metrics Dashboard</h2>
              <p className="text-xs text-gray-400">Track actuals against targets. Updates save automatically.</p>
            </div>
          </div>
          <div className="bg-white grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: 'var(--line-color)' }}>
            <MetricsTable title="Week 1 Targets" targets={WEEK1_TARGETS} metrics={metrics} onChange={saveMetric} />
            <MetricsTable title="14-Day Overall Targets" targets={OVERALL_TARGETS} metrics={metrics} onChange={saveMetric} />
          </div>
        </div>

        {/* ── Tool Build Queue ──────────────────────────────────────────────── */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line-color)' }}>
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--line-color)', background: 'white' }}>
            <div className="p-2 rounded-lg bg-violet-50">
              <Zap className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Tool Build Queue</h2>
              <p className="text-xs text-gray-400">Build in this order. Do not skip ahead.</p>
            </div>
          </div>
          <div className="bg-white divide-y" style={{ borderColor: 'var(--line-color)' }}>
            {TOOL_QUEUE.map((tool, i) => (
              <div key={tool.num} className={`flex items-center gap-4 px-6 py-3.5 transition-colors ${toolDone[tool.num] ? 'bg-emerald-50/50' : ''}`}>
                <button onClick={() => toggleTool(tool.num)} className="flex-shrink-0">
                  {toolDone[tool.num]
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400 transition-colors" />}
                </button>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${toolDone[tool.num] ? 'line-through text-gray-400' : 'text-gray-800'}`}>{tool.name}</span>
                </div>
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{tool.effort}</span>
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">{tool.buildDay}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Email Templates Accordion ────────────────────────────────────── */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line-color)' }}>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-gray-900 text-sm">Email Templates (9)</h2>
                <p className="text-xs text-gray-400">Ready-to-send templates for every outreach angle</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showTemplates ? 'rotate-180' : ''}`} />
          </button>
          {showTemplates && (
            <div className="border-t divide-y" style={{ borderColor: 'var(--line-color)' }}>
              <EmailTemplateList />
            </div>
          )}
        </div>

        {/* ── Operating Principles ─────────────────────────────────────────── */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line-color)' }}>
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--line-color)', background: 'white' }}>
            <div className="p-2 rounded-lg bg-gray-100">
              <ClipboardList className="w-4 h-4 text-gray-600" />
            </div>
            <h2 className="font-semibold text-gray-900 text-sm">Operating Principles</h2>
          </div>
          <div className="bg-white p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { num: 1, title: 'Product is the Sales Tool', desc: 'One operator live on Caravan > 5 blog posts. Every day moves toward a live trial.' },
              { num: 2, title: 'Volume Creates Options', desc: '30–40 outreach emails/day. At 5–8% reply rates, you need pipeline math on your side.' },
              { num: 3, title: 'Proof Before Partnerships', desc: "Don't pitch publications or brokers until you have real call data from real operators. That's Week 2." },
              { num: 4, title: 'Cap the Supporting Work', desc: '2 vertical pages. 3 blog posts Week 1. 8 directories. 1 industry report Week 2. No more.' },
              { num: 5, title: 'Midnight Audit is the Weapon', desc: "It's already built. Run it every 2–3 days on new batches. Nothing else converts like audit evidence." },
            ].map(p => (
              <div key={p.num} className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{p.num}</span>
                  <span className="font-semibold text-gray-900 text-xs">{p.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TRACK_DETAILS: Record<Track, {
  role: string;
  rule: string;
  focus: string[];
  priority: string;
  priorityColor: string;
}> = {
  A: {
    role: 'Get operators onto the product.',
    rule: 'Primary track. Starts Day 1. Every single day has outreach.',
    focus: [
      'Cold email campaigns (30–40/day across 9 outreach angles)',
      'Phone calls to warm leads and trial prospects',
      'Setup calls — walk operators through call forwarding live',
      'Trial conversion — push from free trial to paying customer',
    ],
    priority: 'Primary',
    priorityColor: 'bg-orange-100 text-orange-700',
  },
  B: {
    role: 'Make Caravan findable via search and content.',
    rule: 'Supporting. Capped: 2 vertical pages + 3 blog posts in Week 1, 1 industry report in Week 2.',
    focus: [
      '/free-after-hours-trial page (with Calendly embed)',
      '2 vertical landing pages (/for/airport-shuttles, /for/limo-black-car)',
      '4 blog posts + 1 industry report published',
      'Schema markup (FAQ, Organization, Article) on all key pages',
    ],
    priority: 'Supporting',
    priorityColor: 'bg-emerald-100 text-emerald-700',
  },
  C: {
    role: 'Build intelligence that sharpens outreach.',
    rule: 'Feeds Track A. Only build what directly improves outreach quality.',
    focus: [
      'Midnight Audit — call operators overnight, record what callers hear',
      'GBP hours enrichment — flag operators who close before 7 PM',
      'Negative review scraper — surface "no one answered" complaints',
      'Mystery shopping — call 30 operators posing as a customer',
    ],
    priority: 'Supporting',
    priorityColor: 'bg-blue-100 text-blue-700',
  },
  D: {
    role: 'Expand reach through directories, Reddit, and partners.',
    rule: 'Directories submitted Day 1 — approval takes days to weeks, so file immediately. Reddit and partnerships come after proof exists.',
    focus: [
      'All 8 directory submissions filed Day 1 (G2, Capterra, Crozdesk, AlternativeTo, NLA, LimousineWorldwide, SaaS Hub, Uneed)',
      'Reddit presence — comments first (Week 1), original posts in Week 2',
      'Product Hunt — deferred to Day 12 when operator data and testimonials are ready',
      'Consultant outreach (3 emails) + publication pitches — Week 2 only, after industry report is published',
    ],
    priority: 'Bounded',
    priorityColor: 'bg-violet-100 text-violet-700',
  },
};

function TracksOverview({ days, checked }: {
  days: Day[];
  checked: Record<string, boolean>;
}) {
  return (
    <div className="space-y-4">
      {(Object.entries(TRACK_META) as [Track, typeof TRACK_META[Track]][]).map(([key, meta]) => {
        const detail = TRACK_DETAILS[key];
        const Icon = meta.icon;

        // Stats: tasks for this track across all days
        const trackDays = days.filter(d => d.sections.some(s => s.track === key));
        const allTrackTasks = days.flatMap(d => d.sections.filter(s => s.track === key).flatMap(s => s.tasks));
        const total = allTrackTasks.reduce((n, t) => n + 1 + (t.subTasks?.length ?? 0), 0);
        const done = allTrackTasks.reduce((n, t) => {
          let c = checked[t.id] ? 1 : 0;
          t.subTasks?.forEach((_, i) => { if (checked[`${t.id}-sub-${i}`]) c++; });
          return n + c;
        }, 0);
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div key={key} className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: 'var(--line-color)' }}>
            {/* Track header */}
            <div className={`px-5 py-4 border-b flex items-start gap-4 ${meta.light}`} style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>Track {key}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${detail.priorityColor}`}>{detail.priority}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pct === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-white/70 text-gray-500'}`}>{done}/{total} tasks</span>
                </div>
                <h3 className={`font-bold text-base ${meta.color}`}>{meta.label}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{detail.role}</p>
              </div>
              {/* Mini progress */}
              <div className="flex-shrink-0 text-right hidden sm:block">
                <div className={`text-xl font-bold ${pct === 100 ? 'text-emerald-600' : meta.color}`}>{pct}%</div>
                <div className="w-20 h-1.5 bg-white/60 rounded-full overflow-hidden mt-1">
                  <div className={`h-full rounded-full ${meta.bg} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 grid sm:grid-cols-2 gap-5">
              {/* Rule */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Rule</div>
                <p className="text-xs text-gray-600 leading-relaxed">{detail.rule}</p>
              </div>

              {/* Focus areas */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">What's In Scope</div>
                <ul className="space-y-1.5">
                  {detail.focus.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <ChevronRight className={`w-3 h-3 mt-0.5 flex-shrink-0 ${meta.color}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Active days strip */}
            <div className="px-5 py-3 border-t flex items-center gap-3" style={{ borderColor: 'var(--line-color)' }}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active days</span>
              <div className="flex flex-wrap gap-1.5">
                {trackDays.map(d => (
                  <span key={d.id} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.light} ${meta.color}`}>
                    Day {d.dayNumber}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskItem({ task, checked, owners, onToggle, onSetOwner }: {
  task: Task;
  checked: Record<string, boolean>;
  owners: Record<string, string>;
  onToggle: (id: string) => void;
  onSetOwner: (taskId: string, email: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const hasSubTasks = task.subTasks && task.subTasks.length > 0;
  const assignedMember = memberByEmail(owners[task.id]);

  return (
    <div>
      <div className="flex items-start gap-2 group">
        <button onClick={() => onToggle(task.id)} className="flex-shrink-0 mt-0.5">
          {checked[task.id]
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            : <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />}
        </button>
        <span className={`text-sm flex-1 leading-relaxed ${checked[task.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {task.text}
        </span>
        {/* Owner chip */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setOwnerOpen(o => !o)}
            title={assignedMember ? `Assigned to ${assignedMember.name}` : 'Assign owner'}
            className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-all border ${
              assignedMember
                ? `${assignedMember.color} text-white border-transparent`
                : 'bg-transparent border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-400'
            }`}
          >
            {assignedMember ? assignedMember.initials : <UserCircle className="w-3.5 h-3.5" />}
          </button>
          {ownerOpen && (
            <div className="absolute right-0 top-6 z-20 bg-white border rounded-lg shadow-lg py-1 min-w-[130px]" style={{ borderColor: 'var(--line-color)' }}>
              {TEAM_MEMBERS.map(m => (
                <button
                  key={m.email}
                  onClick={() => { onSetOwner(task.id, m.email); setOwnerOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                    owners[task.id] === m.email ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[9px] font-bold text-white flex items-center justify-center flex-shrink-0 ${m.color}`}>{m.initials}</span>
                  {m.name}
                  {owners[task.id] === m.email && <span className="ml-auto text-emerald-500">&#10003;</span>}
                </button>
              ))}
              {owners[task.id] && (
                <button
                  onClick={() => { onSetOwner(task.id, null); setOwnerOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-50 transition-colors border-t mt-1 pt-1.5"
                  style={{ borderColor: 'var(--line-color)' }}
                >
                  <X className="w-3.5 h-3.5" /> Unassign
                </button>
              )}
            </div>
          )}
        </div>
        {hasSubTasks && (
          <button onClick={() => setExpanded(!expanded)} className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasSubTasks && expanded && (
        <div className="ml-6 mt-1.5 space-y-1.5 border-l-2 pl-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          {task.subTasks!.map((sub, i) => {
            const subId = `${task.id}-sub-${i}`;
            return (
              <div key={subId} className="flex items-start gap-2 group">
                <button onClick={() => onToggle(subId)} className="flex-shrink-0 mt-0.5">
                  {checked[subId]
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    : <Circle className="w-3.5 h-3.5 text-gray-200 group-hover:text-gray-300 transition-colors" />}
                </button>
                <span className={`text-xs leading-relaxed flex-1 ${checked[subId] ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {sub}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProgressRing({ pct, size, stroke, color, trackColor, children }: {
  pct: number; size: number; stroke: number; color: string; trackColor: string; children: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function MiniProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
      <div
        className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-400' : 'bg-orange-400'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StatPill({ label, done, total, color }: { label: string; done: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="text-white/50 text-xs w-12">{label}</div>
      <div className="flex-1 w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-white/60 text-xs w-8 text-right">{pct}%</span>
    </div>
  );
}

function MetricsTable({ title, targets, metrics, onChange }: {
  title: string;
  targets: MetricTarget[];
  metrics: Record<string, string>;
  onChange: (id: string, val: string) => void;
}) {
  return (
    <div className="p-5">
      <h3 className="font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-4 h-4 text-orange-500" />
        {title}
      </h3>
      <div className="space-y-2">
        {targets.map(t => {
          const actual = metrics[t.id] || '';
          const hasActual = actual.trim() !== '';
          return (
            <div key={t.id} className="flex items-center gap-3 group">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{t.label}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-gray-400 font-mono">/ {t.target}</span>
                <input
                  type="text"
                  value={actual}
                  onChange={e => onChange(t.id, e.target.value)}
                  placeholder="—"
                  className={`w-14 text-xs text-center border rounded-md py-1 px-1.5 outline-none transition-all font-mono
                    ${hasActual ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold' : 'border-gray-200 text-gray-500 focus:border-orange-300 focus:bg-orange-50/50'}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const EMAIL_TEMPLATES = [
  {
    name: 'Template 1: Standard Cold (Missed Calls)',
    subject: 'The 2 AM call from [Airport] you never got',
    body: `Hey [First Name],

Quick question — do you know how many calls [Company Name] missed last month after your office closed?

Most shuttle operators around [Airport Code] estimate 4–8 bookings per vehicle, per month. At $135 average, that's real money.

We built Caravan for this. AI voice agent, answers your existing number when you can't, takes the booking, sends it to your dispatch.

No new phone number. No app for callers. Just fewer empty seats.

Want to hear what it sounds like? 60 seconds: [link to demo audio]

— Ahmad`,
  },
  {
    name: 'Template 2: GBP Hours',
    subject: '[Company Name] is unavailable [X]% of every week',
    body: `Hey [First Name],

Your Google listing says [Company Name] is open [hours]. That's [X]% of the week you're unavailable. Flights land 24/7.

We give you 24/7 coverage for the hours you can't staff. AI agent, answers your line, takes bookings, confirms reservations. Setup takes 20 minutes.

Hear what it sounds like: [link]

— Ahmad`,
  },
  {
    name: 'Template 3: Website Confession',
    subject: '"If you get our voicemail, please leave a message"',
    body: `Hey [First Name],

Your website says: "[exact quote from their site]."

What about the passenger whose flight just landed at 1 AM and needs a ride now — not a callback?

Caravan answers that call immediately. Same number, same company name, same professionalism. 20-minute setup, 7 days free.

Quick listen: [link]

— Ahmad`,
  },
  {
    name: 'Template 4: Midnight Audit',
    subject: 'I called [Company Name] at [time] last night',
    body: `Hey [First Name],

I called [Company Name] at [time]. Here's what your customers hear:

"[voicemail transcript]"

That passenger needed a ride. They didn't leave a message — they called the next company.

Here's what they'd hear with Caravan: [link to 30-sec audio sample]

Same phone number. Same company name. 7 days free, 20 minutes to set up.

— Ahmad`,
  },
  {
    name: 'Template 5: Competitor Intel',
    subject: 'Only [X] out of [Y] answered at midnight',
    body: `Hey [First Name],

I called [Y] shuttle companies near [Airport] at midnight last [Day]. Only [Company A] and [Company B] answered. Everyone else went to voicemail.

Those companies are getting every after-hours booking in your market right now.

Caravan would have made [Company Name] next on that list. AI agent, your line, your company name. 20-minute setup.

2-minute demo: [link]

— Ahmad`,
  },
  {
    name: 'Template 6: Bad Review Evidence',
    subject: 'A review on your Google page mentions phone issues',
    body: `Hey [First Name],

Saw a review on [Company Name]'s Google listing where [Reviewer] mentioned: "[review excerpt]"

Every review like that is a booking that went to your competitor. Caravan makes sure it doesn't happen again — AI answers your line 24/7.

Hear it: [link]

— Ahmad`,
  },
  {
    name: 'Template 7: Free Trial Offer',
    subject: 'Free after-hours coverage for [Company Name] — 7 days',
    body: `Hey [First Name],

I'd like to give [Company Name] 7 days of free after-hours coverage. No card, no contract.

When your phones are off, Caravan answers. Takes the booking or answers the question. Every morning, you get an email showing what came in overnight.

By day 3, you'll see exactly how many rides you've been missing.

20 minutes to set up — just a call forwarding code on your phone. I walk you through it.

Pick a time: [Calendly link]

— Ahmad`,
  },
  {
    name: 'Template 8: Hotel Concierge Intel',
    subject: 'The front desk at [Hotel] says you\'re hard to reach after hours',
    body: `Hey [First Name],

I was talking to the concierge desk at [Hotel Name] near [Airport]. When I asked who they recommend for airport shuttles, they mentioned [Company Name] — but said they sometimes can't get through after hours.

That's bookings going to whoever answers next. Caravan fixes this — AI answers your line when you're off.

7 days free, 20-minute setup: [Calendly link]

— Ahmad`,
  },
  {
    name: 'Template 9: Mystery Shop Results (Week 2)',
    subject: 'Your company\'s after-hours call score',
    body: `Hey [First Name],

We recently studied the after-hours call experience for 50 shuttle companies in [market]. [Company Name] ranked [X] out of 50 for responsiveness.

Here's the full picture: [link to report]

The operators at the top of that list answer every call, day and night. Caravan can get you there — 7 days free, 20-minute setup.

— Ahmad`,
  },
];

function EmailTemplateList() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <>
      {EMAIL_TEMPLATES.map((tpl, i) => (
        <div key={i} className="bg-white">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{tpl.name.replace(/Template \d+: /, '')}</div>
              <div className="text-xs text-gray-400 mt-0.5">Subject: {tpl.subject}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`} />
          </button>
          {expanded === i && (
            <div className="px-6 pb-4 pt-1">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  Subject: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{tpl.subject}</span>
                </div>
                <button
                  onClick={() => copy(i, `Subject: ${tpl.subject}\n\n${tpl.body}`)}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
                >
                  {copied === i ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-xs text-gray-600 bg-gray-50 rounded-lg p-4 border border-gray-100 font-sans leading-relaxed">
                {tpl.body}
              </pre>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
