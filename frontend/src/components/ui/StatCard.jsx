import React from 'react'

export default function StatCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    prefix = '',
    suffix = '',
    className = '',
}) {
    const getChangeColor = () => {
        if (changeType === 'positive') return 'text-success-400'
        if (changeType === 'negative') return 'text-danger-400'
        return 'text-dark-400'
    }

    return (
        <div className={`card ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-dark-400 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 ${getChangeColor()}`}>
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-primary-500/10 rounded-xl">
                        <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                )}
            </div>
        </div>
    )
}
