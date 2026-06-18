import path from 'path';
import fs from 'fs-extra';
import type { InstallOptions } from '../types/installer.js';

const REPOSITORY_URL = 'https://github.com/Razin-developer/adv.installer';

function getScriptRows(options: InstallOptions): Array<{ command: string; description: string }> {
  const { packageManager, projectType, framework } = options;
  const rows = [
    { command: `${packageManager} run dev`, description: 'Start the development server' },
    { command: `${packageManager} run build`, description: 'Build for production' },
  ];

  if (projectType === 'backend') {
    rows.push({ command: `${packageManager} run start`, description: 'Run the production server' });
    return rows;
  }

  if (framework === 'react-vite' || framework === 'vue-vite') {
    rows.push({
      command: `${packageManager} run preview`,
      description: 'Preview the production build',
    });
    return rows;
  }

  if (framework === 'nextjs') {
    rows.push({ command: `${packageManager} run start`, description: 'Start the production app' });
  }

  return rows;
}

export async function writeReadme(projectDir: string, options: InstallOptions): Promise<void> {
  const { projectName, framework, packageManager, tailwind, uiLibrary } = options;

  const extras: string[] = [];
  if (tailwind) extras.push('Tailwind CSS');
  if (uiLibrary !== 'none') extras.push(uiLibrary === 'shadcn' ? 'shadcn/ui' : 'DaisyUI');

  const extrasLine = extras.length > 0 ? `\nIncludes: ${extras.join(', ')}\n` : '';
  const scriptRows = getScriptRows(options)
    .map(row => `| \`${row.command}\` | ${row.description} |`)
    .join('\n');

  const content = `# ${projectName}

A ${framework} project created with [adv.installer](${REPOSITORY_URL}).
${extrasLine}
## Getting started

\`\`\`bash
${packageManager} install
${packageManager} run dev
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
${scriptRows}
`;

  const readmePath = path.join(projectDir, 'README.md');
  const exists = await fs.pathExists(readmePath);

  // Don't overwrite an existing README created by the scaffolder
  if (!exists) {
    await fs.writeFile(readmePath, content);
  }
}
