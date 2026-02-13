import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlowButton } from '../components/ui/GlowButton';
import { Shield, ChevronRight } from 'lucide-react';
import { Spotlight, SpotlightCard } from '../components/ui/spotlight';

export const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        role: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Connect to auth logic here
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden px-6 bg-black font-sans selection:bg-blue-500/30">
            {/* Ambient background */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl relative z-10"
            >
                <SpotlightCard className="w-full bg-black/40 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 p-0 h-auto items-stretch">
                    {/* Left Side: Summary / Testimonials */}
                    <div className="p-12 bg-white/[0.02] border-r border-white/5 hidden md:flex flex-col justify-between h-full">
                        <div>
                            <div className="inline-flex items-center gap-2 text-blue-400 font-semibold mb-6">
                                <Shield size={20} />
                                <span>Enterprise Grade</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 leading-tight text-white">
                                Join the Industrial Revolution.
                            </h2>
                            <p className="text-white/50 leading-relaxed">
                                Start monitoring your distributed infrastructure with AI-powered insights today.
                            </p>
                        </div>

                        <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/5">
                            <p className="italic text-white/70 mb-4">"AlerionAI transformed how we manage our turbine fleet. Downtime reduced by 40% in just two months."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-700" />
                                <div>
                                    <p className="text-sm font-semibold text-white">David K.</p>
                                    <p className="text-xs text-white/40">VP Engineering, EnerTech</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="p-8 md:p-12 w-full">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/70 uppercase">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/70 uppercase">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    >
                                        <option value="" disabled className="bg-black">Select Role</option>
                                        <option value="engineer" className="bg-black">Engineer</option>
                                        <option value="manager" className="bg-black">Manager</option>
                                        <option value="executive" className="bg-black">Executive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/70 uppercase">Work Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/70 uppercase">Company Name</label>
                                <input
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    placeholder="Acme Industries"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/70 uppercase">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/70 uppercase">Confirm</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <GlowButton className="w-full justify-center group">
                                    Create Account <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </GlowButton>
                            </div>

                            <p className="text-center text-xs text-white/40 mt-6">
                                Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Log in</Link>
                            </p>
                        </form>
                    </div>
                </SpotlightCard>
            </motion.div>
        </div>
    );
};
