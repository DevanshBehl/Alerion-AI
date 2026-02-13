import { motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { StatusIndicator } from '../ui/StatusIndicator';
import { APP_NAME } from '../../utils/constants';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6"
        >
            <div className="flex items-center gap-8">
                <Link to={user ? "/app" : "/"} className="flex items-center  group">
                    <img src="/logo.png" alt="Alerion AI Logo" className="w-[4.5rem] h-[4.5rem] object-contain hover:bg-slate-200 rounded-lg transition-colors" />
                    <span className="font-bold text-lg tracking-tight group-hover:text-white/90 transition-colors">{APP_NAME}</span>
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
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}

                {user && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <StatusIndicator status="normal" showLabel={false} />
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">System Live</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-white/40">{user.email}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 flex items-center justify-center text-xs font-semibold">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};
