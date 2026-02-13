import { motion } from 'framer-motion';
import { Spotlight, SpotlightCard } from '../components/ui/spotlight';

const TEAM = [
    {
        name: 'Devansh Behl',
        role: 'Lead Full Stack Engineer',
        bio: 'Computer Science student at Vellore Institute of Technology. Architecting scalable distributed systems and realtime interfaces.',
        focus: 'System Architecture'
    },
    {
        name: 'Lay Gupta',
        role: 'Backend & ML Engineer',
        bio: 'Student at Vellore Institute of Technology. Specialist in Kafka event streaming and predictive anomaly detection models.',
        focus: 'Machine Learning'
    },
    {
        name: 'Madhur Tiwari',
        role: 'Frontend & UI/UX Designer',
        bio: 'Student at Vellore Institute of Technology. Crafting pixel-perfect, interactive experiences for complex industrial data.',
        focus: 'UI/UX Engineering'
    },
];

export const About = () => {
    return (
        <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto min-h-screen relative overflow-hidden">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            {/* Mission Section */}
            <section className="text-center mb-24 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
                >
                    Building the Nervous System <br />
                    of <span className="text-blue-500">Industry 4.0</span>
                </motion.h1>
                <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
                    We believe that the future of manufacturing is autonomous, predictive, and resilient.
                    AlerionAI exists to bridge the gap between physical machinery and digital intelligence.
                </p>
            </section>

            {/* Engineering Philosophy */}
            <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Our Philosophy</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-6">Engineering Rigor First.</h2>
                    <div className="space-y-6 text-white/60 leading-relaxed">
                        <p>
                            We don't just build software; we build mission-critical infrastructure.
                            When a turbine fails or a pressure valve bursts, it's not just a bug—it's a safety hazard.
                        </p>
                        <p>
                            That's why we prioritize <strong>correctness over speed</strong>,
                            <strong>observability over features</strong>, and
                            <strong>resilience over hype</strong>.
                        </p>
                    </div>
                </div>
                <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm h-auto">
                    <h3 className="text-lg font-semibold mb-4 text-white">Core Values</h3>
                    <ul className="space-y-4">
                        {[
                            { title: 'Production-First', desc: 'Code isn\'t done until it survives production traffic.' },
                            { title: 'Scalability by Design', desc: 'We architect for millions of nodes from day one.' },
                            { title: 'Radical Transparency', desc: 'We share our post-mortems and our roadmap.' },
                        ].map((val) => (
                            <li key={val.title} className="flex gap-4">
                                <div className="w-1 h-full min-h-[40px] bg-blue-500 rounded-full" />
                                <div>
                                    <h4 className="font-medium text-white">{val.title}</h4>
                                    <p className="text-sm text-white/40">{val.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </SpotlightCard>
            </section>

            {/* Team Section */}
            <section className="relative z-10">
                <h2 className="text-3xl font-bold mb-12 text-center">The Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAM.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <SpotlightCard className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/[0.07] transition-colors group flex flex-col h-full items-start text-left">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="font-bold text-lg mb-1 text-white">{member.name}</h3>
                                <p className="text-blue-400 text-sm font-medium mb-3">{member.role}</p>
                                <p className="text-white/40 text-sm leading-relaxed mb-4 flex-grow">{member.bio}</p>

                                <div className="pt-4 border-t border-white/5 w-full">
                                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Focus</span>
                                    <p className="text-xs text-white/60 font-mono mt-1">{member.focus}</p>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};
