import { motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME } from '../../utils/constants';
import { LogOut, Activity } from 'lucide-react';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-16 border-b border-border bg-surface/80 backdrop-blur-sm fixed top-0 w-full z-50 flex items-center justify-between px-6"
        >
            <div className="flex items-center gap-8">
                <Link to={user ? '/app' : '/'} className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <Activity size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-text-primary tracking-tight">{APP_NAME}</span>
                </Link>

                {!user && (
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { to: '/about', label: 'About' },
                            { to: '/docs', label: 'Documentation' },
                        ].map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'text-accent bg-accent-light'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}

                {user && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-success-light border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-medium text-success">System Live</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-text-primary">{user.name}</p>
                                <p className="text-xs text-text-muted">{user.email}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-accent-light border border-border flex items-center justify-center text-sm font-semibold text-accent">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};
