import { APP_NAME } from '../../utils/constants';

export const Footer = () => {
    return (
        <footer className="border-t border-border bg-surface py-8 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-text-muted">
                    © {new Date().getFullYear()} {APP_NAME}. Distributed Systems & AI Engineering.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                        Terms
                    </a>
                    <a
                        href="https://github.com/DevanshBehl/Alerion-AI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};
