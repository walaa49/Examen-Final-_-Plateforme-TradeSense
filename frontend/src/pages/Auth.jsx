import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { login, register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from || '/dashboard'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                await login(formData.email, formData.password)
                toast.success('Welcome back!')
            } else {
                if (!formData.name) {
                    toast.error('Please enter your name')
                    setLoading(false)
                    return
                }
                await register(formData.name, formData.email, formData.password)
                toast.success('Account created successfully!')
            }
            navigate(from, { replace: true })
        } catch (error) {
            toast.error(error.response?.data?.error || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
            <div className="w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-8">
                        {/* Tabs */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 text-center font-semibold rounded-xl transition-all ${isLogin
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-dark-800 text-dark-400 hover:text-white'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 text-center font-semibold rounded-xl transition-all ${!isLogin
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-dark-800 text-dark-400 hover:text-white'
                                    }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div>
                                    <label className="label">Full Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="input pl-11"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="label">Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="input pl-11"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="input pl-11 pr-11"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" loading={loading} className="w-full">
                                {isLogin ? 'Login' : 'Create Account'}
                            </Button>
                        </form>

                        {/* Demo credentials */}
                        {isLogin && (
                            <div className="mt-6 p-4 bg-dark-800 rounded-xl">
                                <p className="text-sm text-dark-400 mb-2">Demo Admin Credentials:</p>
                                <p className="text-sm text-dark-300">Email: admin@tradesense.ma</p>
                                <p className="text-sm text-dark-300">Password: admin123</p>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
