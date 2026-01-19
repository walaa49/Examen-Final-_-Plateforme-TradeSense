import React from 'react'

export default function Progress({
    value = 0,
    max = 100,
    className = '',
    variant = 'primary',
    showLabel = false,
    label = '',
    size = 'md',
}) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const variants = {
        primary: 'bg-primary-500',
        success: 'bg-success-500',
        danger: 'bg-danger-500',
        warning: 'bg-yellow-500',
        gradient: 'bg-gradient-to-r from-primary-500 to-accent-500',
    }

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
    }

    const barColor = variants[variant] || variants.primary
    const barSize = sizes[size] || sizes.md

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-300">{label}</span>
                    <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
                </div>
            )}
            <div className={`w-full bg-dark-700 rounded-full overflow-hidden ${barSize}`}>
                <div
                    className={`${barColor} ${barSize} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export function RuleProgress({
    title,
    current,
    limit,
    variant = 'primary',
    inverted = false,
}) {
    // For rules like daily loss, we want to show how much of the limit is used
    const used = Math.abs(current)
    const limitAbs = Math.abs(limit)
    const percentage = Math.min((used / limitAbs) * 100, 100)

    // Change color based on how close to limit
    let color = variant
    if (percentage >= 80) color = 'danger'
    else if (percentage >= 60) color = 'warning'

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-400">{title}</span>
                <span className="text-white">
                    {current.toFixed(2)}% / {limit}%
                </span>
            </div>
            <Progress value={used} max={limitAbs} variant={color} size="sm" />
        </div>
    )
}
