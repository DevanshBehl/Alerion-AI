import { LoginForm } from '../components/auth/LoginForm';
import { PageTransition } from '../components/layout/PageTransition';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const Login = () => {
    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center bg-background px-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-accent flex items-center justify-center mb-5">
                            <Activity size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
                        <p className="text-text-secondary text-sm">
                            Enter your credentials to access the telemetry dashboard.
                        </p>
                    </div>

                    <Card className="shadow-sm">
                        <LoginForm />
                    </Card>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent hover:text-accent-hover font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </PageTransition>
    );
};
