import React from 'react'
import { useMultipleQuotes } from '../hooks/useMarketData'

const TICKER_SYMBOLS = ['BTC-USD', 'ETH-USD', 'AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN']

export default function TickerStrip() {
    const { quotes, loading } = useMultipleQuotes(TICKER_SYMBOLS, 30000)

    if (loading) {
        return (
            <div className="bg-dark-900 border-y border-dark-800 py-3 overflow-hidden">
                <div className="flex animate-pulse gap-8">
                    {Array(7).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="h-4 w-16 bg-dark-700 rounded" />
                            <div className="h-4 w-20 bg-dark-700 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const tickerItems = Object.values(quotes).filter(q => !q.error)

    return (
        <div className="bg-dark-900/50 border-y border-dark-800 py-3 overflow-hidden">
            <div className="flex gap-8 whitespace-nowrap animate-ticker">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                    <TickerItem key={`${item.symbol}-${index}`} data={item} />
                ))}
            </div>
        </div>
    )
}

function TickerItem({ data }) {
    const isPositive = (data.change_pct || 0) >= 0

    return (
        <div className="flex items-center gap-3 px-4">
            <span className="text-sm font-semibold text-white">{data.symbol}</span>
            <span className="text-sm text-dark-300 font-mono">
                ${data.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-success-400' : 'text-danger-400'}`}>
                {isPositive ? '↑' : '↓'} {isPositive ? '+' : ''}{(data.change_pct || 0).toFixed(2)}%
            </span>
        </div>
    )
}
