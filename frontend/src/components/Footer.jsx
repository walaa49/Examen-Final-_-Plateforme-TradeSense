import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        Product: [
            { label: 'Pricing', href: '/pricing' },
            { label: 'Leaderboard', href: '/leaderboard' },
            { label: 'Calendar', href: '/calendar' },
            { label: 'Dashboard', href: '/dashboard' },
        ],
        Company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '#' },
            { label: 'Contact', href: '/contact' },
        ],
        Legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Risk Disclosure', href: '#' },
        ],
    }

    return (
        <footer className="bg-dark-900 border-t border-dark-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">T</span>
                            </div>
                            <span className="text-xl font-bold font-display gradient-text">
                                TradeSense
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-dark-400">
                            Morocco's premier prop trading platform. Start your funded trading journey today.
                        </p>
                        <div className="mt-6 space-y-2 text-xs text-dark-500">
                            <p>📍 Casablanca, Morocco</p>
                            <p>📧 walaa221allam@gmail.com</p>
                            <p>📞 +212 617 929 719</p>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-dark-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-dark-500">
                        © {currentYear} TradeSense. All rights reserved.
                    </p>
                    <p className="text-xs text-dark-600">
                        Trading involves significant risk. Past performance does not guarantee future results.
                    </p>
                </div>
            </div>
        </footer>
    )
}
