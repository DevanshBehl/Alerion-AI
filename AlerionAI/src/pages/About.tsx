import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';

const TEAM = [
    {
        name: 'Devansh Behl',
        role: 'Lead Full Stack Engineer',
        bio: 'Computer Science student at Vellore Institute of Technology. Architecting scalable distributed systems and realtime interfaces.',
        focus: 'System Architecture',
    },
    {
        name: 'Lay Gupta',
        role: 'Backend & ML Engineer',
        bio: 'Student at Vellore Institute of Technology. Specialist in Kafka event streaming and predictive anomaly detection models.',
        focus: 'Machine Learning',
    },
    {
        name: 'Madhur Tiwari',
        role: 'Frontend & UI/UX Designer',
        bio: 'Student at Vellore Institute of Technology. Crafting pixel-perfect, interactive experiences for complex industrial data.',
        focus: 'UI/UX Engineering',
    },
];

export const About = () => {
    return (
        <div className="pt-12 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
            {/* Mission */}
            <section className="text-center mb-20">
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-bold mb-5 tracking-tight text-text-primary"
                >
                    Building the Nervous System <br />
                    of <span className="text-accent">Industry 4.0</span>
                </motion.h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    We believe that the future of manufacturing is autonomous, predictive, and resilient.
                    AlerionAI exists to bridge the gap between physical machinery and digital intelligence.
                </p>
            </section>

            {/* Philosophy */}
            <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-indigo-200 mb-5">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">Our Philosophy</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-5">Engineering Rigor First.</h2>
                    <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
                        <p>
                            We don't just build software; we build mission-critical infrastructure.
                            When a turbine fails or a pressure valve bursts, it's not just a bug — it's a safety hazard.
                        </p>
                        <p>
                            That's why we prioritize <strong className="text-text-primary">correctness over speed</strong>,{' '}
                            <strong className="text-text-primary">observability over features</strong>, and{' '}
                            <strong className="text-text-primary">resilience over hype</strong>.
                        </p>
                    </div>
                </div>

                <Card>
                    <h3 className="text-base font-semibold text-text-primary mb-4">Core Values</h3>
                    <ul className="space-y-4">
                        {[
                            { title: 'Production-First', desc: "Code isn't done until it survives production traffic." },
                            { title: 'Scalability by Design', desc: 'We architect for millions of nodes from day one.' },
                            { title: 'Radical Transparency', desc: 'We share our post-mortems and our roadmap.' },
                        ].map((val) => (
                            <li key={val.title} className="flex gap-3">
                                <div className="w-1 rounded-full bg-accent flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-sm text-text-primary">{val.title}</h4>
                                    <p className="text-sm text-text-muted">{val.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </section>

            {/* Team */}
            <section>
                <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">The Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {TEAM.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <Card hover className="h-full flex flex-col">
                                <div className="w-14 h-14 rounded-full bg-accent-light border border-border flex items-center justify-center text-lg font-bold text-accent mb-4">
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="font-semibold text-text-primary mb-0.5">{member.name}</h3>
                                <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                                <p className="text-text-muted text-sm leading-relaxed mb-4 flex-grow">
                                    {member.bio}
                                </p>
                                <div className="pt-3 border-t border-border-light">
                                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                                        Focus
                                    </span>
                                    <p className="text-xs text-text-secondary font-mono mt-0.5">{member.focus}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};
