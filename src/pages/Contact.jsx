import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiPhone, FiSend, FiGlobe } from 'react-icons/fi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formState, setFormState] = useState({ name: '', email: '', message: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Mock submission delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success('Message sent! We will get back to you shortly.')
        setIsSubmitting(false)
        setFormState({ name: '', email: '', message: '' })
    }

    return (
        <div className="pt-24 pb-20 min-h-screen relative overflow-hidden">
            {/* Background Map Visual (Abstract) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none hidden md:block">
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-contain bg-center opacity-30 blur-sm" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-4">
                        Get in <span className="gradient-text">Touch</span>
                    </h1>
                    <p className="text-dark-400 max-w-2xl mx-auto text-lg">
                        Have questions about our challenges or funding model? Our team is ready to help you succeed.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                    {/* Contact Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8 flex flex-col justify-center"
                    >
                        <div className="relative">
                            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-transparent opacity-50" />
                            <h2 className="text-2xl font-bold text-white mb-6">Global Headquarters</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-primary-500/10">
                                        <FiMapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Visit Us</h3>
                                        <p className="text-dark-400">Casablanca, Morocco</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-primary-500/10">
                                        <FiMail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Email Us</h3>
                                        <p className="text-dark-400">walaa221allam@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-primary-500/10">
                                        <FiPhone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Call Us</h3>
                                        <p className="text-dark-400">+212 617 929 719</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="p-8 md:p-10 border-t-4 border-t-primary-500 h-full backdrop-blur-xl bg-dark-900/80">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2 group">
                                    <label className="text-xs uppercase tracking-wider text-dark-400 font-bold group-focus-within:text-primary-400 transition-colors">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formState.name}
                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        className="w-full bg-transparent border-b border-dark-600 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-dark-600"
                                        placeholder="John Trader"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-xs uppercase tracking-wider text-dark-400 font-bold group-focus-within:text-primary-400 transition-colors">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        className="w-full bg-transparent border-b border-dark-600 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-dark-600"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-xs uppercase tracking-wider text-dark-400 font-bold group-focus-within:text-primary-400 transition-colors">Message</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formState.message}
                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-dark-600 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder-dark-600 resize-none"
                                        placeholder="How can we help you trade better?"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full group"
                                        disabled={isSubmitting}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <FiSend className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                    <p className="text-center text-xs text-dark-500 mt-4">
                                        We respect your privacy. No spam, ever.
                                    </p>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
