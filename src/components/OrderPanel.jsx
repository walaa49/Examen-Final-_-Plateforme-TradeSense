import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import Button from './ui/Button'
import toast from 'react-hot-toast'
import { tradesAPI } from '../services/api'

export default function OrderPanel({
    challengeId,
    symbol,
    price,
    onTradeExecuted
}) {
    const [side, setSide] = useState('buy')
    const [qty, setQty] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!qty || parseFloat(qty) <= 0) {
            toast.error('Please enter a valid quantity')
            return
        }

        if (!challengeId) {
            toast.error('No active challenge')
            return
        }

        setLoading(true)
        try {
            const response = await tradesAPI.create({
                challenge_id: challengeId,
                symbol: symbol,
                side: side,
                qty: parseFloat(qty),
            })

            const { trade, challenge, rule_result } = response.data

            if (rule_result?.triggered) {
                if (rule_result.status === 'passed') {
                    toast.success('🎉 Congratulations! You passed the challenge!')
                } else if (rule_result.status === 'failed') {
                    toast.error(`Challenge failed: ${rule_result.triggered}`)
                }
            } else {
                toast.success(`${side.toUpperCase()} order executed at $${trade.price.toFixed(2)}`)
            }

            setQty('')
            if (onTradeExecuted) {
                onTradeExecuted(response.data)
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to execute trade')
        } finally {
            setLoading(false)
        }
    }

    const tradeValue = price && qty ? (price * parseFloat(qty || 0)).toFixed(2) : '0.00'

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Order Panel</h3>

            {/* Side Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setSide('buy')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${side === 'buy'
                            ? 'bg-success-500 text-white shadow-lg shadow-success-500/25'
                            : 'bg-dark-800 text-dark-400 hover:text-white'
                        }`}
                >
                    <FiTrendingUp className="inline-block mr-2" />
                    BUY
                </button>
                <button
                    onClick={() => setSide('sell')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${side === 'sell'
                            ? 'bg-danger-500 text-white shadow-lg shadow-danger-500/25'
                            : 'bg-dark-800 text-dark-400 hover:text-white'
                        }`}
                >
                    <FiTrendingDown className="inline-block mr-2" />
                    SELL
                </button>
            </div>

            {/* Symbol & Price */}
            <div className="bg-dark-800 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-dark-400 text-sm">Symbol</span>
                    <span className="text-white font-semibold">{symbol}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-dark-400 text-sm">Price</span>
                    <span className="text-white font-mono text-lg">
                        ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                    </span>
                </div>
            </div>

            {/* Quantity Input */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="label">Quantity</label>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        placeholder="Enter amount"
                        step="0.001"
                        min="0"
                        className="input"
                    />
                </div>

                {/* Trade Value */}
                <div className="bg-dark-800 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-dark-400 text-sm">Trade Value</span>
                        <span className="text-white font-mono font-semibold">
                            ${tradeValue}
                        </span>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    loading={loading}
                    disabled={!qty || !challengeId}
                    variant={side === 'buy' ? 'success' : 'danger'}
                    className="w-full"
                >
                    {side === 'buy' ? 'Buy' : 'Sell'} {symbol}
                </Button>
            </form>
        </div>
    )
}
