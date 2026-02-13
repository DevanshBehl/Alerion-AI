import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_NAME } from '../../utils/constants';

export const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-12 px-6 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-16">
                    <div className="mb-12 md:mb-0">
                        <h3 className="text-2xl font-medium tracking-tight">Experience Vulnerability Control</h3>
                    </div>

                    <div className="flex gap-24 text-sm font-medium">
                        <ul className="space-y-4">
                            <li><Link to="/download" className="hover:text-white/70 transition-colors">Download</Link></li>
                            <li><Link to="/features" className="hover:text-white/70 transition-colors">Product</Link></li>
                            <li><Link to="/docs" className="hover:text-white/70 transition-colors">Docs</Link></li>
                            <li><Link to="/changelog" className="hover:text-white/70 transition-colors">Changelog</Link></li>
                            <li><Link to="/press" className="hover:text-white/70 transition-colors">Press</Link></li>
                            <li><Link to="/releases" className="hover:text-white/70 transition-colors">Releases</Link></li>
                        </ul>
                        <ul className="space-y-4">
                            <li><Link to="/blog" className="hover:text-white/70 transition-colors">Blog</Link></li>
                            <li><Link to="/pricing" className="hover:text-white/70 transition-colors">Pricing</Link></li>
                            <li><Link to="/cases" className="hover:text-white/70 transition-colors">Use Cases</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Center Typography */}
                <div className="flex justify-center mb-16 overflow-hidden">
                    <motion.h1
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-[12vw] leading-none font-bold tracking-tighter text-center select-none flex"
                    >
                        {Array.from("Alerion AI").map((char, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: { y: "100%" },
                                    visible: { y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }
                                }}
                                className={char === " " ? "w-[4vw]" : ""}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.h1>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-8">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
                                A
                            </div>
                            <span className="font-bold text-lg tracking-tight">{APP_NAME}</span>
                        </div>
                    </div>

                    <div className="flex gap-6 text-xs text-white/60 font-medium">
                        <Link to="/about" className="hover:text-white transition-colors">About Alerion</Link>
                        <Link to="/features" className="hover:text-white transition-colors">Products</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
