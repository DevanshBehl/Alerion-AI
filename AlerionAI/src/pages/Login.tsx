import { LoginForm } from '../components/auth/LoginForm';
import { PageTransition } from '../components/layout/PageTransition';
import { BackgroundBeams } from '../components/ui/background-beams';
import { SpotlightCard } from '../components/ui/spotlight';

export const Login = () => {
    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans selection:bg-blue-500/30">
                {/* Background Effects */}
                <BackgroundBeams className="opacity-40" />

                <div className="relative z-10 w-full max-w-md p-6">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-3xl shadow-lg shadow-blue-500/20 mb-6 rotate-3">
                            A
                        </div>
                        <h1 className="text-3xl font-bold mb-3 tracking-tight text-white">Welcome Back</h1>
                        <p className="text-white/50">Enter your credentials to access the telemetry dashboard.</p>
                    </div>

                    <SpotlightCard className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl h-auto">
                        <LoginForm />
                    </SpotlightCard>
                </div>
            </div>
        </PageTransition>
    );
};
