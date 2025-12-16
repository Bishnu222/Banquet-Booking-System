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

import ProfilePage from './components/ProfilePage'
import VenueDetail from './components/VenueDetail'
import MyBookings from './components/MyBookings'
import BookingPage from './components/BookingPage'

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
          <Route path="/venues/:id" element={<VenueDetail />} />
          {/* Protected Routes (Ideally wrapped in a ProtectedRoute component, using direct verify here for simplicity) */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/book/:venueId" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

function VenuesPageWrapper() {
  const navigate = useNavigate();
  return (
    <VenuesPage
      onNavigateBack={() => {
        const token = localStorage.getItem('token');
        if (token) {
          navigate('/home');
        } else {
          navigate('/');
        }
      }}
    />
  );
}

export default App

