import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import OwnerLogin from './components/OwnerLogin'
import OwnerSignup from './components/OwnerSignup'
import { VenuesPage } from './components/VenuesPages'
import './App.css'

function Home() {
  const navigate = useNavigate()

  return (
    <LandingPage
      onNavigateToLogin={() => navigate('/signin')}
      onNavigateToSignUp={() => navigate('/signup')}
      onNavigateToOwnerSignup={() => navigate('/owner-signup')}
      onNavigateToVenues={() => navigate('/venues')}
    />
  )
}

import { HomePage } from './components/HomePage'
import OwnerDashboard from './components/OwnerDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/owner-signup" element={<OwnerSignup />} />
          <Route path="/venues" element={<VenuesPageWrapper />} />
          {/* Protected Routes (Ideally wrapped in a ProtectedRoute component, using direct verify here for simplicity) */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

function VenuesPageWrapper() {
  const navigate = useNavigate();
  return (
    <VenuesPage
      onNavigateBack={() => navigate('/')}
    />
  );
}

export default App

