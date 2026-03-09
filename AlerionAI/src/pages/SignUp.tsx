import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClass =
        'w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors';

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl"
            >
                <Card className="overflow-hidden p-0 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Panel */}
                        <div className="p-10 bg-surface-alt border-r border-border-light hidden md:flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 text-accent font-semibold mb-5">
                                    <Shield size={18} />
                                    <span className="text-sm">Enterprise Grade</span>
                                </div>
                                <h2 className="text-2xl font-bold text-text-primary mb-3 leading-snug">
                                    Join the Industrial Revolution.
                                </h2>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    Start monitoring your distributed infrastructure with AI-powered insights today.
                                </p>
                            </div>

                            <div className="mt-10 p-5 bg-surface rounded-xl border border-border">
                                <p className="italic text-text-secondary text-sm mb-3 leading-relaxed">
                                    "AlerionAI transformed how we manage our turbine fleet. Downtime reduced by 40% in just two months."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-xs font-semibold text-accent">
                                        D
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">David K.</p>
                                        <p className="text-xs text-text-muted">VP Engineering, EnerTech</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Form */}
                        <div className="p-8 md:p-10">
                            <h3 className="text-xl font-bold text-text-primary mb-6">Create your account</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">Full Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">Role</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="" disabled>Select Role</option>
                                            <option value="engineer">Engineer</option>
                                            <option value="manager">Manager</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-primary">Work Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-primary">Company Name</label>
                                    <input
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Acme Industries"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">Confirm</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="w-full">
                                        Create Account <ChevronRight size={16} />
                                    </Button>
                                </div>

                                <p className="text-center text-xs text-text-muted mt-4">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
                                        Log in
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};
