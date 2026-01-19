import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFilter, FiCalendar, FiClock, FiActivity } from 'react-icons/fi'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { marketAPI } from '../services/api'

export default function Calendar() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterImpact, setFilterImpact] = useState('All') // All, High, Medium, Low
    const [filterCurrency, setFilterCurrency] = useState('All') // All, USD, EUR, etc.

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch all, filter locally for speed in this view
                const response = await marketAPI.getCalendar()
                setEvents(response.data)
            } catch (error) {
                console.error("Failed to fetch calendar:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const filteredEvents = events.filter(e => {
        const impactMatch = filterImpact === 'All' || e.impact.toLowerCase() === filterImpact.toLowerCase()
        const currencyMatch = filterCurrency === 'All' || e.currency === filterCurrency
        return impactMatch && currencyMatch
    })

    const getImpactBadge = (impact) => {
        switch (impact.toLowerCase()) {
            case 'high': return <Badge variant="danger">High</Badge>
            case 'medium': return <Badge variant="warning">Med</Badge>
            case 'low': return <Badge variant="neutral">Low</Badge>
            default: return <Badge>{impact}</Badge>
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <FiCalendar className="text-primary-500" /> Economic Calendar
                        </h1>
                        <p className="text-dark-400">Keep track of market-moving economic events.</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        {['All', 'High', 'Medium', 'Low'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilterImpact(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterImpact === f
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-dark-800 text-dark-300 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="w-px h-8 bg-dark-700 mx-1"></div>
                        {['All', 'USD', 'EUR', 'GBP', 'JPY'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilterCurrency(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterCurrency === f
                                        ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/20'
                                        : 'bg-dark-800 text-dark-300 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="overflow-hidden p-0 bg-dark-900 border-dark-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-dark-800 border-b border-dark-700 text-left">
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Time</th>
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Cur</th>
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Imp</th>
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider w-1/3">Event</th>
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actual</th>
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Forecast</th>
                                    <th className="p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Previous</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="divide-y divide-dark-800"
                            >
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <motion.tr
                                            key={event.id}
                                            variants={item}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="p-4 text-sm text-dark-200 font-mono flex items-center gap-2">
                                                <FiClock className="text-dark-500" /> {event.time}
                                            </td>
                                            <td className="p-4">
                                                <span className="font-bold text-white bg-dark-800 px-2 py-1 rounded text-xs border border-dark-700">
                                                    {event.currency}
                                                </span>
                                            </td>
                                            <td className="p-4">{getImpactBadge(event.impact)}</td>
                                            <td className="p-4 text-sm text-white font-medium group-hover:text-primary-400 transition-colors">
                                                {event.event}
                                            </td>
                                            <td className={`p-4 text-sm font-mono ${event.actual ? 'text-white' : 'text-dark-500'}`}>
                                                {event.actual || '---'}
                                            </td>
                                            <td className="p-4 text-sm font-mono text-dark-300">{event.forecast}</td>
                                            <td className="p-4 text-sm font-mono text-dark-400">{event.previous}</td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-dark-400">
                                            No events match your filters.
                                        </td>
                                    </tr>
                                )}
                            </motion.tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
