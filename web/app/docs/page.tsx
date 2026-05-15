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

const packageName = 'adv-installer';

export default function DocsPage() {
  return (
    <div>
      <div className="mb-10">
        <div className="mb-4 inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-500">
          npm package workflow
        </div>
        <h1 className="text-4xl font-bold text-zinc-100">Documentation</h1>
        <P>
          This project now ships as a standard npm CLI. The primary goal is simple: install the
          package globally and have <IC>adv</IC> available from any terminal.
        </P>
      </div>

      <H2 id="quick-start">Quick start</H2>
      <P>Install the package globally, verify the command, then scaffold a project.</P>
      <Block>{`npm install -g ${packageName}
adv --version
adv install`}</Block>

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
      <Block>{`npx ${packageName} install`}</Block>

      <H2 id="verify">Verify adv is available everywhere</H2>
      <P>
        After a global install, open a fresh terminal and run:
      </P>
      <Block>{`adv --version`}</Block>
      <P>
        The CLI is globally available because <IC>package.json</IC> exposes the binary through:
      </P>
      <Block>{`"bin": {
  "adv": "./dist/index.js"
}`}</Block>

      <H2 id="cli-reference">CLI reference</H2>
      <P>The main command remains:</P>
      <Block>adv install</Block>
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
adv --version`}</Block>
      <P>Remove that global link later if you no longer need it:</P>
      <Block>{`npm unlink -g ${packageName}`}</Block>

      <H2 id="package-preview">Preview the published package contents</H2>
      <P>
        The old custom ZIP workflow has been removed. Use the standard npm package preview instead.
      </P>
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

      <P>
        You should also confirm that the package name is available before release:
      </P>
      <Block>{`npm view ${packageName}`}</Block>

      <H2 id="after-publish">After publish</H2>
      <P>Verify the real install path from a clean terminal session.</P>
      <Block>{`npm install -g ${packageName}
adv --version
adv install --dry-run`}</Block>

      <H2 id="website-notes">Website notes</H2>
      <P>
        The website source is under <IC>web/</IC>. Run it locally with:
      </P>
      <Block>{`cd web
npm install
npm run dev`}</Block>
    </div>
  );
}
