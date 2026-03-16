import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Plane,
  Truck,
  Users,
  Clock,
  AlertTriangle,
  Map,
  RotateCcw,
  CheckCircle,
  Shield,
  Zap,
  Brain,
  Heart,
  TrendingUp,
  PhoneCall,
  Navigation,
  Calendar,
} from 'lucide-react';

// ─────────────────────────────────────────────
// INTERACTIVE 1: 4AM Incident Walkthrough
// ─────────────────────────────────────────────

const incidentSteps = [
  {
    time: '4:17 AM',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    label: 'Breakdown Alert',
    description:
      'Van #4 reports engine failure on the highway shoulder. Six passengers on board. No driver nearby to assist immediately.',
    status: 'critical',
  },
  {
    time: '4:18 AM',
    icon: <Users className="w-6 h-6 text-orange-500" />,
    label: 'Assess Passengers',
    description:
      'Two passengers have international departures in under 2 hours. Three have domestic flights. One is flexible. International passengers are now at risk of missing their flights.',
    status: 'warning',
  },
  {
    time: '4:19 AM',
    icon: <Truck className="w-6 h-6 text-blue-500" />,
    label: 'Find Nearby Driver',
    description:
      'Review active driver list. Driver Maria is 9 min away but already has a pickup at 4:35. Driver Carlos is 12 min away with a 5:00 AM first pickup. Carlos has the most scheduling slack.',
    status: 'thinking',
  },
  {
    time: '4:21 AM',
    icon: <Map className="w-6 h-6 text-purple-500" />,
    label: 'Calculate Cascade Effects',
    description:
      "If Carlos diverts, his 5:00 AM pickup gets pushed 25–30 min. That passenger has a 6:45 AM flight — still reachable. Maria's 4:35 AM pickup cannot wait. Maria stays on route.",
    status: 'thinking',
  },
  {
    time: '4:23 AM',
    icon: <Navigation className="w-6 h-6 text-green-500" />,
    label: 'Decision Made',
    description:
      'Carlos is dispatched to the breakdown location. His 5:00 AM pickup is manually rescheduled and re-confirmed. Van #4 is marked out of service. Backup vehicle availability is checked.',
    status: 'resolved',
  },
  {
    time: '4:25 AM',
    icon: <PhoneCall className="w-6 h-6 text-teal-500" />,
    label: 'Notify Everyone',
    description:
      'All six stranded passengers are called. The two international travelers are personally reassured with an estimated new arrival time. The rescheduled 5:00 AM passenger is notified by text.',
    status: 'resolved',
  },
];

const statusColors: Record<string, string> = {
  critical: 'bg-red-50 border-red-200',
  warning: 'bg-orange-50 border-orange-200',
  thinking: 'bg-blue-50 border-blue-200',
  resolved: 'bg-green-50 border-green-200',
};

const IncidentWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = incidentSteps[currentStep];
  const isLast = currentStep === incidentSteps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div className="my-10 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm font-mono text-gray-300">dispatch_console — live incident</span>
        </div>
        <span className="text-xs text-gray-400 font-mono">Step {currentStep + 1} / {incidentSteps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-500"
          style={{ width: `${((currentStep + 1) / incidentSteps.length) * 100}%` }}
        />
      </div>

      {/* Step breadcrumb */}
      <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50 px-4 py-2 gap-1">
        {incidentSteps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`shrink-0 text-xs px-3 py-1 rounded-full transition-all font-medium ${
              i === currentStep
                ? 'bg-[var(--primary)] text-white'
                : i < currentStep
                ? 'bg-gray-300 text-gray-700'
                : 'bg-white border border-gray-200 text-gray-400'
            }`}
          >
            {s.time}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className={`p-6 border transition-colors duration-300 ${statusColors[step.status]}`}>
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
            {step.icon}
          </div>
          <div className="flex-1">
            <div className="text-xs font-mono text-gray-400 mb-1">{step.time}</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{step.label}</h4>
            <p className="text-gray-700 leading-relaxed">{step.description}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={isFirst}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-xs text-gray-400">
          {isLast ? 'Situation resolved in ~8 minutes' : 'Walk through the dispatcher\'s decisions →'}
        </span>
        {isLast ? (
          <button
            onClick={() => setCurrentStep(0)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:opacity-80 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((s) => Math.min(incidentSteps.length - 1, s + 1))}
            className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:opacity-80 transition-opacity"
          >
            Next Decision
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// INTERACTIVE 2: Dispatch Variables Web
// ─────────────────────────────────────────────

const dispatchVariables = [
  {
    icon: <Plane className="w-5 h-5" />,
    label: 'Flight Status',
    color: 'blue',
    description: 'A delayed or early arrival shifts pickup windows, can cause cascading rescheduling across multiple drivers.',
    affects: ['Pickup Timing', 'Driver Routing', 'Passenger Grouping'],
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: 'Pickup Timing',
    color: 'orange',
    description: 'Tight time windows reduce grouping flexibility. Each minute matters when passengers have hard flight deadlines.',
    affects: ['Driver Routing', 'Passenger Grouping', 'Vehicle Capacity'],
  },
  {
    icon: <Truck className="w-5 h-5" />,
    label: 'Vehicle Capacity',
    color: 'purple',
    description: 'Vehicle size determines how passengers are grouped. A breakdown reduces capacity, forcing regrouping across remaining fleet.',
    affects: ['Passenger Grouping', 'Driver Assignment', 'Route Efficiency'],
  },
  {
    icon: <Map className="w-5 h-5" />,
    label: 'Driver Routing',
    color: 'green',
    description: 'Each reroute affects not only the diverted driver, but every subsequent pickup in their manifest.',
    affects: ['Pickup Timing', 'Shift Schedules', 'Route Efficiency'],
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Passenger Grouping',
    color: 'teal',
    description: 'Grouping passengers by geography and time is an optimization problem. One late passenger can ungroup an entire cluster.',
    affects: ['Vehicle Capacity', 'Route Efficiency', 'Driver Assignment'],
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: 'Shift Schedules',
    color: 'red',
    description: 'Drivers cannot exceed driving hours. A breakdown mid-shift may mean a driver is unavailable for the rest of the morning.',
    affects: ['Driver Assignment', 'Vehicle Capacity', 'Pickup Timing'],
  },
];

const varColorMap: Record<string, { bg: string; border: string; text: string; pill: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', pill: 'bg-blue-100 text-blue-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', pill: 'bg-orange-100 text-orange-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', pill: 'bg-purple-100 text-purple-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', pill: 'bg-green-100 text-green-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', pill: 'bg-teal-100 text-teal-700' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', pill: 'bg-red-100 text-red-700' },
};

const DispatchVariablesDiagram = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? dispatchVariables[activeIndex] : null;
  const activeColors = active ? varColorMap[active.color] : null;

  return (
    <div className="my-10 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 text-sm">Dispatch Variable Dependency Map</h4>
        <p className="text-xs text-gray-500 mt-1">Click any variable to see how it ripples through the rest of the operation.</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {dispatchVariables.map((v, i) => {
            const colors = varColorMap[v.color];
            const isActive = activeIndex === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(isActive ? null : i)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                  isActive
                    ? `${colors.bg} ${colors.border} shadow-sm`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className={`${isActive ? colors.text : 'text-gray-400'} transition-colors`}>{v.icon}</span>
                <span className={`text-sm font-medium ${isActive ? colors.text : 'text-gray-700'}`}>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          className={`rounded-lg border-2 p-5 transition-all duration-300 min-h-[120px] ${
            activeColors ? `${activeColors.bg} ${activeColors.border}` : 'border-dashed border-gray-200 bg-gray-50'
          }`}
        >
          {active && activeColors ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={activeColors.text}>{active.icon}</span>
                <span className={`font-semibold ${activeColors.text}`}>{active.label}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{active.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 self-center mr-1">Affects →</span>
                {active.affects.map((tag, ti) => (
                  <span key={ti} className={`text-xs px-2.5 py-1 rounded-full font-medium ${activeColors.pill}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Select a variable above to explore its dependencies
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// INTERACTIVE 3: Software Landscape
// ─────────────────────────────────────────────

const landscapeCategories = [
  {
    label: 'Reservation-Focused',
    icon: <Calendar className="w-5 h-5" />,
    tagline: 'Built around booking & scheduling',
    color: 'blue',
    tools: [
      {
        name: 'Generic Booking Engines',
        desc: 'Accept reservations online, manage basic scheduling. Limited operational support once the day begins.',
      },
      {
        name: 'Payment-First Platforms',
        desc: 'Focus on accepting and managing payments, often with basic calendar views. Dispatch is an afterthought.',
      },
    ],
    gap: 'These tools stop at reservations. What happens operationally on the day of service is largely unsupported.',
  },
  {
    label: 'Established Dispatch Platforms',
    icon: <Map className="w-5 h-5" />,
    tagline: 'Operational powerhouses with legacy architecture',
    color: 'purple',
    tools: [
      {
        name: 'Hudson, Santa Cruz, LimoAnywhere',
        desc: 'Established platforms built specifically for ground transportation dispatch with comprehensive operational tooling.',
      },
      {
        name: 'Specialty NEMT Platforms',
        desc: 'Systems designed for non-emergency medical transport with compliance features and billing integration.',
      },
    ],
    gap: 'Powerful but complex. Often built on older technical assumptions. Can be cost-prohibitive or difficult to fully adopt for smaller operators.',
  },
  {
    label: 'Emerging Opportunities',
    icon: <Zap className="w-5 h-5" />,
    tagline: 'Modern infrastructure opening new possibilities',
    color: 'green',
    tools: [
      {
        name: 'Cloud-Native Dispatch Tools',
        desc: 'Leveraging modern cloud infrastructure, real-time APIs, and mobile-first UX to rethink operational tooling.',
      },
      {
        name: 'AI-Assisted Route Optimization',
        desc: 'Using modern ML APIs to help with trip grouping, dynamic rerouting, and predictive delay alerts.',
      },
    ],
    gap: 'The capabilities that previously required large engineering teams are now accessible. The question is whether smaller operators can actually adopt them.',
  },
];

const lcColorMap: Record<string, { tab: string; border: string; badge: string; gapBg: string }> = {
  blue: {
    tab: 'bg-blue-600 text-white',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    gapBg: 'bg-blue-50',
  },
  purple: {
    tab: 'bg-purple-600 text-white',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    gapBg: 'bg-purple-50',
  },
  green: {
    tab: 'bg-green-600 text-white',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    gapBg: 'bg-green-50',
  },
};

const SoftwareLandscape = () => {
  const [activeTab, setActiveTab] = useState(0);
  const cat = landscapeCategories[activeTab];
  const colors = lcColorMap[cat.color];

  return (
    <div className="my-10 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 text-sm">Transportation Software Landscape</h4>
        <p className="text-xs text-gray-500 mt-1">Explore the three layers of tools in the industry today.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {landscapeCategories.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === i ? colors.tab : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="hidden sm:inline">{c.label}</span>
            <span className="sm:hidden">{['Booking', 'Dispatch', 'Emerging'][i]}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`p-1.5 rounded-lg ${colors.badge}`}>{cat.icon}</span>
          <p className="text-sm text-gray-600 italic">{cat.tagline}</p>
        </div>

        <div className="space-y-3 mb-6">
          {cat.tools.map((tool, ti) => (
            <div key={ti} className={`p-4 rounded-lg border ${colors.border} bg-white`}>
              <p className="font-semibold text-gray-800 text-sm mb-1">{tool.name}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-lg ${colors.gapBg} border ${colors.border}`}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">The Gap</p>
          <p className="text-sm text-gray-700 leading-relaxed">{cat.gap}</p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// INTERACTIVE 4: Four Principles Accordion
// ─────────────────────────────────────────────

const principles = [
  {
    number: '01',
    icon: <Shield className="w-6 h-6" />,
    title: 'Control the Chaos',
    summary: 'Move dispatchers from uncertainty to clarity in seconds.',
    color: 'blue',
    details: [
      'Transportation operations are inherently unpredictable. Flights change. Drivers run late. Passengers miss pickups.',
      'A good system should not just record what happened — it should help operators understand the situation and form a plan within seconds.',
      'This means surfacing the right information at the right moment, not flooding the dispatcher with data.',
    ],
    example: 'Instead of a dispatcher manually checking each driver\'s manifest to find who can respond to an incident, the system should surface the two or three best options immediately.',
  },
  {
    number: '02',
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'Prevent Mistakes Before They Happen',
    summary: 'Surface risks early so they can be corrected, not just recorded.',
    color: 'orange',
    details: [
      'Many operational systems are designed primarily to record activity. After-the-fact reporting tells you what went wrong, but not in time to prevent it.',
      'Dispatch software should also identify risks proactively: a route that cannot realistically be completed in time, a vehicle approaching capacity, a delay that will cascade into later pickups.',
      'The earlier a risk becomes visible, the easier it is to prevent.',
    ],
    example: 'If a driver\'s route will mathematically produce a late pickup based on current traffic, the system should flag it 30 minutes in advance — not after the passenger calls.',
  },
  {
    number: '03',
    icon: <Brain className="w-6 h-6" />,
    title: 'Reduce Mental Stress',
    summary: 'Software should absorb cognitive burden, not add to it.',
    color: 'purple',
    details: [
      'Dispatchers are effectively running a complex logistics simulation in their heads while simultaneously coordinating drivers, vehicles, and passengers in real time.',
      'If a system requires more mental effort to manage than the process it replaces, it isn\'t helping — it\'s a new burden on top of an existing one.',
      'Good systems reduce the number of things a dispatcher has to hold in their head, not increase them.',
    ],
    example: 'A driver-facing app that requires multiple taps to confirm a pickup while they\'re driving is a liability. Driver interfaces must be designed around real driving conditions — minimal, glanceable, and safe.',
  },
  {
    number: '04',
    icon: <Heart className="w-6 h-6" />,
    title: 'Improve the Traveler Experience',
    summary: 'Operations and customer experience are the same problem.',
    color: 'teal',
    details: [
      'Ultimately, transportation businesses exist to serve travelers. Yet many booking interfaces and customer experiences in this industry still feel decades behind modern travel platforms.',
      'Simple improvements in booking flow, communication, status updates, and clarity around pickup details can have a significant impact on customer satisfaction and repeat business.',
      'Traveler-facing UX is not a separate feature — it is a direct reflection of how well the operation is running.',
    ],
    example: 'A passenger who receives a proactive text message saying "your driver is 5 minutes away, gray Honda Odyssey, license X123" has a fundamentally different experience than one who waits anxiously without information.',
  },
];

const principleColorMap: Record<string, { accent: string; bg: string; border: string; num: string; iconBg: string }> = {
  blue: { accent: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', num: 'text-blue-200', iconBg: 'bg-blue-100 text-blue-600' },
  orange: { accent: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', num: 'text-orange-200', iconBg: 'bg-orange-100 text-orange-600' },
  purple: { accent: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', num: 'text-purple-200', iconBg: 'bg-purple-100 text-purple-600' },
  teal: { accent: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', num: 'text-teal-200', iconBg: 'bg-teal-100 text-teal-600' },
};

const PrinciplesAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="my-10 space-y-3">
      {principles.map((p, i) => {
        const colors = principleColorMap[p.color];
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${
              isOpen ? `${colors.border} shadow-sm` : 'border-gray-200'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                isOpen ? colors.bg : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                  {p.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-mono font-bold ${colors.num.replace('200', '400')}`}>{p.number}</span>
                    <span className="font-bold text-gray-900">{p.title}</span>
                  </div>
                  <p className="text-sm text-gray-500">{p.summary}</p>
                </div>
              </div>
              <ChevronDown
                className={`shrink-0 w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 bg-white border-t border-gray-100">
                <div className="space-y-3 mt-3">
                  {p.details.map((d, di) => (
                    <div key={di} className="flex items-start gap-3">
                      <span className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${colors.accent.replace('text-', 'bg-')}`} />
                      <p className="text-sm text-gray-700 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
                <div className={`mt-5 p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">In Practice</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">{p.example}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// INTERACTIVE 5: Business Impact Metrics
// ─────────────────────────────────────────────

const impactAreas = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    label: 'Profitability',
    color: 'green',
    score: 90,
    headline: 'Routing efficiency directly affects margins',
    detail:
      'Poor trip grouping means more miles per passenger, more fuel, more driver hours. Even small improvements in route optimization compound significantly over thousands of trips.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    label: 'Customer Experience',
    color: 'blue',
    score: 85,
    headline: 'Clear communication drives repeat bookings',
    detail:
      'Travelers who receive proactive updates and precision pickup details trust the service more and are significantly more likely to rebook. One bad experience — a late driver with no communication — can eliminate a repeat customer.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    label: 'Employee Stress',
    color: 'purple',
    score: 75,
    headline: 'Dispatcher and driver quality of life matters',
    detail:
      'Operational chaos is hard on the people who manage it. Systems that reduce the number of decisions a dispatcher has to make under pressure also reduce burnout and turnover — a real cost for any small business.',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    label: 'Long-Term Competitiveness',
    color: 'orange',
    score: 80,
    headline: 'Traveler expectations are rising steadily',
    detail:
      'Passengers are now accustomed to the real-time tracking and proactive communication they get from Uber and Lyft. Transportation companies that cannot offer a comparable experience risk losing ground incrementally — not all at once.',
  },
];

const impactColorMap: Record<string, { bg: string; fill: string; iconBg: string; border: string }> = {
  green: { bg: 'bg-green-100', fill: 'bg-green-500', iconBg: 'bg-green-50 text-green-600', border: 'border-green-200' },
  blue: { bg: 'bg-blue-100', fill: 'bg-blue-500', iconBg: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', fill: 'bg-purple-500', iconBg: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-100', fill: 'bg-orange-500', iconBg: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
};

const BusinessImpactMetrics = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="my-10 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 text-sm">Operational Systems — Business Impact</h4>
        <p className="text-xs text-gray-500 mt-1">Hover over each area to see why it matters.</p>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {impactAreas.map((area, i) => {
          const colors = impactColorMap[area.color];
          const isHovered = hovered === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`p-5 rounded-xl border-2 cursor-default transition-all duration-200 ${
                isHovered ? `${colors.border} shadow-sm` : 'border-gray-100'
              } bg-white`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                  {area.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{area.label}</p>
                  <p className="text-xs text-gray-500">{area.headline}</p>
                </div>
              </div>
              {/* Bar */}
              <div className={`h-2 rounded-full ${colors.bg} mb-3`}>
                <div
                  className={`h-full rounded-full ${colors.fill} transition-all duration-700`}
                  style={{ width: isHovered ? `${area.score}%` : '30%' }}
                />
              </div>
              <p
                className={`text-xs text-gray-600 leading-relaxed transition-all duration-300 ${
                  isHovered ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'
                }`}
              >
                {area.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// INTERACTIVE 6: What Good Systems Look Like
// ─────────────────────────────────────────────

const systemCharacteristics = [
  {
    icon: '⚡',
    label: 'Event-Driven Reactions',
    description: 'They react to events, not just data updates. A flight delay isn\'t just a number change — it\'s a trigger for operational decisions.',
  },
  {
    icon: '🧑‍✈️',
    label: 'Human Supervision',
    description: 'They enable humans to supervise operations rather than manually orchestrate every step. The dispatcher directs; the system handles routing.',
  },
  {
    icon: '🔍',
    label: 'Contextual Insight',
    description: 'They surface insight and context. Not raw data — interpreted signals that help operators understand what\'s actually happening.',
  },
  {
    icon: '🔗',
    label: 'Operations ↔ Experience',
    description: 'They connect business operations with customer experience. The traveler\'s experience is a direct output of how well operations are running.',
  },
];

const SystemCharacteristicsGrid = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {systemCharacteristics.map((c, i) => {
        const isFlipped = flipped === i;
        return (
          <button
            key={i}
            onClick={() => setFlipped(isFlipped ? null : i)}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-300 ${
              isFlipped
                ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="font-semibold text-gray-900 text-sm mb-2">{c.label}</p>
            <p
              className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ${
                isFlipped ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
              }`}
            >
              {c.description}
            </p>
            {!isFlipped && (
              <p className="text-xs text-gray-400 mt-1">Click to explore →</p>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN ARTICLE EXPORT
// ─────────────────────────────────────────────

export const AirportShuttleDispatch = () => {
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
              Transportation Operations
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-main)] mb-4 leading-tight">
              Why Airport Shuttle Dispatch Is Harder Than It Looks
            </h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>March 5, 2026</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">

            {/* Opening */}
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8">
              It's 4:17 AM. One of the vans just broke down on the side of the highway. Six passengers are on board, all headed to the airport. Two of them have international flights leaving in just a few hours.
            </p>

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              The dispatcher now has to figure out how to get them there on time.
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              <li className="flex items-start gap-3"><span className="text-[var(--primary)] mt-1">•</span><span>Which nearby driver can divert?</span></li>
              <li className="flex items-start gap-3"><span className="text-[var(--primary)] mt-1">•</span><span>Can another vehicle reach them quickly enough?</span></li>
              <li className="flex items-start gap-3"><span className="text-[var(--primary)] mt-1">•</span><span>Will rerouting that driver cause other passengers to miss their pickups?</span></li>
              <li className="flex items-start gap-3"><span className="text-[var(--primary)] mt-1">•</span><span>And who is calling the passengers to explain what's happening?</span></li>
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-2">
              This kind of situation is not rare in transportation operations. It's part of the daily reality of running a shuttle business.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Walk through how a dispatcher has to sequence these decisions — in real time, often alone, before the sun rises.
            </p>

            {/* INTERACTIVE 1 */}
            <IncidentWalkthrough />

            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Both of us at ReThread grew up around that reality. Moaz's family ran a non-emergency medical transportation (NEMT) business. Ahmad's family ran airport shuttle operations. Different models, different customers — but the same underlying challenge: coordinating vehicles, drivers, passengers, and time.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              We saw the early morning calls. The scrambling when flights changed. The pressure that dispatchers carried every day trying to keep everything moving.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              We're not claiming to be experts in this space. But we grew up watching it closely, and recently we've started studying it more intentionally as we design software for transportation operators. The deeper we look, the more one thing becomes clear: dispatch is a far more complex problem than it appears from the outside.
            </p>

            <hr className="border-gray-200 my-10" />

            {/* Section 2: Dispatch Reality */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              The Reality of Dispatch
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              On paper, an airport shuttle operation sounds simple. Passengers book rides. Drivers pick them up. Vehicles bring them to the airport. In reality, dispatch is a constantly shifting logistics puzzle.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">A typical morning might involve:</p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              {['15–30 passengers', 'multiple pickup zones across a city', 'several vehicles', 'drivers with different shift schedules', 'flights leaving at different times', 'passengers running late', 'flights arriving early or delayed'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[var(--primary)] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Every one of those variables affects the others. Click through the map below to see how each variable creates ripple effects across the entire operation — and why a single change can require a cascade of decisions.
            </p>

            {/* INTERACTIVE 2 */}
            <DispatchVariablesDiagram />

            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Dispatchers are constantly balancing these variables in real time, often with incomplete information and limited time to react. And in many companies, a large part of that coordination still lives in the dispatcher's head.
            </p>

            <hr className="border-gray-200 my-10" />

            {/* Section 3: Pressure Points */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Where Operations Struggle
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Through conversations with operators and observing how these businesses run, a few common pressure points appear repeatedly. These are not failures — they are simply the natural friction points of a complicated operation.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Manual Trip Grouping
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              One of the most complex parts of dispatch is grouping passengers into shared trips. This requires understanding geography, pickup timing, traffic patterns, flight schedules, and vehicle capacity — simultaneously.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              In many companies, one or two experienced dispatchers develop an intuition for how to do this efficiently. The risk is that this operational knowledge often lives with specific individuals. If that person leaves, the company can suddenly lose a significant portion of its logistical expertise.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Flight Tracking That Stops at Information
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Most transportation platforms today include some form of flight tracking. That's helpful — but often the system simply updates the flight status. The operational decisions that follow still fall to the dispatcher:
            </p>
            <ul className="space-y-2 mb-6 text-[var(--text-muted)]">
              {['Should pickup times be adjusted?', 'Should passengers be regrouped?', 'Should drivers be rerouted?'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[var(--primary)] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The system provides information, but the dispatcher must still translate that information into action.
            </p>

            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-8 mb-3">
              Driver Communication
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              Communication between drivers and dispatch is another critical piece of operations. In many companies this still relies heavily on phone calls, text messages, and dispatcher relays. Any technology that attempts to improve this has to respect a fundamental constraint:
            </p>
            <div className="my-6 p-5 rounded-xl bg-gray-900 text-white">
              <p className="text-lg font-semibold leading-snug">
                "Drivers are operating vehicles. They cannot safely interact with complicated software while driving."
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Any driver-facing system must be designed around real driving conditions — not theoretical UX.
              </p>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              For us, this means something straightforward: we need to ride along with drivers, observe how they work, and design tools that fit naturally into their workflow — not force them to adopt something that disrupts operations.
            </p>

            <hr className="border-gray-200 my-10" />

            {/* Section 4: Software Landscape */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              The Transportation Software Landscape
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              There are already many software tools used across the transportation industry. Understanding where they fit — and where the gaps are — is part of what we're studying. Explore the three broad categories below.
            </p>

            {/* INTERACTIVE 3 */}
            <SoftwareLandscape />

            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              At the same time, technology has changed dramatically. Cloud infrastructure, mapping services, and modern APIs make it far easier to build tools that previously required large engineering teams. Capabilities like route optimization, real-time data integration, automated trip creation, intelligent alerts, and system integrations are much more accessible today than they were even a decade ago.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              This raises an interesting question: could smaller transportation operators have access to capabilities that previously only large companies could afford? That's one of the questions we're exploring.
            </p>

            <hr className="border-gray-200 my-10" />

            {/* Section 5: Four Principles */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              The Four Principles We're Designing Around
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              As we study this space and experiment with building new systems, a few core principles keep coming up. These principles guide how we think about transportation software. Click each to explore the idea in depth.
            </p>

            {/* INTERACTIVE 4 */}
            <PrinciplesAccordion />

            <hr className="border-gray-200 my-10" />

            {/* Section 6: What Good Systems Look Like */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              What We're Learning About Good Systems
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              The deeper we explore this space, the more we believe good operational systems share a few key characteristics. Click each to see what we mean.
            </p>

            {/* INTERACTIVE 6 */}
            <SystemCharacteristicsGrid />

            <hr className="border-gray-200 my-10" />

            {/* Section 7: Business Impact */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Why This Matters for Small Businesses
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              For transportation companies, operational systems have a direct impact on the health of the business. Hover over each area below to see the downstream effect.
            </p>

            {/* INTERACTIVE 5 */}
            <BusinessImpactMetrics />

            <hr className="border-gray-200 my-10" />

            {/* Closing */}
            <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
              Why We're Studying This
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              This exploration started with something simple. Both of us grew up watching our families run transportation businesses. We saw the pressure behind the scenes — the early mornings, the last-minute changes, and the constant effort to keep everything moving smoothly.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Now we're trying to understand those systems more deeply. Not just to build software, but to understand how modern tools might make these operations easier to run.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              We're still learning. But the complexity of transportation dispatch has already given us a deep respect for the people who manage it every day.
            </p>
            <div className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-gray-500 text-sm italic">And that's where this work begins.</p>
            </div>

          </div>
        </article>
      </div>
    </div>
  );
};
