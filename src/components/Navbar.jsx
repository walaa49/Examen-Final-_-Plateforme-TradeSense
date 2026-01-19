import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/leaderboard', label: 'Leaderboard' },
        { href: '/calendar', label: 'Calendar' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
        setShowUserMenu(false)
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="text-xl font-bold font-display gradient-text">
                            TradeSense
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'text-primary-400'
                                    : 'text-dark-300 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">{user?.name?.[0] || 'U'}</span>
                                    </div>
                                    <span className="text-sm font-medium text-white">
                                        {user?.name || 'User'}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-xl py-2">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700"
                                        >
                                            Dashboard
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700"
                                            >
                                                Admin
                                            </Link>
                                        )}
                                        <hr className="my-2 border-dark-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-400 hover:bg-dark-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/auth">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/pricing">
                                    <Button>Start Challenge</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-dark-300 hover:text-white"
                        >
                            {isOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-dark-900 border-t border-dark-800">
                    <div className="px-4 py-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block py-2 text-sm font-medium ${isActive(link.href) ? 'text-primary-400' : 'text-dark-300'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="border-dark-700" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-sm font-medium text-dark-300"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block py-2 text-sm font-medium text-danger-400"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link to="/auth" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full">Login</Button>
                                </Link>
                                <Link to="/pricing" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Start Challenge</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
