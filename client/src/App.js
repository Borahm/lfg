import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import TopNavbar from './components/navbar/TopNavbar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Project from './components/Project'

const App = () => {
  return (
    <BrowserRouter>
      <TopNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects/:projectId" element={<Project />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App