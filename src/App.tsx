import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Roadmap } from './pages/Roadmap'
import { Backlog } from './pages/Backlog'
import { Sprints } from './pages/Sprints'
import { Communications } from './pages/Communications'
import { Articles } from './pages/Articles'
import { Documents } from './pages/Documents'
import { DocumentEditor } from './pages/DocumentEditor'
import Login from './pages/Login'
import { MarketingROIDashboard } from './pages/articles/MarketingROIDashboard'
import { EmployeeLeaveAutomation } from './pages/articles/EmployeeLeaveAutomation'
import { CustomCRMSupabase } from './pages/articles/CustomCRMSupabase'
import { UpworkAutomationAnalysis } from './pages/articles/UpworkAutomationAnalysis'
import { TemplatesIndex } from './templates/TemplatesIndex'
import { SaaSModern } from './templates/SaaSModern'
import { SaaSCentered } from './templates/SaaSCentered'
import { SaaSDark } from './templates/SaaSDark'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!session) {
    return (
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  }

  // Show main app if authenticated
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
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentEditor />} />
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
