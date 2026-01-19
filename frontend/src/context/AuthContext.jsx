import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // Could fetch user profile here if needed
        }
        setLoading(false)
    }, [token])

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        const { user: userData, token: newToken } = response.data

        setUser(userData)
        setToken(newToken)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

        return response.data
    }

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password })
        const { user: userData, token: newToken } = response.data

        setUser(userData)
        setToken(newToken)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

        return response.data
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
    }

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export default AuthContext
