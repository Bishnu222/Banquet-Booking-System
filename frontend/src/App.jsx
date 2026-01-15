import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { LandingPage } from './components/shared/LandingPage'
import SignIn from './components/user/SignIn'
import SignUp from './components/user/SignUp'
import { VenuesPage } from './components/shared/VenuesPages'
import './App.css'
import { HomePage } from './components/user/HomePage'
import AdminDashboard from './components/admin/AdminDashboard'
import OwnerLogin from './components/owner/OwnerLogin'
import OwnerSignup from './components/owner/OwnerSignup'
import OwnerDashboard from './components/owner/OwnerDashboard'

import ProfilePage from './components/shared/ProfilePage'
import VenueDetail from './components/shared/VenueDetail'
import MyBookings from './components/user/MyBookings'
import BookingPage from './components/user/BookingPage'
import PaymentPage from './components/user/PaymentPage'
import { EsewaSuccess, EsewaFailure } from './components/user/EsewaCallback'
import AboutUs from './components/shared/AboutUs'
import TermsConditions from './components/shared/TermsConditions'

function Home() {
  const navigate = useNavigate()

  return (
    <LandingPage
      onNavigateToLogin={() => navigate('/signin')}
      onNavigateToSignUp={() => navigate('/signup')}
      onNavigateToVenues={() => navigate('/venues')}
      onNavigateToAbout={() => navigate('/about')}
      onNavigateToTerms={() => navigate('/terms')}
      onNavigateToOwnerSignup={() => navigate('/owner-signup')}
    />
  )
}

import ForgotPassword from './components/shared/ForgotPassword'
import ResetPassword from './components/shared/ResetPassword'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/venues" element={<VenuesPageWrapper />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            {/* Protected Routes (Ideally wrapped in a ProtectedRoute component, using direct verify here for simplicity) */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/owner-login" element={<OwnerLogin />} />
            <Route path="/owner-signup" element={<OwnerSignup />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/book/:venueId" element={<BookingPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/payment/esewa/success" element={<EsewaSuccess />} />
            <Route path="/payment/esewa/failure" element={<EsewaFailure />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsConditions />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
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

