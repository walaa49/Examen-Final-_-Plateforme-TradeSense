import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown, FiMinus, FiRefreshCw } from 'react-icons/fi'
import Badge from './ui/Badge'
import api from '../services/api'

export default function SignalsPanel({ symbol }) {
    const [signal, setSignal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSignal = async () => {
        if (!symbol) return

        setLoading(true)
        try {
            // For now, generate signal client-side based on price data
            const isMorocco = ['IAM', 'ATW', 'BCP', 'LHM', 'CIH'].includes(symbol.toUpperCase())
            const response = isMorocco
                ? await api.get(`/market/ma-quote?symbol=${symbol}`)
                : await api.get(`/market/quote?symbol=${symbol}`)

            const quote = response.data
            const signalData = generateSignal(quote)
            setSignal(signalData)
            setError(null)
        } catch (err) {
            setError('Failed to generate signal')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSignal()
        const interval = setInterval(fetchSignal, 60000) // Refresh every minute
        return () => clearInterval(interval)
    }, [symbol])

    const generateSignal = (quote) => {
        const change_pct = quote.change_pct || 0
        let signal = 'NEUTRAL'
        let confidence = 50
        const reasons = []

        if (change_pct > 2) {
            signal = 'BUY'
            confidence = 75
            reasons.push('Strong upward momentum detected')
            reasons.push(`Price up ${change_pct.toFixed(2)}% today`)
        } else if (change_pct > 0.5) {
            signal = 'BUY'
            confidence = 60
            reasons.push('Positive price movement')
        } else if (change_pct < -2) {
            signal = 'SELL'
            confidence = 70
            reasons.push('Strong downward momentum')
            reasons.push(`Price down ${Math.abs(change_pct).toFixed(2)}% today`)
        } else if (change_pct < -0.5) {
            signal = 'SELL'
            confidence = 55
            reasons.push('Negative price action')
        } else {
            reasons.push('Price consolidating in range')
            reasons.push('Wait for clearer direction')
        }

        return {
            signal,
            confidence,
            reasons,
            price: quote.price
        }
    }

    const getSignalColor = () => {
        if (!signal) return 'default'
        if (signal.signal === 'BUY') return 'success'
        if (signal.signal === 'SELL') return 'danger'
        return 'warning'
    }

    const getSignalIcon = () => {
        if (!signal) return <FiMinus />
        if (signal.signal === 'BUY') return <FiTrendingUp />
        if (signal.signal === 'SELL') return <FiTrendingDown />
        return <FiMinus />
    }

    if (loading) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">AI Signals</h3>
                <div className="animate-pulse space-y-3">
                    <div className="h-12 bg-dark-700 rounded-xl" />
                    <div className="h-4 bg-dark-700 rounded w-3/4" />
                    <div className="h-4 bg-dark-700 rounded w-1/2" />
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">AI Signals</h3>
                <button
                    onClick={fetchSignal}
                    className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                    <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error ? (
                <p className="text-danger-400 text-sm">{error}</p>
            ) : signal ? (
                <div className="space-y-4">
                    {/* Signal Badge */}
                    <div className="flex items-center gap-3">
                        <div className={`p-4 rounded-xl ${signal.signal === 'BUY' ? 'bg-success-500/20' :
                                signal.signal === 'SELL' ? 'bg-danger-500/20' :
                                    'bg-dark-700'
                            }`}>
                            <span className={`text-3xl ${signal.signal === 'BUY' ? 'text-success-400' :
                                    signal.signal === 'SELL' ? 'text-danger-400' :
                                        'text-dark-400'
                                }`}>
                                {getSignalIcon()}
                            </span>
                        </div>
                        <div>
                            <Badge variant={getSignalColor()} className="text-lg px-4 py-1">
                                {signal.signal}
                            </Badge>
                            <p className="text-sm text-dark-400 mt-1">
                                {symbol}
                            </p>
                        </div>
                    </div>

                    {/* Confidence */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-dark-400">Confidence</span>
                            <span className="text-white font-medium">{signal.confidence}%</span>
                        </div>
                        <div className="w-full bg-dark-700 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${signal.confidence >= 70 ? 'bg-success-500' :
                                        signal.confidence >= 50 ? 'bg-yellow-500' :
                                            'bg-danger-500'
                                    }`}
                                style={{ width: `${signal.confidence}%` }}
                            />
                        </div>
                    </div>

                    {/* Reasons */}
                    <div>
                        <p className="text-sm text-dark-400 mb-2">Analysis</p>
                        <ul className="space-y-1">
                            {signal.reasons.map((reason, index) => (
                                <li key={index} className="text-sm text-dark-300 flex items-start gap-2">
                                    <span className="text-primary-400 mt-1">•</span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : null}
        </motion.div>
    )
}
