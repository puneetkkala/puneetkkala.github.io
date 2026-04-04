'use client'

import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
    children?: React.ReactNode
    className?: string
    [key: string]: unknown
}

export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
    const preRef = useRef<HTMLPreElement>(null)
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        const text = preRef.current?.innerText ?? ''
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // clipboard may be unavailable in some environments
        }
    }

    return (
        <div className="code-block-wrapper">
            <button
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : 'Copy code'}
                title={copied ? 'Copied!' : 'Copy code'}
                className="code-copy-btn"
            >
                {copied ? (
                    <Check size={14} aria-hidden="true" />
                ) : (
                    <Copy size={14} aria-hidden="true" />
                )}
                <span className="code-copy-label">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <pre ref={preRef} className={className} {...rest}>
                {children}
            </pre>
        </div>
    )
}
