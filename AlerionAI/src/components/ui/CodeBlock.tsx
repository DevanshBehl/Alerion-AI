import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
}

export const CodeBlock = ({ code, language = 'bash', filename }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
            {(filename || language) && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <span className="text-xs font-mono text-white/50">{filename || language}</span>
                    <button
                        onClick={copyToClipboard}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>
            )}
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-blue-100/90">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};
