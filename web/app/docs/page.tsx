import { npmUrl, packageName, packageVersion, repoUrl } from '../../lib/site';

function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.8em] text-emerald-300">
      {children}
    </code>
  );
}

function Block({ children }: { children: string }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm leading-7 text-zinc-100">
      {children}
    </pre>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-20 border-b border-zinc-800 pb-3 text-2xl font-bold text-zinc-100 first:mt-0">
      {children}
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mt-8 scroll-mt-20 text-lg font-semibold text-zinc-200">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-7 text-zinc-400">{children}</p>;
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900">
          <tr>
            {headers.map(header => (
              <th key={header} className="px-4 py-3 font-semibold text-zinc-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top text-zinc-400">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div>
      <div className="mb-10">
        <div className="mb-4 inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-500">
          v{packageVersion} npm package workflow
        </div>
        <h1 className="text-4xl font-bold text-zinc-100">Documentation</h1>
        <P>
          This project ships as a standard npm CLI. The goal is simple: install the package globally
          and have <IC>adv</IC> available from any terminal, while still supporting clean one-off
          runs through <IC>npx {packageName}</IC>.
        </P>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            npm package
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            GitHub repo
          </a>
        </div>
      </div>

      <H2 id="quick-start">Quick start</H2>
      <P>Install the package globally, verify the command, then scaffold a project.</P>
      <Block>{`npm install -g ${packageName}
adv --version
adv`}</Block>

      <H2 id="installation">Install</H2>
      <P>Any package manager with global install support works.</P>
      <Block>{`# npm
npm install -g ${packageName}

# pnpm
pnpm add -g ${packageName}

# yarn
yarn global add ${packageName}

# bun
bun add -g ${packageName}`}</Block>

      <P>If you only want to run it once without keeping it installed globally:</P>
      <Block>{`npx ${packageName}`}</Block>

      <H2 id="verify">Verify adv is available everywhere</H2>
      <P>After a global install, open a fresh terminal and run:</P>
      <Block>{`adv --version
adv-installer --version`}</Block>
      <P>
        The CLI is globally available because <IC>package.json</IC> exposes both binaries through the
        standard npm <IC>bin</IC> field.
      </P>
      <Block>{`"bin": {
  "adv": "dist/index.js",
  "adv-installer": "dist/index.js"
}`}</Block>

      <H2 id="cli-reference">CLI reference</H2>
      <P>The supported command styles are:</P>
      <Block>{`adv
adv install
adv init
npx ${packageName}`}</Block>
      <P>
        When an upstream generator asks follow-up questions, the CLI keeps that prompt stream visible
        so you can answer it directly. That applies to tools like <IC>create-next-app</IC>, Astro,
        T3, Expo, and similar scaffolders.
      </P>

      <H3 id="flags">Flags</H3>
      <Table
        headers={['Flag', 'Purpose']}
        rows={[
          [<IC key="quick">{'--quick <preset>'}</IC>, 'Use a preset and skip most prompts.'],
          [<IC key="name">{'--name <project-name>'}</IC>, 'Set the project name without prompting.'],
          [<IC key="dir">{'--dir <path>'}</IC>, 'Set the target directory without prompting.'],
          [<IC key="pm">{'--package-manager <pm>'}</IC>, 'Choose pnpm, npm, yarn, or bun.'],
          [<IC key="skip">--skip-install</IC>, 'Skip the final dependency installation step.'],
          [<IC key="yes">--yes</IC>, 'Skip the final create-project confirmation prompt.'],
          [<IC key="dry">--dry-run</IC>, 'Preview changes without creating files or running commands.'],
          [<IC key="verbose">--verbose</IC>, 'Print additional command execution details.'],
          [<IC key="color">--no-color</IC>, 'Disable color output.'],
          [<IC key="version">--version</IC>, 'Print the installed package version.'],
          [<IC key="help">--help</IC>, 'Show help text.'],
        ]}
      />

      <H2 id="quick-presets">Quick presets</H2>
      <P>These presets are the fastest path to a working starter.</P>
      <Block>{`adv install --quick nextjs
adv install --quick react
adv install --quick tauri
adv install --quick express
adv install --quick hono
adv install --quick expo
adv install --quick ai-chat`}</Block>

      <H3 id="scripted-runs">Scripted runs</H3>
      <P>For smoke tests or repeatable setup, pass the remaining answers as explicit flags.</P>
      <Block>{`adv --quick express --name api --dir ./api --package-manager npm --skip-install --yes
npx ${packageName} --quick express --name api --dir ./api --package-manager npm --skip-install --yes`}</Block>

      <H2 id="local-development">Build locally</H2>
      <P>Use the root project to develop and build the CLI package.</P>
      <Block>{`npm install
npm run build
node dist/index.js --version`}</Block>

      <H2 id="global-linking">Link globally while developing</H2>
      <P>
        If you want your local checkout to behave like a globally installed package on your own
        machine, use npm linking.
      </P>
      <Block>{`npm run link:global
adv --version
adv-installer --version`}</Block>
      <P>Remove that global link later if you no longer need it:</P>
      <Block>{`npm run unlink:global`}</Block>

      <H2 id="package-preview">Preview the published package contents</H2>
      <P>The old custom ZIP workflow has been removed. Use the standard npm package preview instead.</P>
      <Block>{`npm run check:publish
npm pack --dry-run`}</Block>
      <P>
        That shows exactly what will be published from the package, including the compiled CLI in
        <IC>dist/</IC>.
      </P>

      <H2 id="tailwind">Tailwind integration</H2>
      <P>
        The Tailwind add-on now does more than install packages. It checks whether Tailwind is already
        present, skips duplicate setup when the scaffold already included it, and edits project files
        when setup is needed.
      </P>
      <Table
        headers={['Project type', 'Behavior']}
        rows={[
          ['Next.js and built-in Tailwind starters', 'Detected and skipped when Tailwind is already configured.'],
          ['React + Vite / Vue + Vite', 'Installs missing Tailwind packages, edits the Vite config, and updates the entry CSS file.'],
          ['Astro', 'Runs the official astro Tailwind integration command.'],
          ['shadcn quick presets', 'Default to the essential component set instead of installing every component.'],
        ]}
      />

      <H2 id="publishing">Before publish</H2>
      <P>Run the full validation flow before releasing.</P>
      <Block>{`npm run lint
npm run test
npm run build
npm run check:publish`}</Block>

      <H3 id="publish-steps">Publish steps</H3>
      <P>Once the package is ready:</P>
      <Block>{`npm login
npm version patch
npm publish`}</Block>
      <P>If you publish under a scope, use:</P>
      <Block>{`npm publish --access public`}</Block>

      <P>You should also confirm that the package name is available before release:</P>
      <Block>{`npm view ${packageName}`}</Block>

      <H2 id="after-publish">After publish</H2>
      <P>Verify the real install path from a clean terminal session.</P>
      <Block>{`npm install -g ${packageName}
adv --version
adv-installer --help
adv init --quick express --name api --dir ./api --package-manager npm --skip-install --yes
npx ${packageName} --quick express --name api --dir ./api --package-manager npm --skip-install --yes`}</Block>

      <H2 id="website-notes">Website notes</H2>
      <P>The website source is under <IC>web/</IC>. Run it locally with:</P>
      <Block>{`cd web
npm install
npm run dev`}</Block>
    </div>
  );
}
