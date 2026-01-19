import React, { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

export default function TradingChart({ data, symbol, height = 400 }) {
    const chartContainerRef = useRef(null)
    const chartRef = useRef(null)
    const seriesRef = useRef(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: '#1e293b' },
                horzLines: { color: '#1e293b' },
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#0ea5e9',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#0ea5e9',
                },
                horzLine: {
                    color: '#0ea5e9',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#0ea5e9',
                },
            },
            rightPriceScale: {
                borderColor: '#334155',
            },
            timeScale: {
                borderColor: '#334155',
                timeVisible: true,
                secondsVisible: false,
            },
        })

        // Create candlestick series
        const candleSeries = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderUpColor: '#22c55e',
            borderDownColor: '#ef4444',
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        })

        chartRef.current = chart
        seriesRef.current = candleSeries

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [height])

    // Update data
    useEffect(() => {
        if (seriesRef.current && data && data.length > 0) {
            seriesRef.current.setData(data)
            chartRef.current?.timeScale().fitContent()
        }
    }, [data])

    return (
        <div className="relative">
            <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-dark-800/90 rounded-lg border border-dark-700">
                <span className="text-sm font-semibold text-white">{symbol}</span>
            </div>
            <div ref={chartContainerRef} className="w-full" />
        </div>
    )
}
