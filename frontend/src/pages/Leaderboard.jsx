import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { leaderboardAPI } from '../services/api'

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([])
    const [month, setMonth] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        try {
            const response = await leaderboardAPI.getMonthlyTop10()
            setLeaderboard(response.data.leaderboard)
            setMonth(response.data.month)
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
            case 2:
                return 'bg-gradient-to-r from-gray-400 to-gray-500 text-black'
            case 3:
                return 'bg-gradient-to-r from-amber-700 to-amber-800 text-white'
            default:
                return 'bg-dark-700 text-white'
        }
    }

    const getRankIcon = (rank) => {
        if (rank <= 3) {
            return <FiAward className="w-5 h-5" />
        }
        return rank
    }

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4">
                        <FiAward className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">
                        <span className="gradient-text">Top Traders</span>
                    </h1>
                    <p className="text-dark-400 text-lg">{month}</p>
                </motion.div>

                {/* Leaderboard Table */}
                <Card>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="h-16 bg-dark-700 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-12">
                            <FiTrendingUp className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                            <p className="text-dark-400 text-lg">No traders yet this month</p>
                            <p className="text-dark-500">Be the first to start a challenge!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((trader, index) => (
                                <motion.div
                                    key={trader.user_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${trader.rank <= 3 ? 'bg-dark-800/80' : 'bg-dark-800/50'
                                        } hover:bg-dark-700/50`}
                                >
                                    {/* Rank */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankStyle(trader.rank)}`}>
                                        {getRankIcon(trader.rank)}
                                    </div>

                                    {/* Name & Status */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-semibold truncate">{trader.name}</p>
                                            <Badge variant={
                                                trader.status === 'passed' ? 'success' :
                                                    trader.status === 'failed' ? 'danger' :
                                                        'primary'
                                            }>
                                                {trader.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-dark-400">
                                            Started: {trader.start_balance?.toLocaleString()} DH → Current: {trader.equity?.toLocaleString()} DH
                                        </p>
                                    </div>

                                    {/* Profit */}
                                    <div className="text-right">
                                        <p className={`text-xl font-mono font-bold ${trader.profit_pct >= 0 ? 'text-success-400' : 'text-danger-400'
                                            }`}>
                                            {trader.profit_pct >= 0 ? '+' : ''}{trader.profit_pct?.toFixed(2)}%
                                        </p>
                                        <div className="flex items-center justify-end gap-1 text-dark-400">
                                            {trader.profit_pct > 0 ? (
                                                <FiTrendingUp className="w-4 h-4 text-success-400" />
                                            ) : trader.profit_pct < 0 ? (
                                                <FiTrendingDown className="w-4 h-4 text-danger-400" />
                                            ) : (
                                                <FiMinus className="w-4 h-4" />
                                            )}
                                            <span className="text-sm">Profit</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Info */}
                <p className="text-center text-dark-500 text-sm mt-8">
                    Leaderboard updates in real-time based on trading performance.
                    Only traders with active or completed challenges are shown.
                </p>
            </div>
        </div>
    )
}
