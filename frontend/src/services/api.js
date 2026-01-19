import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Could redirect to login here
        }
        return Promise.reject(error)
    }
)

// API functions
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
}

export const plansAPI = {
    getPlans: () => api.get('/plans'),
    mockCheckout: (data) => api.post('/checkout/mock', data),
}

export const challengesAPI = {
    getActive: () => api.get('/challenges/active'),
    getById: (id) => api.get(`/challenges/${id}`),
    getAll: () => api.get('/challenges/'),
}

export const aiAPI = {
    analyze: (data) => api.post('/ai/analyze', data),
    chat: (data) => api.post('/ai/chat', data),
}

export const marketAPI = {
    getQuote: (symbol) => api.get(`/market/quote?symbol=${symbol}`),
    getSeries: (symbol, interval = '1m', range = '1d') =>
        api.get(`/market/series?symbol=${symbol}&interval=${interval}&range=${range}`),
    getMoroccoQuote: (symbol) => api.get(`/market/ma-quote?symbol=${symbol}`),
    getCalendar: (limit, impact) => {
        let url = '/market/calendar?'
        if (limit) url += `limit=${limit}&`
        if (impact) url += `impact=${impact}`
        return api.get(url)
    },
}

export const tradesAPI = {
    create: (data) => api.post('/trades', data),
    getByChallenge: (challengeId) => api.get(`/trades?challenge_id=${challengeId}`),
}

export const leaderboardAPI = {
    getMonthlyTop10: () => api.get('/leaderboard/monthly-top10'),
}

export const adminAPI = {
    getPayPalSettings: () => api.get('/admin/paypal-settings'),
    updatePayPalSettings: (data) => api.put('/admin/paypal-settings', data),
}

export default api
