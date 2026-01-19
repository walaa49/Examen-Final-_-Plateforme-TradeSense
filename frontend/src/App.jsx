import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Calendar from './pages/Calendar'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <div className="min-h-screen bg-dark-950 flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
