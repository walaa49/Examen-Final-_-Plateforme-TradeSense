import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock } from 'react-icons/fi'
import Card from './ui/Card'
import { marketAPI } from '../services/api'

export default function CalendarWidget() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await marketAPI.getCalendar(5, 'High')
                setEvents(response.data)
            } catch (error) {
                console.error("Failed to fetch calendar:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const getImpactColor = (impact) => {
        switch (impact.toLowerCase()) {
            case 'high': return 'bg-danger-500 shadow-lg shadow-danger-500/50'
            case 'medium': return 'bg-warning-500 shadow-lg shadow-warning-500/50'
            default: return 'bg-success-500' // Low
        }
    }

    if (loading) return (
        <Card className="animate-pulse h-48 flex items-center justify-center">
            <div className="flex items-center gap-2 text-dark-400">
                <FiClock className="animate-spin" /> Loading Events...
            </div>
        </Card>
    )

    if (events.length === 0) return (
        <Card className="h-48 flex items-center justify-center">
            <p className="text-dark-400">No high impact events soon.</p>
        </Card>
    )

    return (
        <Card className="border-t-4 border-t-accent-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FiCalendar className="text-accent-400" />
                    <h3 className="font-bold text-white">Upcoming Events</h3>
                </div>
                <span className="text-xs text-danger-400 font-bold px-2 py-1 bg-danger-500/10 rounded-md border border-danger-500/20">
                    High Impact
                </span>
            </div>

            <div className="space-y-3">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`w-2 h-2 rounded-full ${getImpactColor(event.impact)}`}></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">
                                    {event.currency}
                                </div>
                                <div className="text-xs text-dark-400 font-mono">{event.time}</div>
                            </div>
                        </div>
                        <div className="text-right flex-1 ml-4 truncate">
                            <div className="text-sm text-dark-200 truncate" title={event.event}>
                                {event.event}
                            </div>
                            <div className="text-xs text-dark-500">
                                Fcst: {event.forecast || '-'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Card>
    )
}
