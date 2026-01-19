import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FiCreditCard, FiCheck, FiLoader, FiDollarSign,
    FiArrowRight
} from 'react-icons/fi'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { plansAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const planSlug = searchParams.get('plan') || 'starter'

    const [plan, setPlan] = useState(null)
    const [paypalEnabled, setPaypalEnabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [step, setStep] = useState('select') // select | processing | success

    useEffect(() => {
        fetchPlan()
    }, [planSlug])

    const fetchPlan = async () => {
        try {
            const response = await plansAPI.getPlans()
            const selectedPlan = response.data.plans.find(p => p.slug === planSlug)
            setPlan(selectedPlan)
            setPaypalEnabled(response.data.paypal_enabled)
        } catch (error) {
            toast.error('Failed to load plan')
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async (method) => {
        setProcessing(true)
        setStep('processing')

        try {
            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            await plansAPI.mockCheckout({
                plan_slug: planSlug,
                method: method,
            })

            setStep('success')

            // Redirect to dashboard after success
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        } catch (error) {
            setStep('select')
            toast.error(error.response?.data?.error || 'Payment failed')
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (!plan) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Card className="text-center p-8">
                    <h2 className="text-xl text-white mb-4">Plan not found</h2>
                    <Button onClick={() => navigate('/pricing')}>View Plans</Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Step: Select Payment */}
                    {step === 'select' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Complete Your Purchase</h1>
                                <p className="text-dark-400">Choose your preferred payment method</p>
                            </div>

                            {/* Plan Summary */}
                            <Card className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-dark-400">Plan</span>
                                        <span className="text-white font-medium">{plan.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-dark-400">Starting Balance</span>
                                        <span className="text-white">{plan.start_balance.toLocaleString()} DH</span>
                                    </div>
                                    <hr className="border-dark-700" />
                                    <div className="flex justify-between text-lg">
                                        <span className="text-white font-semibold">Total</span>
                                        <span className="text-primary-400 font-bold">{plan.price_dh} DH</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Payment Methods */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Payment Method</h3>

                                <button
                                    onClick={() => handlePayment('CMI')}
                                    disabled={processing}
                                    className="w-full p-4 bg-dark-800 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-colors flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                        <FiCreditCard className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-white font-medium">Pay with CMI</p>
                                        <p className="text-sm text-dark-400">Credit/Debit Card via CMI</p>
                                    </div>
                                    <FiArrowRight className="text-dark-400" />
                                </button>

                                <button
                                    onClick={() => handlePayment('CRYPTO')}
                                    disabled={processing}
                                    className="w-full p-4 bg-dark-800 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-colors flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">₿</span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-white font-medium">Pay with Crypto</p>
                                        <p className="text-sm text-dark-400">Bitcoin, Ethereum, USDT</p>
                                    </div>
                                    <FiArrowRight className="text-dark-400" />
                                </button>

                                {paypalEnabled && (
                                    <button
                                        onClick={() => handlePayment('PAYPAL')}
                                        disabled={processing}
                                        className="w-full p-4 bg-dark-800 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-colors flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-400 font-bold text-lg">P</span>
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="text-white font-medium">Pay with PayPal</p>
                                            <p className="text-sm text-dark-400">Fast and secure</p>
                                        </div>
                                        <FiArrowRight className="text-dark-400" />
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step: Processing */}
                    {step === 'processing' && (
                        <Card className="text-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="w-16 h-16 mx-auto mb-6"
                            >
                                <FiLoader className="w-16 h-16 text-primary-400" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
                            <p className="text-dark-400">Please wait while we process your payment...</p>
                        </Card>
                    )}

                    {/* Step: Success */}
                    {step === 'success' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <Card className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-6 bg-success-500/20 rounded-full flex items-center justify-center">
                                    <FiCheck className="w-10 h-10 text-success-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                                <p className="text-dark-400 mb-4">
                                    Your challenge has been activated. Good luck trading!
                                </p>
                                <p className="text-sm text-dark-500">Redirecting to dashboard...</p>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
