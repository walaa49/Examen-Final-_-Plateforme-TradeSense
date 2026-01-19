import React from 'react'

const variants = {
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    primary: 'badge-primary',
    default: 'badge bg-dark-700 text-dark-300 border border-dark-600',
}

export default function Badge({
    children,
    variant = 'default',
    className = '',
    ...props
}) {
    const variantClass = variants[variant] || variants.default

    return (
        <span className={`${variantClass} ${className}`} {...props}>
            {children}
        </span>
    )
}
