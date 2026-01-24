import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Roadmap } from './pages/Roadmap'
import { Backlog } from './pages/Backlog'
import { Communications } from './pages/Communications'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/communications" element={<Communications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
