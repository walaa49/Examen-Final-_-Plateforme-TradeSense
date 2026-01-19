import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FiCheck, FiX, FiArrowRight, FiChevronDown,
    FiTarget, FiTrendingUp, FiDollarSign
} from 'react-icons/fi'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { plansAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Pricing() {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [openFaq, setOpenFaq] = useState(null)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        try {
            const response = await plansAPI.getPlans()
            setPlans(response.data.plans)
        } catch (error) {
            console.error('Failed to fetch plans:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectPlan = (slug) => {
        if (!isAuthenticated) {
            navigate('/auth', { state: { from: `/checkout?plan=${slug}` } })
        } else {
            navigate(`/checkout?plan=${slug}`)
        }
    }

    const rules = [
        { icon: FiTarget, label: 'Daily Loss Limit', value: '5%', note: 'Max equity drop per day' },
        { icon: FiTrendingUp, label: 'Max Drawdown', value: '10%', note: 'Overall loss limit' },
        { icon: FiDollarSign, label: 'Profit Target', value: '10%', note: 'To pass the challenge' },
    ]

    const faqs = [
        {
            q: 'What is a prop trading challenge?',
            a: 'A prop trading challenge is a way to prove your trading skills. You trade with virtual capital, and if you meet the profit targets while respecting risk limits, you get access to real funded capital.'
        },
        {
            q: 'How do I pass the challenge?',
            a: 'To pass, you need to reach a 10% profit target without exceeding the 5% daily loss limit or 10% total drawdown. Trade responsibly and consistently.'
        },
        {
            q: 'What happens after I pass?',
            a: 'Once you pass the challenge, you become a funded trader. You can trade with our capital and keep up to 80% of the profits you generate.'
        },
        {
            q: 'What markets can I trade?',
            a: 'You can trade cryptocurrencies (BTC, ETH), US stocks (AAPL, TSLA, etc.), and Moroccan stocks from the Casablanca Stock Exchange (IAM, ATW, etc.).'
        },
        {
            q: 'Is there a time limit?',
            a: 'There is no strict time limit. Take the time you need to reach your profit target, as long as you stay within the risk rules.'
        },
    ]

    return (
        <div className="pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Choose Your <span className="gradient-text">Challenge</span>
                        </h1>
                        <p className="text-dark-400 text-lg max-w-2xl mx-auto">
                            Select a plan that matches your goals. All plans include the same trading rules and features.
                        </p>
                    </motion.div>
                </div>

                {/* Rules Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {rules.map((rule, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-xl text-center"
                        >
                            <rule.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                            <p className="text-2xl font-bold text-white">{rule.value}</p>
                            <p className="text-white font-medium">{rule.label}</p>
                            <p className="text-sm text-dark-400">{rule.note}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-8 bg-dark-700 rounded w-1/2 mb-4" />
                                <div className="h-12 bg-dark-700 rounded w-1/3 mb-6" />
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="h-4 bg-dark-700 rounded" />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className={`relative ${plan.slug === 'pro'
                                            ? 'border-primary-500 shadow-xl shadow-primary-500/10'
                                            : ''
                                        }`}
                                >
                                    {plan.slug === 'pro' && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold rounded-full">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-dark-400 text-sm">Starting balance: {plan.start_balance.toLocaleString()} DH</p>
                                    </div>

                                    <div className="text-center mb-6">
                                        <span className="text-5xl font-bold text-white">{plan.price_dh}</span>
                                        <span className="text-dark-400 text-lg"> DH</span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features?.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-dark-300">
                                                <FiCheck className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => handleSelectPlan(plan.slug)}
                                        variant={plan.slug === 'pro' ? 'primary' : 'secondary'}
                                        className="w-full"
                                    >
                                        Get Started
                                        <FiArrowRight className="ml-2" />
                                    </Button>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full text-left"
                                >
                                    <Card className="hover:border-primary-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-white">{faq.q}</h3>
                                            <FiChevronDown
                                                className={`w-5 h-5 text-dark-400 transition-transform ${openFaq === index ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                        {openFaq === index && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 text-dark-400"
                                            >
                                                {faq.a}
                                            </motion.p>
                                        )}
                                    </Card>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
