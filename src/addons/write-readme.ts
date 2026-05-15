import path from 'path';
import fs from 'fs-extra';
import type { InstallOptions } from '../types/installer.js';

export async function writeReadme(projectDir: string, options: InstallOptions): Promise<void> {
  const { projectName, framework, packageManager, tailwind, uiLibrary } = options;

  const extras: string[] = [];
  if (tailwind) extras.push('Tailwind CSS');
  if (uiLibrary !== 'none') extras.push(uiLibrary === 'shadcn' ? 'shadcn/ui' : 'DaisyUI');

  const extrasLine = extras.length > 0 ? `\nIncludes: ${extras.join(', ')}\n` : '';

  const content = `# ${projectName}

A ${framework} project created with [adv.installer](https://github.com/your-username/adv.installer).
${extrasLine}
## Getting started

\`\`\`bash
${packageManager} install
${packageManager} run dev
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
| \`${packageManager} run dev\` | Start the development server |
| \`${packageManager} run build\` | Build for production |
| \`${packageManager} run preview\` | Preview the production build |
`;

  const readmePath = path.join(projectDir, 'README.md');
  const exists = await fs.pathExists(readmePath);

  // Don't overwrite an existing README created by the scaffolder
  if (!exists) {
    await fs.writeFile(readmePath, content);
  }
}
