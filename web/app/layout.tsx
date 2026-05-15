import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

const repoPath = 'your-username/adv-installer';

export const metadata: Metadata = {
  title: {
    default: 'adv-installer | Scaffold projects faster',
    template: '%s | adv-installer',
  },
  description:
    'A polished CLI for scaffolding websites, apps, APIs, and AI projects with presets, add-ons, and smart defaults.',
};

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-zinc-800/70 bg-zinc-950/85 backdrop-blur">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-emerald-400">adv</span>
              <span className="font-mono text-sm text-zinc-500">installer</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/docs" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
                Docs
              </Link>
              <a
                href={`https://github.com/${repoPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                <GitHubIcon />
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <main className="pt-14">{children}</main>

        <footer className="mt-24 border-t border-zinc-800/60 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-emerald-400">adv</span>
              <span className="font-mono text-sm text-zinc-500">installer</span>
            </div>

            <p className="text-center text-sm text-zinc-500 sm:text-right">
              Publish once, run <span className="font-mono text-zinc-300">adv</span> anywhere.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
