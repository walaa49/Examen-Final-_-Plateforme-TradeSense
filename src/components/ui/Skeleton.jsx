import React from 'react'

export default function Skeleton({
    className = '',
    width,
    height,
    rounded = 'rounded-lg',
}) {
    const style = {
        width: width || '100%',
        height: height || '1rem',
    }

    return (
        <div
            className={`bg-dark-700 animate-pulse ${rounded} ${className}`}
            style={style}
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="card space-y-4">
            <Skeleton height="1.5rem" width="60%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="80%" />
            <div className="flex gap-2 mt-4">
                <Skeleton height="2.5rem" width="6rem" rounded="rounded-xl" />
                <Skeleton height="2.5rem" width="6rem" rounded="rounded-xl" />
            </div>
        </div>
    )
}

export function SkeletonTable({ rows = 5 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-dark-800/50 rounded-lg">
                    <Skeleton width="3rem" height="1rem" />
                    <Skeleton width="8rem" height="1rem" />
                    <Skeleton width="6rem" height="1rem" />
                    <Skeleton width="4rem" height="1rem" />
                </div>
            ))}
        </div>
    )
}

export function SkeletonChart() {
    return (
        <div className="card">
            <div className="flex justify-between items-center mb-4">
                <Skeleton width="8rem" height="1.5rem" />
                <Skeleton width="6rem" height="2rem" rounded="rounded-lg" />
            </div>
            <Skeleton height="300px" rounded="rounded-lg" />
        </div>
    )
}
