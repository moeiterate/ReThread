import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Roadmap } from './pages/Roadmap'
import { Backlog } from './pages/Backlog'
import { Sprints } from './pages/Sprints'
import { Communications } from './pages/Communications'
import { Articles } from './pages/Articles'
import { MarketingROIDashboard } from './pages/articles/MarketingROIDashboard'
import { EmployeeLeaveAutomation } from './pages/articles/EmployeeLeaveAutomation'
import { CustomCRMSupabase } from './pages/articles/CustomCRMSupabase'
import { UpworkAutomationAnalysis } from './pages/articles/UpworkAutomationAnalysis'
import { TemplatesIndex } from './templates/TemplatesIndex'
import { SaaSModern } from './templates/SaaSModern'
import { SaaSCentered } from './templates/SaaSCentered'
import { SaaSDark } from './templates/SaaSDark'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/sprints" element={<Sprints />} />
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/marketing-roi-dashboard-guide" element={<MarketingROIDashboard />} />
          <Route path="/articles/employee-leave-management-automation" element={<EmployeeLeaveAutomation />} />
          <Route path="/articles/building-custom-crm-supabase" element={<CustomCRMSupabase />} />
          <Route path="/articles/upwork-automation-analysis" element={<UpworkAutomationAnalysis />} />
        </Route>
        
        {/* Templates - No Layout */}
        <Route path="/templates" element={<TemplatesIndex />} />
        <Route path="/templates/modern" element={<SaaSModern />} />
        <Route path="/templates/centered" element={<SaaSCentered />} />
        <Route path="/templates/dark" element={<SaaSDark />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
