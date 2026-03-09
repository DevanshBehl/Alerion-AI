import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Footer />
        </div>
    );
};
