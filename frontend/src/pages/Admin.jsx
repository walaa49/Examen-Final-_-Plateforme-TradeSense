import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSettings, FiSave, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Admin() {
    const [settings, setSettings] = useState({
        enabled: false,
        client_id: '',
        client_secret: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await adminAPI.getPayPalSettings()
            const data = response.data.settings
            setSettings({
                enabled: data.enabled || false,
                client_id: data.client_id || '',
                client_secret: '', // Don't show existing secret
            })
        } catch (error) {
            toast.error('Failed to load settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const payload = {
                enabled: settings.enabled,
                client_id: settings.client_id,
            }

            // Only send secret if it was changed
            if (settings.client_secret) {
                payload.client_secret = settings.client_secret
            }

            await adminAPI.updatePayPalSettings(payload)
            toast.success('PayPal settings updated successfully')
            setSettings(prev => ({ ...prev, client_secret: '' }))
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-primary-500/10 rounded-xl">
                            <FiSettings className="w-8 h-8 text-primary-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
                            <p className="text-dark-400">Manage platform configuration</p>
                        </div>
                    </div>

                    {/* PayPal Settings */}
                    <Card>
                        <h2 className="text-xl font-semibold text-white mb-6">PayPal Configuration</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Enable Toggle */}
                            <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                                <div>
                                    <p className="text-white font-medium">Enable PayPal Payments</p>
                                    <p className="text-sm text-dark-400">
                                        Show PayPal as a payment option on checkout
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${settings.enabled ? 'bg-success-500' : 'bg-dark-600'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.enabled ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Status Indicator */}
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${settings.enabled
                                    ? 'bg-success-500/10 border border-success-500/30'
                                    : 'bg-dark-800 border border-dark-700'
                                }`}>
                                {settings.enabled ? (
                                    <>
                                        <FiCheckCircle className="w-5 h-5 text-success-400" />
                                        <span className="text-success-400">PayPal is enabled</span>
                                    </>
                                ) : (
                                    <>
                                        <FiXCircle className="w-5 h-5 text-dark-400" />
                                        <span className="text-dark-400">PayPal is disabled</span>
                                    </>
                                )}
                            </div>

                            {/* Client ID */}
                            <div>
                                <label className="label">Client ID</label>
                                <input
                                    type="text"
                                    value={settings.client_id}
                                    onChange={(e) => setSettings(s => ({ ...s, client_id: e.target.value }))}
                                    placeholder="Enter PayPal Client ID"
                                    className="input"
                                />
                            </div>

                            {/* Client Secret */}
                            <div>
                                <label className="label">Client Secret</label>
                                <input
                                    type="password"
                                    value={settings.client_secret}
                                    onChange={(e) => setSettings(s => ({ ...s, client_secret: e.target.value }))}
                                    placeholder="Enter new secret (leave empty to keep existing)"
                                    className="input"
                                />
                                <p className="text-xs text-dark-500 mt-1">
                                    Leave empty to keep the existing secret
                                </p>
                            </div>

                            {/* Submit */}
                            <Button type="submit" loading={saving} className="w-full">
                                <FiSave className="mr-2" />
                                Save Settings
                            </Button>
                        </form>
                    </Card>

                    {/* Info */}
                    <p className="text-center text-dark-500 text-sm mt-8">
                        Changes take effect immediately. Make sure to test the payment flow after updating.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
