import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import Button from '../components/ui/Button'
import TickerStrip from '../components/TickerStrip'
import Hero3DScene from '../components/Hero3DScene'
import { FiTrendingUp, FiShield, FiCpu, FiGlobe, FiTarget, FiZap, FiCheckCircle } from 'react-icons/fi'

// --- Components ---

const TypewriterText = ({ text, delay = 0 }) => {
    const letters = Array.from(text)
    const container = { hidden: { opacity: 0 }, visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } }) }
    const child = { visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } }, hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 200 } } }
    return (
        <motion.span variants={container} initial="hidden" animate="visible" className="inline-block">
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className="inline-block whitespace-pre">
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    )
}

const HolographicCard = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ rotateX: 45, opacity: 0, y: 50 }}
            whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            className="h-full"
        >
            <Tilt
                glareEnable={true}
                glareMaxOpacity={0.4}
                glareColor="#00f2ff"
                glarePosition="all"
                glareBorderRadius="24px"
                scale={1.05}
                transitionSpeed={2000}
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                className="h-full"
            >
                <div className={`relative group h-full overflow-hidden rounded-3xl bg-dark-800/50 backdrop-blur-xl border border-white/10 ${className}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 p-8 h-full">{children}</div>
                </div>
            </Tilt>
        </motion.div>
    )
}

export default function Landing() {
    return (
        <div className="overflow-hidden bg-white dark:bg-dark-950 transition-colors duration-300">
            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <React.Suspense fallback={<div className="absolute inset-0 bg-white dark:bg-dark-950" />}>
                    <Hero3DScene />
                </React.Suspense>

                {/* Hero Glow Background Fallback */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 blur-[120px] rounded-full -z-10" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-md">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 tracking-widest uppercase">Next-Gen Prop Trading Ecosystem</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter font-display text-dark-900 dark:text-white">
                        Master the <span className="gradient-text">Markets</span><br />
                        <div className="h-[1.2em]"><TypewriterText text="With AI Intelligence" delay={0.5} /></div>
                    </h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto mb-12">
                        Access institutional-grade capital and AI analytical power. Prove your skills and keep up to <span className="text-dark-900 dark:text-white font-bold">80% of the profits</span>.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/pricing"
                            className="btn-primary text-lg px-12 py-5 rounded-full shadow-2xl shadow-primary-500/20 inline-flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Get Funded Now
                        </Link>
                        <Link to="/about"><Button variant="secondary" className="text-lg px-12 py-5 rounded-full border-dark-200 dark:border-white/10 dark:text-white text-dark-900">How it Works</Button></Link>
                    </div>
                </div>
            </section>

            <TickerStrip />

            {/* --- FEATURES BENTO GRID --- */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold text-dark-900 dark:text-white mb-6">Unfair <span className="text-primary-500 dark:text-primary-400">Advantage</span></h2>
                        <p className="text-dark-600 dark:text-dark-400 text-lg max-w-2xl mx-auto">We don't just give you money. We give you the tools, the insights, and the technology to dominate.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
                        <div className="md:col-span-8 md:row-span-2">
                            <HolographicCard className="!p-12 flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-500 dark:text-primary-400 mb-8 border border-primary-500/30"><FiCpu className="w-10 h-10" /></div>
                                    <h3 className="text-4xl font-bold text-white mb-6">Interactive AI Advisor</h3>
                                    <p className="text-dark-300 text-xl max-w-lg leading-relaxed">Chat with our proprietary LLM that analyzes multiple timeframes, sentiment, and volume in real-time. It's like having a senior quant by your side 24/7.</p>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <div className="px-4 py-2 bg-success-500/10 rounded-lg border border-success-500/20 text-success-500 dark:text-success-400 font-mono text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" /> LIVE ANALYSIS ACTIVE
                                    </div>
                                </div>
                            </HolographicCard>
                        </div>
                        <div className="md:col-span-4 md:row-span-1">
                            <HolographicCard delay={0.2}><FiZap className="w-10 h-10 text-yellow-400 mb-6" /><h3 className="text-2xl font-bold text-white mb-3">Ultra-Fast Payouts</h3><p className="text-dark-400">Receive your profit share in under 24 hours via Crypto or Local Bank Transfer in Morocco.</p></HolographicCard>
                        </div>
                        <div className="md:col-span-4 md:row-span-1">
                            <HolographicCard delay={0.4}><FiGlobe className="w-10 h-10 text-accent-400 mb-6" /><h3 className="text-2xl font-bold text-white mb-3">Global Markets</h3><p className="text-dark-400">Trade everything from US Tech Stocks and Crypto to the Casablanca Stock Exchange.</p></HolographicCard>
                        </div>
                        <div className="md:col-span-4 md:row-span-1">
                            <HolographicCard delay={0.6}><FiTarget className="w-10 h-10 text-danger-400 mb-6" /><h3 className="text-2xl font-bold text-white mb-3">Hybrid Execution</h3><p className="text-dark-400">Combine your strategy with our automated bot logic for perfect entry precision.</p></HolographicCard>
                        </div>
                        <div className="md:col-span-8 md:row-span-1">
                            <HolographicCard delay={0.8} className="flex items-center justify-between">
                                <div className="max-w-md"><FiShield className="w-12 h-12 text-success-400 mb-6" /><h3 className="text-3xl font-bold text-white mb-3">Zero Risk to You</h3><p className="text-dark-400 text-lg">We cover 100% of the losses. You only pay for the challenge, and we provide the professional environment.</p></div>
                                <div className="hidden lg:block text-8xl opacity-10">🏢</div>
                            </HolographicCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-40 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 blur-[150px] rounded-full" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
                    <h2 className="text-5xl md:text-8xl font-bold text-dark-900 dark:text-white mb-10 tracking-tighter">Join the <span className="gradient-text">Elite.</span></h2>
                    <Link
                        to="/pricing"
                        className="btn-primary text-2xl px-16 py-8 rounded-full shadow-2xl shadow-primary-500/40 inline-flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Your Journey
                    </Link>
                </motion.div>
            </section>

            <div className="bg-dark-900 py-4 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-10 text-[10px] text-dark-500 font-mono tracking-widest uppercase">
                    <div>📍 CASABLANCA, MOROCCO</div>
                    <div>📞 +212 617 929 719</div>
                    <div>📧 WALAA221ALLAM@GMAIL.COM</div>
                </div>
            </div>
        </div>
    )
}
