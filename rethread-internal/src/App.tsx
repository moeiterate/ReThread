import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Roadmap } from './pages/Roadmap'
import { Sprints } from './pages/Sprints'
import { Backlog } from './pages/Backlog'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/sprints" element={<Sprints />} />
          <Route path="/backlog" element={<Backlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
