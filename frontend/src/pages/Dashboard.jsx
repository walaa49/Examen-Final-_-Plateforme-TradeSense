import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FiDollarSign, FiTrendingUp, FiTarget, FiAlertTriangle,
    FiRefreshCw, FiActivity
} from 'react-icons/fi'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import { RuleProgress } from '../components/ui/Progress'
import TradingChart from '../components/TradingChart'
import OrderPanel from '../components/OrderPanel'
import SignalsPanel from '../components/SignalsPanel'
import TradesTable from '../components/TradesTable'
import LiveIndicator from '../components/LiveIndicator'
import AIAdvisor from '../components/AIAdvisor'
import LiveTradingWidget from '../components/LiveTradingWidget'
import CalendarWidget from '../components/CalendarWidget'
import { SkeletonCard } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import { challengesAPI, tradesAPI } from '../services/api'
import { useMarketData } from '../hooks/useMarketData'
import toast from 'react-hot-toast'

const SYMBOLS = [
    { value: 'BTC-USD', label: 'Bitcoin', category: 'Crypto' },
    { value: 'ETH-USD', label: 'Ethereum', category: 'Crypto' },
    { value: 'AAPL', label: 'Apple', category: 'Stocks' },
    { value: 'TSLA', label: 'Tesla', category: 'Stocks' },
    { value: 'GOOGL', label: 'Google', category: 'Stocks' },
    { value: 'IAM', label: 'Maroc Telecom', category: 'Morocco' },
    { value: 'ATW', label: 'Attijariwafa', category: 'Morocco' },
]

export default function Dashboard() {
    const [challenge, setChallenge] = useState(null)
    const [trades, setTrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSymbol, setSelectedSymbol] = useState('BTC-USD')

    const { quote, series, loading: marketLoading, isLive, lastUpdate, refresh } = useMarketData(selectedSymbol, 15000)

    useEffect(() => {
        fetchChallenge()
    }, [])

    const fetchChallenge = async () => {
        try {
            const response = await challengesAPI.getActive()
            setChallenge(response.data.challenge)

            if (response.data.challenge) {
                fetchTrades(response.data.challenge.id)
            }
        } catch (error) {
            console.error('Failed to fetch challenge:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTrades = async (challengeId) => {
        try {
            const response = await tradesAPI.getByChallenge(challengeId)
            setTrades(response.data.trades)
        } catch (error) {
            console.error('Failed to fetch trades:', error)
        }
    }

    const handleTradeExecuted = useCallback((data) => {
        setChallenge(data.challenge)
        setTrades(prev => [data.trade, ...prev])
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        )
    }

    if (!challenge) {
        return (
            <div className="min-h-screen pt-24 pb-10 flex items-center justify-center">
                <Card className="text-center max-w-md mx-4">
                    <FiTarget className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No Active Challenge</h2>
                    <p className="text-dark-400 mb-6">
                        Start a trading challenge to access the dashboard and begin trading.
                    </p>
                    <Link to="/pricing">
                        <Button>Start a Challenge</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    const pnlPct = challenge.pnl_pct || 0
    const dailyPnl = 0 // Would come from daily_metrics in a full implementation

    const getStatusBadge = () => {
        switch (challenge.status) {
            case 'passed':
                return <Badge variant="success">FUNDED</Badge>
            case 'failed':
                return <Badge variant="danger">FAILED</Badge>
            default:
                return <Badge variant="primary">ACTIVE</Badge>
        }
    }

    return (
        <div className="min-h-screen pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Trading Dashboard</h1>
                            {getStatusBadge()}
                        </div>
                        <p className="text-dark-400">
                            {challenge.plan?.name || 'Challenge'} • Started {new Date(challenge.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <LiveIndicator isLive={isLive} lastUpdate={lastUpdate} />
                        <button
                            onClick={refresh}
                            className="p-2 bg-dark-800 rounded-lg text-dark-400 hover:text-white transition-colors"
                        >
                            <FiRefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Equity"
                        value={challenge.equity}
                        prefix=""
                        suffix=" DH"
                        icon={FiDollarSign}
                        changeType={pnlPct >= 0 ? 'positive' : 'negative'}
                        change={`${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`}
                    />
                    <StatCard
                        title="Start Balance"
                        value={challenge.start_balance}
                        suffix=" DH"
                        icon={FiActivity}
                    />
                    <StatCard
                        title="Total P&L"
                        value={challenge.pnl}
                        prefix={challenge.pnl >= 0 ? '+' : ''}
                        suffix=" DH"
                        icon={FiTrendingUp}
                        changeType={challenge.pnl >= 0 ? 'positive' : 'negative'}
                    />
                    <StatCard
                        title="Trades"
                        value={trades.length}
                        icon={FiTarget}
                    />
                </div>

                {/* Rules Progress */}
                <Card className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Challenge Rules</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <RuleProgress
                            title="Daily Loss Limit"
                            current={Math.min(dailyPnl, 0)}
                            limit={-5}
                        />
                        <RuleProgress
                            title="Max Drawdown"
                            current={Math.min(pnlPct, 0)}
                            limit={-10}
                        />
                        <RuleProgress
                            title="Profit Target"
                            current={Math.max(pnlPct, 0)}
                            limit={10}
                            variant="success"
                        />
                    </div>
                </Card>

                {/* Main Trading Area */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Chart & Symbol Selector */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Symbol Selector */}
                        <Card>
                            <div className="flex flex-wrap gap-2">
                                {SYMBOLS.map((sym) => (
                                    <button
                                        key={sym.value}
                                        onClick={() => setSelectedSymbol(sym.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSymbol === sym.value
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-dark-800 text-dark-300 hover:text-white'
                                            }`}
                                    >
                                        {sym.value}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Price Display */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedSymbol}</h2>
                                    <p className="text-dark-400">
                                        {SYMBOLS.find(s => s.value === selectedSymbol)?.label}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-mono font-bold text-white">
                                        ${quote?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                                    </p>
                                    <p className={`text-sm font-medium ${(quote?.change_pct || 0) >= 0 ? 'text-success-400' : 'text-danger-400'
                                        }`}>
                                        {(quote?.change_pct || 0) >= 0 ? '+' : ''}{(quote?.change_pct || 0).toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            {/* Chart */}
                            {series.length > 0 ? (
                                <TradingChart data={series} symbol={selectedSymbol} height={350} />
                            ) : (
                                <div className="h-[350px] bg-dark-800 rounded-xl flex items-center justify-center">
                                    <p className="text-dark-400">
                                        {marketLoading ? 'Loading chart...' : 'No chart data available for this symbol'}
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Live Bot Widget */}
                        <LiveTradingWidget />

                        {/* Order Panel */}
                        <OrderPanel
                            challengeId={challenge.id}
                            symbol={selectedSymbol}
                            price={quote?.price}
                            onTradeExecuted={handleTradeExecuted}
                        />

                        {/* AI Advisor */}
                        <AIAdvisor
                            symbol={selectedSymbol}
                            currentPrice={quote?.price}
                        />

                        {/* AI Signals */}
                        <SignalsPanel symbol={selectedSymbol} />

                        {/* Economic Calendar */}
                        <CalendarWidget />
                    </div>
                </div>

                {/* Trades Table */}
                <TradesTable trades={trades} />
            </div>
        </div>
    )
}
