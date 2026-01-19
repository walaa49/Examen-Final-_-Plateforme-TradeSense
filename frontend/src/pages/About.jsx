import React from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiAward, FiGlobe, FiTrendingUp } from 'react-icons/fi'
import Card from '../components/ui/Card'

export default function About() {
    const stats = [
        { label: 'Traders Funded', value: 1200 },
        { label: 'Total Payouts', value: 50 }, // in Million
        { label: 'Countries', value: 12 },
    ]

    const team = [
        { name: 'Mehdi Telhaoui', role: 'CEO & Founder', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi' },
        { name: 'Sofia Bennani', role: 'Head of Trading', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
        { name: 'Omar Alami', role: 'Tech Lead', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar' },
    ]

    const values = [
        { icon: FiTrendingUp, title: 'Growth', desc: 'We grow when you grow. Our model is built on your success.' },
        { icon: FiAward, title: 'Excellence', desc: 'Providing world-class infrastructure for serious traders.' },
        { icon: FiUsers, title: 'Community', desc: 'A network of elite traders sharing knowledge and success.' },
    ]

    return (
        <div className="pt-24 pb-20 overflow-hidden">
            {/* Mission Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 mb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/20 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold font-display leading-tight mb-8"
                    >
                        Empowering <span className="gradient-text">African Traders</span> <br />
                        with Artificial Intelligence.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-dark-300 max-w-3xl mx-auto"
                    >
                        TradeSense is more than a prop firm. We are a technology company bridging the gap between talent and capital using advanced AI analytics.
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-4 sm:px-6 lg:px-8 mb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="glass p-8 rounded-2xl text-center border border-white/5 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h3 className="text-6xl font-bold text-white mb-2">
                                    {stat.value}{stat.label === 'Total Payouts' ? 'M+' : '+'}
                                </h3>
                                <p className="text-primary-400 font-medium uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="px-4 sm:px-6 lg:px-8 mb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Core Values</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
                                className="perspective-1000"
                            >
                                <Card className="h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 border-primary-500/20">
                                    <div className="w-14 h-14 bg-dark-800 rounded-xl flex items-center justify-center mb-6 text-primary-400">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-dark-400 leading-relaxed">{item.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}
