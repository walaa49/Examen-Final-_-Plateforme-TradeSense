import React from 'react'
import { FiWifi, FiWifiOff } from 'react-icons/fi'

export default function LiveIndicator({ isLive, lastUpdate }) {
    const formatTime = (date) => {
        if (!date) return '--:--'
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isLive
                ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                : 'bg-danger-500/20 text-danger-400 border border-danger-500/30'
            }`}>
            {isLive ? (
                <>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                    </span>
                    <FiWifi className="w-3 h-3" />
                    <span>Live</span>
                </>
            ) : (
                <>
                    <FiWifiOff className="w-3 h-3" />
                    <span>Offline</span>
                </>
            )}
            {lastUpdate && (
                <span className="text-dark-400 ml-1">
                    {formatTime(lastUpdate)}
                </span>
            )}
        </div>
    )
}
