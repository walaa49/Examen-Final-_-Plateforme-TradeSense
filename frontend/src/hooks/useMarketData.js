import { useState, useEffect, useCallback } from 'react'
import { marketAPI } from '../services/api'

export function useMarketData(symbol, interval = 30000) {
    const [quote, setQuote] = useState(null)
    const [series, setSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdate, setLastUpdate] = useState(null)

    const MOROCCO_SYMBOLS = ['IAM', 'ATW', 'BCP', 'LHM', 'CIH']

    const fetchQuote = useCallback(async () => {
        if (!symbol) return

        try {
            const isMorocco = MOROCCO_SYMBOLS.includes(symbol.toUpperCase())
            const response = isMorocco
                ? await marketAPI.getMoroccoQuote(symbol)
                : await marketAPI.getQuote(symbol)

            setQuote(response.data)
            setLastUpdate(new Date())
            setError(null)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch quote')
        }
    }, [symbol])

    // Generate demo candlestick data
    const generateDemoSeries = (symbol) => {
        const data = []
        const now = Math.floor(Date.now() / 1000)
        const hoursBack = 120 // 5 days of hourly data

        // Base price based on symbol
        let basePrice = 100
        if (symbol.includes('BTC')) basePrice = 45000
        else if (symbol.includes('ETH')) basePrice = 2500
        else if (symbol.includes('AAPL')) basePrice = 180
        else if (symbol.includes('TSLA')) basePrice = 250
        else if (symbol.includes('GOOGL')) basePrice = 140

        let currentPrice = basePrice

        for (let i = hoursBack; i >= 0; i--) {
            const time = now - (i * 3600) // hourly intervals

            // Random price movement
            const volatility = basePrice * 0.01 // 1% volatility
            const change = (Math.random() - 0.5) * volatility
            currentPrice += change

            const open = currentPrice
            const high = currentPrice + Math.random() * volatility * 0.5
            const low = currentPrice - Math.random() * volatility * 0.5
            const close = low + Math.random() * (high - low)

            data.push({
                time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2))
            })

            currentPrice = close
        }

        return data
    }

    const fetchSeries = useCallback(async () => {
        if (!symbol) return

        const isMorocco = MOROCCO_SYMBOLS.includes(symbol.toUpperCase())
        if (isMorocco) {
            // Morocco stocks don't have series data
            setSeries([])
            return
        }

        try {
            const response = await marketAPI.getSeries(symbol, '1h', '5d')
            const data = response.data.data || []

            if (data.length > 0) {
                setSeries(data)
            } else {
                console.warn('Empty series data - using demo data')
                setSeries(generateDemoSeries(symbol))
            }
        } catch (err) {
            console.error('Failed to fetch series - using demo data:', err)
            // Use demo data when API fails
            const demoData = generateDemoSeries(symbol)
            setSeries(demoData)
        }
    }, [symbol])

    const refresh = useCallback(async () => {
        setLoading(true)
        await Promise.all([fetchQuote(), fetchSeries()])
        setLoading(false)
    }, [fetchQuote, fetchSeries])

    // Initial fetch
    useEffect(() => {
        refresh()
    }, [symbol])

    // Polling interval
    useEffect(() => {
        if (!symbol || interval <= 0) return

        const timer = setInterval(fetchQuote, interval)
        return () => clearInterval(timer)
    }, [symbol, interval, fetchQuote])

    const isLive = lastUpdate && (Date.now() - lastUpdate.getTime()) < 60000

    return {
        quote,
        series,
        loading,
        error,
        lastUpdate,
        isLive,
        refresh,
    }
}

export function useMultipleQuotes(symbols, interval = 30000) {
    const [quotes, setQuotes] = useState({})
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)

    const fetchAllQuotes = useCallback(async () => {
        if (!symbols || symbols.length === 0) return

        const results = {}

        await Promise.all(
            symbols.map(async (symbol) => {
                try {
                    const response = await marketAPI.getQuote(symbol)
                    results[symbol] = response.data
                } catch (err) {
                    results[symbol] = { symbol, error: true }
                }
            })
        )

        setQuotes(results)
        setLastUpdate(new Date())
        setLoading(false)
    }, [symbols])

    useEffect(() => {
        fetchAllQuotes()
    }, [fetchAllQuotes])

    useEffect(() => {
        if (!symbols || symbols.length === 0 || interval <= 0) return

        const timer = setInterval(fetchAllQuotes, interval)
        return () => clearInterval(timer)
    }, [symbols, interval, fetchAllQuotes])

    return {
        quotes,
        loading,
        lastUpdate,
        refresh: fetchAllQuotes,
    }
}

export default useMarketData
