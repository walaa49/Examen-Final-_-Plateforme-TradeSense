import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import Badge from './ui/Badge'

export default function TradesTable({ trades = [], loading = false }) {
    if (loading) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-dark-700 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!trades || trades.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
                <div className="text-center py-8">
                    <p className="text-dark-400">No trades yet</p>
                    <p className="text-sm text-dark-500 mt-1">Execute your first trade to get started</p>
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
            <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-dark-400 border-b border-dark-700">
                            <th className="pb-3 font-medium">Symbol</th>
                            <th className="pb-3 font-medium">Side</th>
                            <th className="pb-3 font-medium">Qty</th>
                            <th className="pb-3 font-medium">Price</th>
                            <th className="pb-3 font-medium">PnL</th>
                            <th className="pb-3 font-medium">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade, index) => (
                            <motion.tr
                                key={trade.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-dark-800 last:border-0"
                            >
                                <td className="py-3">
                                    <span className="font-medium text-white">{trade.symbol}</span>
                                </td>
                                <td className="py-3">
                                    <Badge variant={trade.side === 'buy' ? 'success' : 'danger'}>
                                        {trade.side === 'buy' ? (
                                            <FiTrendingUp className="inline mr-1 w-3 h-3" />
                                        ) : (
                                            <FiTrendingDown className="inline mr-1 w-3 h-3" />
                                        )}
                                        {trade.side.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="py-3">
                                    <span className="text-dark-300 font-mono">{trade.qty}</span>
                                </td>
                                <td className="py-3">
                                    <span className="text-white font-mono">
                                        ${trade.price?.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <span className={`font-mono font-medium ${trade.pnl >= 0 ? 'text-success-400' : 'text-danger-400'
                                        }`}>
                                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl?.toFixed(2)} DH
                                    </span>
                                </td>
                                <td className="py-3">
                                    <span className="text-dark-400 text-sm">
                                        {new Date(trade.executed_at).toLocaleTimeString()}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}
