import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiActivity, FiTrendingUp, FiTrendingDown, FiShield, FiTarget, FiClock, FiCheckCircle } from 'react-icons/fi'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

export default function LiveTradingWidget() {
    const [ticket, setTicket] = useState(null)
    const [status, setStatus] = useState({ is_running: false, mt5_connected: false })
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    // Poll the BOT API (running on port 8000)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Ticket
                const ticketRes = await fetch('http://localhost:8000/api/latest-ticket')
                const ticketData = await ticketRes.json()
                setTicket(ticketData)

                // 2. Fetch Status
                const statusRes = await fetch('http://localhost:8000/api/status')
                const statusData = await statusRes.json()
                setStatus(statusData)

                setLastUpdate(new Date())
            } catch (error) {
                console.error("Bot API connection failed:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 3000) // Poll every 3 seconds for smoother demos
        return () => clearInterval(interval)
    }, [])

    if (loading) return (
        <Card className="animate-pulse h-64 flex items-center justify-center">
            <div className="text-dark-400">Connecting to Trading Bot...</div>
        </Card>
    )

    const isLong = ticket?.signal_type === 'LONG'
    const isSignalFresh = ticket?.timestamp && (new Date() - new Date(ticket.timestamp)) < 5 * 60 * 1000 // < 5 mins

    return (
        <Card className="border-t-4 border-t-accent-500 relative overflow-hidden bg-dark-900">
            {/* Header: Bot Status */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-700">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${status.mt5_connected ? 'bg-success-400' : 'bg-danger-400'}`}></div>
                        {status.mt5_connected && <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-success-400 animate-ping"></div>}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">XAUUSD BOT V2</h3>
                        <p className="text-xs text-dark-400 font-mono">MT5: {status.mt5_connected ? 'CONNECTED' : 'OFFLINE'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <Badge variant={ticket?.status === 'SIGNAL_GENERATED' ? 'primary' : 'neutral'}>
                        {ticket?.status || 'IDLE'}
                    </Badge>
                </div>
            </div>

            {/* Signal Display */}
            <AnimatePresence mode='wait'>
                {ticket?.signal_type ? (
                    <motion.div
                        key={ticket.timestamp}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Main Signal Box */}
                        <div className={`relative p-6 rounded-2xl border-2 ${isLong ? 'bg-success-500/10 border-success-500/50' : 'bg-danger-500/10 border-danger-500/50'
                            }`}>
                            {isSignalFresh && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full shadow-lg shadow-accent-500/20">
                                    NEW SIGNAL
                                </span>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-dark-400 uppercase font-semibold mb-1">Signal Type</p>
                                    <div className={`text-3xl font-black flex items-center gap-2 ${isLong ? 'text-success-400' : 'text-danger-400'}`}>
                                        {isLong ? <FiTrendingUp /> : <FiTrendingDown />}
                                        {ticket.signal_type}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-dark-400 uppercase font-semibold mb-1">Entry Price</p>
                                    <div className="text-3xl font-mono text-white tracking-widest">
                                        {ticket.entry_price?.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Confidence Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-dark-300">AI Confidence</span>
                                    <span className="text-white font-bold">{ticket.confidence}%</span>
                                </div>
                                <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${ticket.confidence}%` }}
                                        className={`h-full ${isLong ? 'bg-success-500' : 'bg-danger-500'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Trade Parameters Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
                                <div className="flex items-center gap-2 text-dark-400 mb-2 text-sm">
                                    <FiShield className="text-danger-400" /> Stop Loss
                                </div>
                                <div className="text-xl font-mono text-white">{ticket.sl?.toFixed(2)}</div>
                            </div>
                            <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
                                <div className="flex items-center gap-2 text-dark-400 mb-2 text-sm">
                                    <FiTarget className="text-success-400" /> Take Profit
                                </div>
                                <div className="text-xl font-mono text-white">{ticket.tp?.toFixed(2)}</div>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="flex items-center justify-between text-xs text-dark-500 pt-2">
                            <div className="flex items-center gap-2">
                                <FiActivity className="text-accent-400" />
                                RSI: <span className="text-white">{ticket.indicators?.rsi}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiClock /> Updated: {new Date(ticket.timestamp).toLocaleTimeString()}
                            </div>
                        </div>

                        {/* Execute Button (Optional) */}
                        <Button className="w-full" variant={isLong ? "success" : "danger"}>
                            Execute Trade Now
                        </Button>
                    </motion.div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <FiActivity className="w-8 h-8 text-dark-400" />
                        </div>
                        <h3 className="text-white font-medium mb-1">Scanning Market...</h3>
                        <p className="text-dark-400 text-sm">Waiting for high-probability setup</p>
                    </div>
                )}
            </AnimatePresence>
        </Card>
    )
}
