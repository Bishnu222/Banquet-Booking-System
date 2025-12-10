import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import './App.css'

function Home() {
  const navigate = useNavigate()
  
  return (
    <LandingPage
      onNavigateToLogin={() => navigate('/signin')}
      onNavigateToSignUp={() => navigate('/signup')}
      onNavigateToVenues={() => navigate('/venues')}
    />
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

