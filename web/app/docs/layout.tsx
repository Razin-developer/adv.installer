import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs',
};

const nav = [
  {
    group: 'Start',
    links: [
      { label: 'Quick start', href: '#quick-start' },
      { label: 'Install', href: '#installation' },
      { label: 'Verify adv', href: '#verify' },
    ],
  },
  {
    group: 'CLI',
    links: [
      { label: 'Core command', href: '#cli-reference' },
      { label: 'Quick presets', href: '#quick-presets' },
      { label: 'Flags', href: '#flags' },
    ],
  },
  {
    group: 'Development',
    links: [
      { label: 'Build locally', href: '#local-development' },
      { label: 'Link globally', href: '#global-linking' },
      { label: 'Package preview', href: '#package-preview' },
      { label: 'Tailwind integration', href: '#tailwind' },
    ],
  },
  {
    group: 'Publish',
    links: [
      { label: 'Before publish', href: '#publishing' },
      { label: 'Publish steps', href: '#publish-steps' },
      { label: 'Post publish', href: '#after-publish' },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex gap-12">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-6">
            {nav.map(section => (
              <div key={section.group}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  {section.group}
                </p>
                <ul className="space-y-1">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <a href={link.href} className="block py-0.5 text-sm text-zinc-400 transition hover:text-zinc-100">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
