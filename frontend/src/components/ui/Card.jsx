import React from 'react'

export default function Card({
    children,
    className = '',
    hover = false,
    glow = false,
    ...props
}) {
    const baseClass = hover ? 'card-hover' : 'card'
    const glowClass = glow ? 'animate-glow' : ''

    return (
        <div
            className={`${baseClass} ${glowClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-xl font-semibold text-white ${className}`}>
            {children}
        </h3>
    )
}

export function CardDescription({ children, className = '' }) {
    return (
        <p className={`text-dark-400 text-sm mt-1 ${className}`}>
            {children}
        </p>
    )
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`mt-4 pt-4 border-t border-dark-700 ${className}`}>
            {children}
        </div>
    )
}
