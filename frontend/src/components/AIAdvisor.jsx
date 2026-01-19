import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCpu, FiSend, FiX, FiMessageSquare, FiMinimize2, FiMaximize2 } from 'react-icons/fi'
import Card from './ui/Card'
import Button from './ui/Button'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function AIChatAdvisor({ symbol }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: `Hello! I'm your AI Trading Assistant. I can help you analyze ${symbol || 'the market'} or answer trading questions. How can I help?`
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    // Update welcome message if symbol changes
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{
                id: 1,
                role: 'assistant',
                text: `Hello! I'm your AI Trading Assistant. Ready to analyze ${symbol || 'the market'}?`
            }])
        }
    }, [symbol])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg = { id: Date.now(), role: 'user', text: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const response = await aiAPI.chat({
                message: input,
                context: { symbol }
            })

            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: response.data.response
            }
            setMessages(prev => [...prev, aiMsg])
        } catch (error) {
            console.error('AI Chat failed:', error)
            toast.error('Failed to get response')
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: "I'm having trouble connecting to my brain right now. Please try again later.",
                isError: true
            }])
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="w-full p-4 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg border border-primary-400/30 flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <FiCpu className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-white font-bold">AI Assistant</h3>
                        <p className="text-primary-100 text-xs">Chat with AI Advisor</p>
                    </div>
                </div>
                <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                    <FiMessageSquare className="w-5 h-5 text-white" />
                </div>
            </motion.button>
        )
    }

    return (
        <Card className="flex flex-col h-[500px] p-0 overflow-hidden border-t-4 border-t-primary-500 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-dark-800 border-b border-dark-700">
                <div className="flex items-center gap-3">
                    <FiCpu className="w-5 h-5 text-primary-400" />
                    <div>
                        <h3 className="font-bold text-white text-sm">AI Trading Assistant</h3>
                        <p className="text-xs text-dark-400">Powered by Advanced LLM</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-dark-400 hover:text-white transition-colors"
                >
                    <FiMinimize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-tr-sm'
                                    : msg.isError
                                        ? 'bg-danger-500/20 text-danger-200 border border-danger-500/30'
                                        : 'bg-dark-700 text-dark-200 rounded-tl-sm border border-dark-600'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-dark-700 p-3 rounded-2xl rounded-tl-sm border border-dark-600 flex gap-1 items-center">
                            <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-dark-800 border-t border-dark-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about trends, levels, or strategy..."
                    className="flex-1 bg-dark-900 border border-dark-600 rounded-xl px-4 py-2 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-primary-900/20"
                >
                    <FiSend className={`w-4 h-4 ${loading ? 'opacity-0' : ''}`} />
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    )}
                </button>
            </form>
        </Card>
    )
}
