import Link from 'next/link';

const repoPath = 'your-username/adv-installer';
const packageName = 'adv-installer';
const version = '0.1.0';

async function getStars(): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!res.ok) return 0;

    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

function TerminalDemo() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-xs text-zinc-500">
        <div className="h-3 w-3 rounded-full bg-rose-400/70" />
        <div className="h-3 w-3 rounded-full bg-amber-400/70" />
        <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-2">terminal • anywhere on your machine</span>
      </div>

      <div className="space-y-2 p-5 font-mono text-sm leading-7">
        <p>
          <span className="text-zinc-600">$</span>{' '}
          <span className="text-emerald-400">npm install -g {packageName}</span>
        </p>
        <p>
          <span className="text-zinc-600">$</span>{' '}
          <span className="text-zinc-100">adv --version</span>
        </p>
        <p className="text-zinc-500">{version}</p>
        <p>
          <span className="text-zinc-600">$</span>{' '}
          <span className="text-zinc-100">adv install --quick nextjs</span>
        </p>
        <p className="text-zinc-500">Scaffolding Next.js project...</p>
        <p className="text-zinc-500">Adding Tailwind CSS...</p>
        <p className="text-zinc-500">Installing shadcn/ui essentials...</p>
        <p className="text-emerald-400">Done. Your project is ready.</p>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Global CLI that stays simple',
    desc: 'Publish once to npm, then use adv from any terminal with a normal global install or npm link during development.',
  },
  {
    title: 'Interactive and quick modes',
    desc: 'Run the full guided flow or skip to a preset for Next.js, React, Tauri, Express, Hono, Expo, and AI chat starters.',
  },
  {
    title: 'Polished project add-ons',
    desc: 'Layer in Tailwind CSS, shadcn/ui, Git, README generation, ESLint, and Prettier without a pile of follow-up setup steps.',
  },
  {
    title: 'Safer release workflow',
    desc: 'Build with tsup, inspect package contents with npm pack --dry-run, and publish with a standard npm release flow.',
  },
];

const installOptions = [
  {
    label: 'Global install',
    command: `npm install -g ${packageName}`,
    note: 'Best when you want adv available in every terminal session.',
  },
  {
    label: 'One-off usage',
    command: `npx ${packageName} install`,
    note: 'Useful when you do not want to keep the CLI installed globally.',
  },
  {
    label: 'Local development',
    command: 'npm run link:global',
    note: 'Creates a global adv command from your local checkout while you are building the CLI.',
  },
];

const publishSteps = [
  'npm run lint',
  'npm run test',
  'npm run build',
  'npm run check:publish',
  'npm version patch',
  'npm publish',
];

export default async function HomePage() {
  const stars = await getStars();

  return (
    <>
      <section className="relative overflow-hidden px-6 pb-16 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-sm text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              v{version} npm-first CLI
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
                Install once.
                <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Run adv anywhere.
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
                adv-installer is a clean project scaffolding CLI for websites, apps, APIs, games,
                and AI builds. Publish it like a normal npm package, install it globally, and keep
                the command available in every terminal.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://www.npmjs.com/package/${packageName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
              >
                View npm package
              </a>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                Read install and publish docs
              </Link>
              <a
                href={`https://github.com/${repoPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-800 px-5 py-3 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100"
              >
                GitHub{stars > 0 ? ` • ${stars.toLocaleString()} stars` : ''}
              </a>
            </div>
          </div>

          <TerminalDemo />
        </div>
      </section>

      <section className="border-t border-zinc-800/60 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Why it feels better
            </p>
            <h2 className="text-3xl font-bold tracking-tight">A release flow that matches how npm CLIs should ship</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map(feature => (
              <div key={feature.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="mb-2 text-lg font-semibold text-zinc-100">{feature.title}</h3>
                <p className="leading-7 text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Install options
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Choose the way you want to run it</h2>
          </div>

          <div className="space-y-4">
            {installOptions.map(option => (
              <div key={option.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  {option.label}
                </p>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-100">
                  {option.command}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{option.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Publish flow
            </p>
            <h2 className="text-3xl font-bold tracking-tight">From local build to public package</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              The project now ships as a standard npm CLI package. No custom ZIP build is required,
              and the docs are centered around global installation and npm publishing.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
                Release checklist
              </p>
              <div className="space-y-3 font-mono text-sm">
                {publishSteps.map(step => (
                  <div key={step} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
                After publish
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm leading-7 text-zinc-100">
                <div>npm install -g {packageName}</div>
                <div>adv --version</div>
                <div>adv install</div>
              </div>
              <p className="mt-4 leading-7 text-zinc-400">
                That is the key outcome: once installed globally, <span className="font-mono text-zinc-200">adv</span> is available from every user terminal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
